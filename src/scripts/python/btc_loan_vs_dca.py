#!/usr/bin/env python3
"""
100 k USD BTC deployment – Loan vs. DCA (profit-based)
────────────────────────────────────────────────────────────────────────
Options
───────
--start YYYY-MM-DD    : first start-date in the scatter plot
--debug YYYY-MM-DD    : detailed ledger for that start-date
--flash-crash PRICE   : value both stacks at that USD price the day
                        *after* the normal evaluation date
--future-scenario     : append an 18-month synthetic path:
                          • +6 m → 170 000 (bull)
                          • +4 m →  65 000 (crash)
                          • +8 m →  65 000 (flat)
"""

# ────────────────────────────────────────────────────────────────
# Imports
# ────────────────────────────────────────────────────────────────
import argparse
from pathlib import Path
from dateutil.relativedelta import relativedelta

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ────────────────────────────────────────────────────────────────
# Parameters – adjust at will
# ────────────────────────────────────────────────────────────────
CSV_FILE          = Path(__file__).with_name("BTCUSDT_1h.csv")

CASH_UPFRONT      = 20_000          # USD paid immediately
LOAN_PRINCIPAL    = 80_000          # USD financed
TERM_MONTHS       = 60              # five years
ANNUAL_RATE       = 0.10
MONTHLY_RATE      = ANNUAL_RATE / 12

MONTHLY_PAYMENT = (
    LOAN_PRINCIPAL * MONTHLY_RATE * (1 + MONTHLY_RATE) ** TERM_MONTHS
    / ((1 + MONTHLY_RATE) ** TERM_MONTHS - 1)
)

# ────────────────────────────────────────────────────────────────
# CLI
# ────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(
    description="Loan vs. DCA BTC deployment – PROFIT comparison"
)
parser.add_argument("--start",        metavar="YYYY-MM-DD",
                    help="First start-date to include in the full analysis plot.")
parser.add_argument("--debug",        metavar="YYYY-MM-DD",
                    help="Show detailed ledger and $-profits for this single start-date.")
parser.add_argument("--flash-crash",  metavar="PRICE", type=float,
                    help="Assume BTC crashes to this USD price the day after valuation.")
parser.add_argument("--future-scenario", action="store_true",
                    help="Append the 18-month bull/crash/flat path to price history.")
args = parser.parse_args()

if args.flash_crash is not None and args.flash_crash <= 0:
    raise SystemExit("❌  --flash-crash price must be a positive number")
crash_price = args.flash_crash   # None when flag not used

# ────────────────────────────────────────────────────────────────
# Load Binance 1-hour CSV → UTC-daily closes
# ────────────────────────────────────────────────────────────────
hourly = pd.read_csv(CSV_FILE, usecols=["openTime", "close"])
hourly["openTime"] = pd.to_datetime(hourly["openTime"])
hourly["date"]     = hourly["openTime"].dt.date

daily_close = (
    hourly.groupby("date").last()["close"]     # last hourly close of each day
    .rename("price")
    .sort_index()
)
# **Unified index type** – always pd.Timestamp
daily_close.index = pd.to_datetime(daily_close.index)

price_series = daily_close.copy()              # Series {date → price}

# ────────────────────────────────────────────────────────────────
# Optional synthetic future path
# ────────────────────────────────────────────────────────────────
def append_future_scenario(series: pd.Series) -> pd.Series:
    """
    Return a new series with the 18-month bull→bear→flat path appended.
    """
    start_date  = series.index[-1]
    start_price = series.iloc[-1]

    # Helper to build one leg of the path
    def build_leg(first_day, last_day, p0, p1) -> pd.Series:
        dates  = pd.date_range(start=first_day, end=last_day, freq="D")
        prices = np.linspace(p0, p1, len(dates))
        return pd.Series(prices, index=dates, name="price")

    # Bull run: +6 months to 170k
    end_bull = start_date + relativedelta(months=+6)
    bull_leg = build_leg(start_date + pd.Timedelta(days=1), end_bull,
                         start_price, 170_000)

    # Crash: +4 months down to 65k
    end_crash = end_bull + relativedelta(months=+4)
    crash_leg = build_leg(end_bull + pd.Timedelta(days=1), end_crash,
                          170_000, 65_000)

    # Flat: +8 months flat at 65k
    end_flat = end_crash + relativedelta(months=+8)
    flat_leg = pd.Series(65_000,
                         index=pd.date_range(end_crash + pd.Timedelta(days=1),
                                             end_flat, freq="D"),
                         name="price")

    return pd.concat([series, bull_leg, crash_leg, flat_leg])

if args.future_scenario:
    price_series = append_future_scenario(price_series)

# Globals derived from (possibly) extended data
dates = price_series.index.sort_values()         # DateTimeIndex


def price_on(date_like) -> float:
    """
    BTC price on *any* calendar date (falls back to most recent prior day).
    Accepts pd.Timestamp, datetime.date, or str(YYYY-MM-DD).
    """
    ts = pd.Timestamp(date_like)
    if ts in price_series.index:
        return price_series.at[ts]
    prev = ts
    while prev not in price_series.index:
        prev -= pd.Timedelta(days=1)
    return price_series.at[prev]

# ────────────────────────────────────────────────────────────────
# Simulator for a single start-day
# ────────────────────────────────────────────────────────────────
def simulate_start(start_dt: pd.Timestamp, crash_px: float | None = None):
    """
    Return (profit_loan, profit_dca, ledger_df, eval_date, val_date).

    If ``crash_px`` is supplied, both strategies are valued one day
    after *eval_date* at that crash price.
    """
    start_dt = pd.Timestamp(start_dt)           # ensure Timestamp
    px0      = price_on(start_dt)
    full_btc = (CASH_UPFRONT + LOAN_PRINCIPAL) / px0

    # Evaluation date = min(start + 60 m, last available price)
    last_price_date = dates[-1]
    eval_date       = min(start_dt + relativedelta(months=TERM_MONTHS),
                          last_price_date)

    # Build ledger
    btc_dca = CASH_UPFRONT / px0
    rows = [{
        "Date"          : start_dt.date(),
        "Payment_USD"   : CASH_UPFRONT,
        "BTC_Price"     : px0,
        "BTC_Added_DCA" : CASH_UPFRONT / px0,
        "Cum_BTC_DCA"   : btc_dca,
    }]

    paid_months = 0
    pay_dt      = start_dt
    while True:
        pay_dt += relativedelta(months=1)
        if pay_dt > eval_date or paid_months >= TERM_MONTHS:
            break

        btc_price    = price_on(pay_dt)
        btc_added    = MONTHLY_PAYMENT / btc_price
        btc_dca     += btc_added
        paid_months += 1

        rows.append({
            "Date"          : pay_dt.date(),
            "Payment_USD"   : MONTHLY_PAYMENT,
            "BTC_Price"     : btc_price,
            "BTC_Added_DCA" : btc_added,
            "Cum_BTC_DCA"   : btc_dca,
        })

    ledger = pd.DataFrame(rows)

    # Profit / Loss
    eval_px      = price_on(eval_date)
    valuation_px = crash_px if crash_px is not None else eval_px
    val_date     = eval_date + pd.Timedelta(days=1) if crash_px else eval_date
    dollars_in   = CASH_UPFRONT + MONTHLY_PAYMENT * paid_months

    profit_loan = full_btc * valuation_px - (CASH_UPFRONT + LOAN_PRINCIPAL)
    profit_dca  = btc_dca * valuation_px - dollars_in

    return profit_loan, profit_dca, ledger, eval_date, val_date

# ────────────────────────────────────────────────────────────────
# Execution – debug vs. full analysis
# ────────────────────────────────────────────────────────────────
if args.debug:                             # ───────── DEBUG MODE ─────────
    try:
        debug_date = pd.to_datetime(args.debug, format="%Y-%m-%d")
    except ValueError:
        raise SystemExit("❌  --debug date must be YYYY-MM-DD")

    if debug_date < dates[0] or debug_date > dates[-1]:
        raise SystemExit("❌  Debug date outside price-history range")

    p_loan, p_dca, ledger, eval_dt, val_dt = simulate_start(debug_date,
                                                            crash_price)

    print("\nLedger up to", eval_dt.date(), "(evaluation date)")
    print(ledger.to_string(index=False, float_format=lambda x: f"{x:,.8f}"))

    scenario = (
        f"flash-crash at ${crash_price:,.0f} on {val_dt.date()}"
        if crash_price else
        f"valuation on {val_dt.date()}"
    )
    if args.future_scenario:
        scenario = "future-scenario, " + scenario

    print(f"\nSummary (USD) – {scenario}")
    print(f"  Loan strategy profit : {p_loan:,.2f}")
    print(f"  DCA  strategy profit : {p_dca :,.2f}")
    diff    = p_loan - p_dca
    winner  = "Loan" if diff > 0 else "DCA"
    print(f"  ⇒ {winner} wins by {abs(diff):,.2f}")

else:                                      # ─────── FULL ANALYSIS ───────
    # Optional --start filter
    if args.start:
        try:
            start_filter = pd.to_datetime(args.start, format="%Y-%m-%d")
        except ValueError:
            raise SystemExit("❌  --start date must be YYYY-MM-DD")

        if start_filter > dates[-1]:
            raise SystemExit("❌  --start date is after last price-date")

        mask        = dates >= start_filter
        start_dates = dates[mask]
    else:
        start_dates = dates

    n_trials   = len(start_dates)
    loan_wins  = np.zeros(n_trials, dtype=bool)

    for i, dt in enumerate(start_dates):
        p_loan, p_dca, *_ = simulate_start(dt, crash_price)
        loan_wins[i] = p_loan > p_dca

    win_count = int(loan_wins.sum())
    tag_future = " with future-scenario" if args.future_scenario else ""
    tag_crash  = f" under flash-crash to ${crash_price:,.0f}" if crash_price else ""
    print(
        f"Loan strategy beat DCA on {win_count:,d} of {n_trials:,d} "
        f"start-days ({win_count / n_trials:.1%}){tag_future}{tag_crash}."
    )

    # Scatter plot
    plt.figure(figsize=(12, 6))
    plt.scatter(
        start_dates,
        price_series.loc[start_dates],
        c=np.where(loan_wins, "green", "red"),
        s=8,
        linewidths=0,
    )
    title = "Start-day outcome (green = Loan wins, red = DCA wins)\n" \
            "Winner based on dollar profit at valuation date"
    if args.future_scenario:
        title += " – includes 18-month future path"
    if crash_price:
        title += f" + flash-crash to ${crash_price:,.0f}"
    plt.title(title)
    plt.xlabel("Start date (UTC)")
    plt.ylabel("BTC price on start-day (USDT)")
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.show()

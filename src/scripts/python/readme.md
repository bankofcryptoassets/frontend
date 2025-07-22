# BTC Loan vs. DCA – Profit Comparison

## Overview

`btc_loan_vs_dca.py` back‑tests two ways of deploying **US\$100 000** into Bitcoin:

1. **Loan strategy** – buy the full amount on day 0 using US\$20 000 cash plus an US\$80 000 loan amortised over 5 years at 10 % APR.
2. **Dollar‑cost averaging (DCA)** – invest the same cash‑flows month‑by‑month for 5 years.

For every potential start‑day in the provided BTC price history the script computes which approach yields the higher dollar profit. It can also drill into a single start‑day, price a “flash crash” the day after valuation, or append a hypothetical 18‑month future path.

The full back‑test prints a win‑rate summary and renders a coloured scatter plot (green = loan wins, red = DCA wins).

## Requirements

- Python 3.9+
- pandas · numpy · matplotlib · python‑dateutil

Install with:

```bash
pip install pandas numpy matplotlib python-dateutil
```

## Data

Copy `` (Binance 1‑hour klines) into the same folder. Only the `openTime` and `close` columns are used; the script aggregates them to daily closes automatically.

## Usage

```bash
python btc_loan_vs_dca.py [OPTIONS]
```

| Option                | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `--start YYYY-MM-DD`  | Start analysis no earlier than this date.                                                 |
| `--debug YYYY-MM-DD`  | Show detailed ledger and profit for that single start‑day.                                |
| `--flash-crash PRICE` | After valuation, force both stacks to be repriced at *PRICE* the next day.                |
| `--future-scenario`   | Append an 18‑month synthetic path: +6 m bull to 170 000, +4 m crash to 65 000, +8 m flat. |

### Quick examples

Full history back‑test:

```bash
python btc_loan_vs_dca.py
```

Focus on starts after 2020‑01‑01:

```bash
python btc_loan_vs_dca.py --start 2020-01-01
```

Ledger for 2021‑11‑10 with a crash to 25 000:

```bash
python btc_loan_vs_dca.py --debug 2021-11-10 --flash-crash 25000
```

Include hypothetical future path:

```bash
python btc_loan_vs_dca.py --future-scenario
```

## Adjusting the scenario

Edit the constants near the top of the script to change loan amount, term, interest rate, or initial cash.

## License

MIT – feel free to use and adapt.


'use client'
import { Accordion, AccordionItem } from '@heroui/react'
import { title } from '../primitives'

const FAQ_ITEMS = [
  {
    question: 'How does Bitmor work?',
    answer: (
      <div className="space-y-3">
        <p>
          Bitmor lets you own any amount of Bitcoin today and pay for it over 1,
          3, or 5 years. Just put down 25 % of your chosen BTC amount’s current
          price in USDC, and our lenders cover the rest. We buy and hold your
          BTC in an audited on-chain escrow, then you make fixed monthly USDC
          payments toward principal, interest, and fees. Your BTC is released at
          the end of the loan.
        </p>

        <div>
          <p>You can close or sell your position anytime:</p>

          <ul className="list-disc pl-6">
            <li>
              If BTC’s price is above your purchase price, we sell just enough
              to repay lenders + fees and hand the rest of the BTC back to you.
            </li>
            <li>If it’s below, closing early could mean a loss.</li>
          </ul>
        </div>

        <p>
          Miss a payment? We’ll automatically sell a small slice of your BTC to
          cover that month’s dues (as long as BTC stays above your personal
          safety level). Each payment increases your safety levels. For as long
          as you pay on time, you’re always protected from liquidations, and
          we’ll send friendly reminders before each payment is due.
        </p>
      </div>
    ),
  },
  {
    question: `What crypto assets do I need to get started?`,
    answer:
      'You only need USDC to cover your 25 % down payment and monthly payments, plus an EVM-compatible wallet (e.g. MetaMask or Phantom) to connect and sign transactions, no BTC or other tokens required up front.',
  },
  {
    question: 'Who is eligible for a Bitmor loan?',
    answer:
      'BitMor is open to everyone, no KYC or credit checks, so all you need is an EVM-compatible wallet and enough USDC for the down payment to start stacking sats with us (after all, we began with just a sat and a dream).',
  },
  {
    question:
      'How is my interest rate determined, and can it change over time?',
    answer:
      'Your rate is always capped at 11% APR, but when market conditions push borrowing costs lower, you’ll automatically pay the reduced rate for that month. Plus, keep that on-time payment streak alive, or refer a friend mid-term, and we’ll shave extra basis points off your rate as a thank-you!',
  },
  {
    question: 'What happens to my Bitcoin if I miss a payment?',
    answer:
      'Miss a payment? We’ll sell just a tiny slice of your escrowed BTC to cover that month’s dues, only if BTC stays above your personal safety price. Your safety price starts at 75 % of the purchase price and falls as you pay down principal, so your equity buffer grows over time. If BTC dips below that threshold and payments stop, a full liquidation would be required, but don’t worry, we’ll send friendly reminders before every due date!',
  },
  {
    question: 'How do you have no forced liquidations?',
    answer:
      'Every BitMor loan comes with our Liquidation Protection Plan, think of it as insurance that steps in if Bitcoin plunges too far, so you won’t face a forced sell-off. It’s valid for one year and renews annually (the premium can vary with market swings). We usually recommend a 1-year plan for new users and longer terms for more risk-tolerant borrowers.',
  },
  {
    question: 'Can I make extra payments or pay off my loan early?',
    answer:
      'Absolutely, feel free to prepay anytime! Just send enough USDC to cover your remaining balance and fees, and we’ll release the full BTC to you immediately!',
  },
]

export const FAQs = () => {
  return (
    <section className="container py-20 max-lg:py-16" id="faqs">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <h2 className={title({ size: 'xs', className: 'text-primary' })}>
            FAQs
          </h2>

          <p className="text-balance text-center text-lg text-default-d">
            Everything you need to know about Bitmor’s services.
          </p>
        </div>

        <div className="mt-6 w-full max-w-5xl">
          <Accordion
            fullWidth
            showDivider={false}
            variant="splitted"
            className="gap-0"
          >
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.question}
                title={item.question}
                classNames={{
                  base: 'mb-3 text-default-900 dark:text-default-800 mb-3',
                  title: 'font-semibold text-foreground',
                  indicator: 'text-default-700',
                  content: 'pt-0 pb-6',
                }}
              >
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

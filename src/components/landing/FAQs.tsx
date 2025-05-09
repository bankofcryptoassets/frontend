'use client'
import { Accordion, AccordionItem, Chip, cn } from '@heroui/react'
import { subtitle, title } from '../primitives'

const FAQ_ITEMS = [
  {
    question: 'What happens to my funds if I miss payments?',
    answer:
      "If BTC price drops, your loan terms remain unchanged. Unlike traditional crypto lending platforms, BitMore doesn't liquidate your position based on price fluctuations. Your monthly payments stay the same, and you continue to gain ownership of your Bitcoin as you make payments, regardless of market conditions.",
    color: 'bg-primary/20',
  },
  {
    question: `How are lenders' Funds protected?`,
    answer:
      'Yes, you can prepay your loan partially or in full at any time without penalties. Early repayment gives you faster access to your Bitcoin and can potentially increase your upside if BTC price rises during your loan term. Contact our support team to arrange prepayment options.',
    color: 'bg-secondary/20',
  },
  {
    question: 'How is the interest rate determined?',
    answer:
      'There is no automatic liquidation risk based on BTC price movements. As long as you make your scheduled payments, your position is secure regardless of market volatility. The only liquidation scenario would be after extended payment defaults as outlined in our terms of service.',
    color: 'bg-primary/20',
  },
  {
    question: 'How is the yield generated?',
    answer:
      "If you miss a payment, you'll receive notifications and a grace period to catch up. Multiple missed payments may result in late fees. After extended defaults (typically 90+ days), a portion of your Bitcoin collateral may be liquidated to cover outstanding obligations. We work with borrowers to find solutions before any liquidation occurs.",
    color: 'bg-secondary/20',
  },
  {
    question: 'Is there a liquidation risk?',
    answer:
      'Lender funds are protected through multiple security layers: 1) All Bitcoin collateral is held in secure multi-signature wallets, 2) Smart contracts ensure proper fund allocation, 3) Borrower payments go directly to lenders, and 4) Our liquidation protocol protects lender principal in default scenarios. Additionally, all code is audited by third-party security firms.',
    color: 'bg-primary/20',
  },
  {
    question: 'What happens if the BTC price drops?',
    answer:
      'Lender funds are protected through multiple security layers: 1) All Bitcoin collateral is held in secure multi-signature wallets, 2) Smart contracts ensure proper fund allocation, 3) Borrower payments go directly to lenders, and 4) Our liquidation protocol protects lender principal in default scenarios. Additionally, all code is audited by third-party security firms.',
    color: 'bg-primary/20',
  },
  {
    question: 'Can I prepay anytime?',
    answer:
      'Lender funds are protected through multiple security layers: 1) All Bitcoin collateral is held in secure multi-signature wallets, 2) Smart contracts ensure proper fund allocation, 3) Borrower payments go directly to lenders, and 4) Our liquidation protocol protects lender principal in default scenarios. Additionally, all code is audited by third-party security firms.',
    color: 'bg-primary/20',
  },
]

export const FAQs = () => {
  return (
    <section className="container py-20 max-lg:py-16" id="faqs">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <Chip color="primary" classNames={{ content: 'font-semibold' }}>
            FAQs
          </Chip>

          <h2 className={title({ size: 'xs' })}>Common Questions</h2>

          <p className={subtitle()}>
            Everything you need to know about BitMore&apos;s lending and
            borrowing services.
          </p>
        </div>

        <div className="mt-6 w-full max-w-5xl">
          <Accordion fullWidth showDivider={false} variant="splitted">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.question}
                title={item.question}
                classNames={{
                  base: cn(
                    'mb-3 text-default-900 dark:text-default-800',
                    item.color
                  ),
                  title: 'font-semibold text-foreground',
                  indicator: 'text-default-700',
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

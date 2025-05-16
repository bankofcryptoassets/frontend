'use client'
import { Accordion, AccordionItem, Chip, cn } from '@heroui/react'
import { subtitle, title } from '../primitives'

const FAQ_ITEMS = [
  {
    question: 'What happens to my funds if I miss payments?',
    answer: '',
    color: 'bg-primary/20',
  },
  {
    question: `How are lenders' Funds protected?`,
    answer: '',
    color: 'bg-secondary/20',
  },
  {
    question: 'How is the interest rate determined?',
    answer: '',
    color: 'bg-primary/20',
  },
  {
    question: 'How is the yield generated?',
    answer: '',
    color: 'bg-secondary/20',
  },
  {
    question: 'Is there a liquidation risk?',
    answer: '',
    color: 'bg-primary/20',
  },
  {
    question: 'What happens if the BTC price drops?',
    answer: '',
    color: 'bg-primary/20',
  },
  {
    question: 'Can I prepay anytime?',
    answer: '',
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

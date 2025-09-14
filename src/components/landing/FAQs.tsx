'use client'
import { Accordion, AccordionItem, Link } from '@heroui/react'
import NextLink from 'next/link'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Glow } from './Glow'

export const FAQs = () => {
  return (
    <section className="container pb-50 max-lg:pb-30" id="faqs">
      <div className="flex w-full justify-between gap-10 max-lg:flex-col">
        <div className="relative z-1 flex flex-col gap-4">
          <Glow className="absolute -top-10 right-full z-0 h-[158px] w-[72px] -translate-x-full rotate-22 blur-[100px]" />

          <h2 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-[32px]">
            FAQs
          </h2>

          <p className="text-foreground/70 text-base leading-tight font-normal">
            Everything you need to know, <br className="max-lg:hidden" />
            No surprises.
          </p>

          <Link
            as={NextLink}
            href="/borrow"
            className="text-foreground group mt-2 w-fit gap-2 leading-tight font-medium"
          >
            See More{' '}
            <IoIosArrowRoundForward
              size={24}
              className="transition-transform group-hover:translate-x-2"
            />
          </Link>
        </div>

        <div className="w-full max-w-[716px] max-lg:w-full max-lg:max-w-full">
          <Accordion
            fullWidth
            showDivider={false}
            variant="splitted"
            className="gap-0 max-lg:px-0!"
          >
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.question}
                title={item.question}
                classNames={{
                  base: 'mb-3 text-default-900 dark:text-default-800 mb-3 border border-default-100 rounded-xl shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] bg-transparent',
                  trigger: 'cursor-pointer',
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

const FAQ_ITEMS = [
  {
    question: 'How does Bitmor work?',
    answer: (
      <div>
        <p>Bitmor helps you own Bitcoin in two ways:</p>

        <ul className="list-disc pl-6">
          <li>
            With DCA (Dollar-Cost Averaging) you invest automatically over time.
          </li>
          <li>
            With Loans, you can lock in Bitcoin now and pay it off monthly.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: `What crypto assets do I need to begin?`,
    answer:
      'You only need USDC to use our DCA and Loan product. For DCA, you can start with as little as 1USDC per day.',
  },
  {
    question: 'What is DCA and why use it?',
    answer:
      'DCA means investing small amounts regularly, instead of trying to time the market. It helps reduce stress and smooths out price swings.',
  },
  {
    question: 'Can I change or pause my DCA plan?',
    answer: 'Yes, you can adjust, pause, or cancel anytime with no penalties.',
  },
  {
    question: 'Who is eligible for a Bitmor loan?',
    answer:
      'BitMor is open to everyone, no KYC or credit checks, so all you need is an EVM-compatible wallet and enough USDC for the down payment to start stacking sats with us (after all, we began with just a sat and a dream).',
  },
  {
    question: 'What happens if Bitcoin’s price drops while my loan is active?',
    answer:
      'Unlike traditional crypto lenders, Bitmor does not force liquidations. You keep your Bitcoin as long as you’re making payments.',
  },
  {
    question: 'Can I make extra payments or pay off early?',
    answer: 'Yes. You can pay off your loan anytime.',
  },
  {
    question: 'What happens if I miss a Payment?',
    answer: (
      <div className="space-y-3">
        <p>
          If you miss a payment, we’ll cover it by selling just a small bit of
          your escrowed Bitcoin,.but only if the current BTC price is above your
          personal safety price.
        </p>
        <p>
          Your safety price starts at 70% of your purchase price and goes lower
          as you pay down the loan, giving you more protection over time.
        </p>
        <p>
          If Bitcoin ever drops below that level and payments stop, a full
          sell-off may be needed — but don’t worry, we’ll always remind you
          before any due date.
        </p>
      </div>
    ),
  },
  {
    question: 'Will my interest rate ever increase?',
    answer: (
      <div className="space-y-3">
        <p>
          Your APR is always capped at 11%, but if market rates drop, you’ll
          automatically pay less for that month.
        </p>
        <p>
          Make on-time payments (or refer a friend!) and we’ll lower your rate
          even further as a reward.
        </p>
      </div>
    ),
  },
]

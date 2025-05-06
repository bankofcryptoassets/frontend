import { title, subtitle } from '@/components/primitives'
import { Button } from '@heroui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-secondary-50">
      <main className="container mx-auto max-w-7xl flex-grow px-6 py-16">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-4xl justify-center text-center">
            <h1 className="max-lg:text-balance">
              <span className={title()}>Buy Bitcoin with 80% Financing. </span>
              <span className={title({ color: 'yellow' })}>
                Earn <br className="max-lg:hidden" /> Yield
              </span>
              <span className={title()}> Backed by Real Demand.</span>
            </h1>

            <p className={subtitle({ class: 'mt-10' })}>
              BitMore lets you own BTC with a small upfront payment or earn
              yield by lending to Bitcoin buyers. All secured by smart
              contracts.
            </p>
          </div>

          <div className="mt-12 flex gap-8">
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              as={Link}
              href="/borrow"
            >
              Start Borrowing
            </Button>
            <Button
              color="secondary"
              variant="shadow"
              size="lg"
              as={Link}
              href="/lend"
            >
              Start Earning
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

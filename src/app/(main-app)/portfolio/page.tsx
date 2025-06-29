import { NoData } from '@/components/NoData'
import { title } from '@/components/primitives'

export default function PortfolioPage() {
  return (
    <div
      className="container mt-10 flex h-full w-full flex-col gap-4 pb-10"
      id="portfolio-page"
    >
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className={title({ size: 'sm', className: 'text-primary' })}>
            My Portfolio
          </h1>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <NoData message="Coming soon" />
      </div>
    </div>
  )
}

import { Footer } from '@/components/Footer'
import {
  Borrowers,
  CTABanner,
  FAQs,
  Hero,
  Lenders,
  Stats,
  Team,
  WhyBitmor,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Borrowers />
      <WhyBitmor />
      <Lenders />
      <Team />
      <FAQs />
      <CTABanner />
      <Footer />
    </>
  )
}

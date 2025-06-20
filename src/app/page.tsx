import { Footer } from '@/components/Footer'
import {
  Borrowers,
  CTABanner,
  FAQs,
  Hero,
  Lenders,
  Stats,
  Team,
  WhyBitcoin,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Borrowers />
      <WhyBitcoin />
      <Lenders />
      <Team />
      <FAQs />
      <CTABanner />
      <Footer />
    </>
  )
}

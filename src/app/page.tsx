import { Footer } from '@/components/Footer'
import {
  Borrowers,
  CTABanner,
  FAQs,
  Hero,
  Lenders,
  Stats,
  Team,
  WhyBitMore,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Borrowers />
      <Lenders />
      <WhyBitMore />
      <Team />
      <FAQs />
      <CTABanner />
      <Footer />
    </>
  )
}

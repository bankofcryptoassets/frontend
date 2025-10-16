import { Footer } from '@/components/Footer'
import {
  Hero,
  AboutBitmore,
  JustLikeMortgage,
  BitcoinJourney,
  Testimonials,
  FAQs,
  CTABanner,
  Roadmap,
} from '@/components/landing'
import { SmoothScroll } from '@/components/SmoothScroll'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutBitmore />
      <JustLikeMortgage />
      <BitcoinJourney />
      <Roadmap />
      <Testimonials />
      <FAQs />
      <CTABanner />
      <Footer />
      <SmoothScroll />
    </>
  )
}

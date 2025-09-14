import { Footer } from '@/components/Footer'
import {
  Hero,
  AboutBitmore,
  JustLikeMortgage,
  BitcoinJourney,
  Testimonials,
  FAQs,
  CTABanner,
} from '@/components/landing'
import { SmoothScroll } from '@/components/SmoothScroll'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutBitmore />
      <JustLikeMortgage />
      <BitcoinJourney />
      <Testimonials />
      <FAQs />
      <CTABanner />
      <Footer />
      <SmoothScroll />
    </>
  )
}

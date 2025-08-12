import { Footer } from '@/components/Footer'
import {
  Hero,
  AboutBitmore,
  JustLikeMortgage,
  BorrowerLender,
  Testimonials,
  FAQs,
  CTABanner,
  // Borrowers,
  // CTABanner,
  // Lenders,
  // Stats,
  // Team,
  // WhyBitcoin,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutBitmore />
      <JustLikeMortgage />
      <BorrowerLender />
      <Testimonials />
      <FAQs />
      <CTABanner />
      {/* <Stats />
      <Borrowers />
      <WhyBitcoin />
      <Lenders />
      <Team /> */}
      <Footer />
    </>
  )
}

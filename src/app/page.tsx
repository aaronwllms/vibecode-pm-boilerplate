import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import ProcessSection from '@/components/process-section'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function Index() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  )
}

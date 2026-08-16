import Hero from '../components/landing/Hero.jsx';
import FeatureCards from '../components/landing/FeatureCards.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import FAQ from '../components/landing/FAQ.jsx';
import CTASection from '../components/landing/CTASection.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}

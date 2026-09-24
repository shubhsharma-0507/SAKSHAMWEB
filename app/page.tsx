import HeroSection from '@/components/home/HeroSection';
import EmergencySearchSection from '@/components/home/EmergencySearchSection';
import WhySaksham from '@/components/home/WhySaksham';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import TrustSection from '@/components/home/TrustSection';
import ForHospitalsSection from '@/components/home/ForHospitalsSection';
import EmergencyCTA from '@/components/home/EmergencyCTA';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAKSHAM — Right Hospital. Right Time. Saves Lives.',
  description:
    'Find the right hospital during a medical emergency based on available facilities, ICU beds, specialists, and real capacity — not just distance.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EmergencySearchSection />
      <WhySaksham />
      <HowItWorksSection />
      <ComparisonSection />
      <TrustSection />
      <ForHospitalsSection />
      <EmergencyCTA />
    </>
  );
}

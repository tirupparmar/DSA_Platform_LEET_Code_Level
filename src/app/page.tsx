import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/ui/HeroSection';
import { FeaturesSection } from '@/components/ui/FeaturesSection';
import { SimPreviewSection } from '@/components/ui/SimPreviewSection';
import { StatsSection } from '@/components/ui/StatsSection';
import { CTASection } from '@/components/ui/CTASection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <SimPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

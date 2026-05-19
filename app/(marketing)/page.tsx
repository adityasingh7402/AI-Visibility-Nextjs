import HeroSection from "@/components/landing/HeroSection";
import FeatureOverviewSection from "@/components/landing/FeatureOverviewSection";
import WhyDifferentSection from "@/components/landing/WhyDifferentSection";
import LogoSliderSection from "@/components/landing/LogoSliderSection";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import DataMetricsSection from "@/components/landing/DataMetricsSection";
import FeaturesBentoGrid from "@/components/landing/FeaturesBentoGrid";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ComparisonTableSection from "@/components/landing/ComparisonTableSection";
import PricingSection from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/FooterCTASection";

export default function MarketingLandingPage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <DataMetricsSection />
      <ProblemStatementSection />
      <FeatureOverviewSection />

      {/* <LogoSliderSection /> */}
      <HowItWorksSection />
      <FeaturesBentoGrid />
      <WhyDifferentSection />
      {/* <TestimonialsSection /> */}
      {/* <ComparisonTableSection /> */}
      <PricingSection />
      <Footer />
    </main>
  );
}

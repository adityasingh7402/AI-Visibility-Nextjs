import HeroSection from "@/components/landing/HeroSection";
import LogoSliderSection from "@/components/landing/LogoSliderSection";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesBentoGrid from "@/components/landing/FeaturesBentoGrid";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ComparisonTableSection from "@/components/landing/ComparisonTableSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterCTASection from "@/components/landing/FooterCTASection";

export default function MarketingLandingPage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <LogoSliderSection />
      <ProblemStatementSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesBentoGrid />
      <TestimonialsSection />
      <ComparisonTableSection />
      <PricingSection />
      <FooterCTASection />
    </main>
  );
}

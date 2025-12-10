import { HeroSection } from "@/components/services/HeroSection";
import { SubjectsSection } from "@/components/services/SubjectsGrid";
import { ApproachSection } from "@/components/services/ApproachSection";
import { TestimonialsSection } from "@/components/services/TestimonialSection";
import { AboutSection } from "@/components/services/AboutSection";
import { PricingContactSection } from "@/components/services/PricingSection";
import { ComingSoonSection } from "@/components/services/ComingSoonSection";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <HeroSection />

        <SubjectsSection />

        <ApproachSection />

        <TestimonialsSection />

        <AboutSection />

        <PricingContactSection />

        <ComingSoonSection />
      </div>
    </div>
  );
}

export default ServicesPage;
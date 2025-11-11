import { HeroSection } from "@/components/services/HeroSection";
import { SubjectsSection } from "@/components/services/SubjectsGrid";
import { ApproachSection } from "@/components/services/ApproachSection";
import { TestimonialsSection } from "@/components/services/TestimonialSection";
import { AboutSection } from "@/components/services/AboutSection";
import { PricingContactSection } from "@/components/services/PricingSection";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <HeroSection />

      <SubjectsSection />

      <ApproachSection />

      <TestimonialsSection />

      <AboutSection />

      <PricingContactSection />
    </div>
  );
}

export default ServicesPage;
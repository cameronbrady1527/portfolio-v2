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

        {/* Free resources callout */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-8 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Free practice between sessions
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-5">
                I build interactive math tools, virtual manipulatives, and Regents practice for my own
                students — and publish them free for anyone to use, anytime.
              </p>
              <a
                href="https://resources.cameronbrady.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Explore the Math Resources →
              </a>
            </div>
          </div>
        </section>

        <ApproachSection />

        <TestimonialsSection />

        <AboutSection />

        <PricingContactSection />

        {/* <ComingSoonSection /> */}
      </div>
    </div>
  );
}

export default ServicesPage;
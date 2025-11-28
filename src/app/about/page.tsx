"use client";

import { HeroSection } from "@/components/about/HeroSection";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { ExperienceSection } from "@/components/about/ExperienceSection";
import { VolunteerSection } from "@/components/about/VolunteerSection";
import { PersonalInterestsSection } from "@/components/about/PersonalInterestsSection";
import { ResearchHighlight } from "@/components/about/ResearchHighlight";
import { SkillsSection } from "@/components/about/SkillsSection";
import { CTASection } from "@/components/about/CTASection";

export default function AboutPage() {
  return (
    <div className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Rest of Page Content */}
      <div className="relative pb-16">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <JourneyTimeline />

          <ExperienceSection />

          <VolunteerSection />

          <PersonalInterestsSection />

          <ResearchHighlight />

          <SkillsSection />

          <CTASection />
        </div>
      </div>
    </div>
  );
}

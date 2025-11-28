import HeroSection from "@/components/home/HeroSection";
import WhatIDo from "@/components/home/WhatIDo";
import FeaturedWork from "@/components/home/FeaturedWork";
import QuickContact from "@/components/home/QuickContact";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <HeroSection />
      <WhatIDo />
      <FeaturedWork />
      <QuickContact />
    </div>
  );
}

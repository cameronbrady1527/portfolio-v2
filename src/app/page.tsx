import HeroSection from "@/components/home/HeroSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import QuickContact from "@/components/home/QuickContact";

export default function Home() {
  const subtleGradient = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <HeroSection />
      <FeaturedWork />
      <QuickContact />
    </>
  );
}

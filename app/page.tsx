import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CanScene } from "@/components/CanScene";

export default function Home() {
  return (
    <main>
      <CanScene />
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}

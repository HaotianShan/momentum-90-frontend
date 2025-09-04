import Navbar from "@/components/navbar";

import HeroSection from "@/components/hero";
import SuperGoalInput from "@/components/super-goal-input";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#F8F4ED]">
      <div className="relative">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <SuperGoalInput />
        </main>
      </div>
    </div>
  );
}

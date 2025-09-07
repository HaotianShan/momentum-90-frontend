// src/app/page.tsx
"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import SuperGoalInput from "@/components/super-goal-input";
import { OngoingAdventures } from "@/components/ongoing-adventures";
import AnimatedStarfieldBackground from "@/components/animated-starfield-background"; // 1. Import the new component

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* 2. Use the new background component */}
      <AnimatedStarfieldBackground />

      {/* The rest of your page content remains the same */}
      <div className="relative">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <SuperGoalInput />
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 animate-pulse bg-slate-800/50 border border-slate-700/50 rounded-lg"
                      >
                        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-4" />
                        <div className="h-2 bg-slate-700/50 rounded w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <OngoingAdventures />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

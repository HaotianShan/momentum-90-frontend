"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import SuperGoalInput from "@/components/super-goal-input";
import { OngoingAdventures } from "@/components/ongoing-adventures";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* New "Advanced Tech" Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-950/50 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/15 via-slate-950/50 to-transparent blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <SuperGoalInput />
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Suspense
              fallback={
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">
                      My Adventures
                    </h2>
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

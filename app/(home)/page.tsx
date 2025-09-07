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
    <div className="relative min-h-screen bg-[#F8F4ED]">
      <div className="relative">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <SuperGoalInput />
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Adventures
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 animate-pulse bg-white rounded-lg"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                        <div className="h-2 bg-gray-200 rounded w-full" />
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

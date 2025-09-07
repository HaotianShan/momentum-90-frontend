"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitSuperGoal, checkUserLoggedIn } from "@/app/actions";
import { toast } from "sonner";
import { ArrowRightIcon, TargetIcon } from "@/components/icons";
import dotenv from "dotenv";
dotenv.config();

export default function SuperGoalInput() {
  const [superGoal, setSuperGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkUserLoggedIn();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // useEffect(() => {
  //   if (submittedGoal) {
  //     const fetchBanner = async () => {
  //       try {
  //         const apiKey = process.env.NEXT_PUBLIC_X_API_KEY;
  //         if (!apiKey) {
  //           toast.error("Configuration error - please contact support");
  //           return;
  //         }
  //         const response = await fetch(
  //           `https://momentum90-backend-2-659784348393.northamerica-northeast2.run.app/generate-banner?text=${encodeURIComponent(
  //             submittedGoal
  //           )}`,
  //           {
  //             headers: {
  //               "X-API-KEY": apiKey,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //         const data = await response.json();
  //         setBannerUrl(data.public_url);
  //       } catch (error) {
  //         console.error("Failed to fetch banner:", error);
  //         toast.error("Failed to generate banner");
  //       }
  //     };

  //     fetchBanner();
  //   }
  // }, [submittedGoal]);

  const handleGoalSubmission = async (goal: string) => {
    setIsLoading(true);
    try {
      const result = await submitSuperGoal(goal);
      if (result.success) {
        toast.success("Your Super Goal has been saved!");
        setSuperGoal("");
        // Redirect to adventure page with both the adventure ID and goal
        if (result.adventureId) {
          router.push(
            `/adventure?id=${result.adventureId}&goal=${encodeURIComponent(
              goal
            )}`
          );
        } else {
          // Fallback to goal parameter if no adventure ID
          router.push(`/adventure?goal=${encodeURIComponent(goal)}`);
        }
      } else {
        toast.error(result.error || "Failed to save super goal");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (superGoal.trim()) {
      setIsAnimating(true);
      setTimeout(() => {
        handleGoalSubmission(superGoal.trim());
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleInputClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  };

  const exampleGoals = [
    "Write my first novel",
    "Learn web development",
    "Run a marathon",
  ];

  return (
    <section className="py-1 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="w-4/5 xs:w-4/5 md:w-4/5 lg:w-3/5 mx-auto animate-fade-in">
          <form
            onSubmit={handleSubmit}
            className="space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Input Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-hero rounded-lg xs:rounded-xl sm:rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all" />
              <div className="relative bg-slate-800/50 border-2 border-slate-700/50 hover:border-orange-500 focus-within:border-orange-500 transition-all rounded-lg xs:rounded-xl sm:rounded-2xl p-1 shadow-card hover:shadow-glow w-full">
                <div className="relative flex items-center">
                  <TargetIcon className="absolute left-2 xs:left-3 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-orange-500 transition-colors z-10" />
                  <Input
                    type="text"
                    placeholder={
                      isAuthenticated
                        ? "What's your super goal?"
                        : "Click to login and set your super goal"
                    }
                    value={superGoal}
                    onChange={(e) => setSuperGoal(e.target.value)}
                    onClick={handleInputClick}
                    className="pl-8 xs:pl-10 sm:pl-12 md:pl-16 pr-16 xs:pr-20 sm:pr-24 md:pr-32 py-2 xs:py-3 sm:py-4 md:py-8 text-sm xs:text-base sm:text-lg md:text-xl rounded-md xs:rounded-lg sm:rounded-xl border-0 bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 flex-1 placeholder:text-slate-400 text-white placeholder:text-xs xs:placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg"
                    disabled={isLoading}
                  />
                  {isAuthenticated && (
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      disabled={!superGoal.trim() || isAnimating || isLoading}
                      className={`absolute right-0.5 xs:right-1 sm:right-2 py-1 xs:py-1.5 sm:py-2 px-1.5 xs:px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 group/btn ${
                        isAnimating ? "animate-bounce-gentle" : ""
                      } ${
                        superGoal.trim() && !isLoading && !isAnimating
                          ? "bg-gradient-to-r from-orange-500/15 to-orange-500/15 hover:from-orange-500/25 hover:to-orange-500/25 border border-orange-500/30 hover:border-orange-500/100 text-orange-500 hover:text-white shadow-lg hover:shadow-orange-500/20"
                          : "bg-slate-700/30 border border-slate-600/50 text-slate-400/60"
                      }`}
                    >
                      <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5">
                        {isLoading ? (
                          <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : isAnimating ? (
                          <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" />
                        ) : (
                          <ArrowRightIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 transition-transform group-hover/btn:translate-x-0.5" />
                        )}
                        <span className="hidden xs:inline sm:inline">
                          {isLoading
                            ? "Saving"
                            : isAnimating
                            ? "Creating"
                            : "Start"}
                        </span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Example Goals */}
            {isAuthenticated && (
              <div
                className="text-center animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex flex-wrap justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
                  {exampleGoals.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSuperGoal(example)}
                      className="px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-xs xs:text-xs sm:text-sm md:text-base bg-slate-700/50 hover:bg-orange-500/10 text-slate-300 hover:text-orange-500 border border-transparent hover:border-orange-500/20 rounded-full transition-all hover-scale whitespace-nowrap"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

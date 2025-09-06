"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitSuperGoal, checkUserLoggedIn } from "@/app/actions";
import { toast } from "sonner";
import { ArrowRightIcon, TargetIcon, SparklesIcon } from "@/components/icons";
import dotenv from "dotenv";
dotenv.config();


export default function SuperGoalInput() {
  const [superGoal, setSuperGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
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
          router.push(`/adventure?id=${result.adventureId}&goal=${encodeURIComponent(goal)}`);
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
    "Master guitar in 90 days",
    "Launch my online business",
    "Write my first novel",
    "Learn web development",
    "Run a marathon",
  ];

  return (
    <section className="py-2 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all"></div>
                <div className="relative bg-card border-2 border-border hover:border-orange-500 focus-within:border-orange-500 transition-all rounded-2xl p-1 shadow-card hover:shadow-glow">
                  <div className="relative flex items-center">
                    <TargetIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6 group-hover:text-primary transition-colors z-10" />
                    <Input
                      type="text"
                      placeholder={
                        isAuthenticated
                          ? "What's your epic quest?"
                          : "Click to login and set your super goal"
                      }
                      value={superGoal}
                      onChange={(e) => setSuperGoal(e.target.value)}
                      onClick={handleInputClick}
                      className="pl-16 pr-32 py-8 text-lg rounded-xl border-0 bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 flex-1"
                      disabled={isLoading}
                    />
                    {isAuthenticated && (
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={!superGoal.trim() || isAnimating || isLoading}
                        className={`absolute right-2 py-2 px-3 text-sm font-medium rounded-full transition-all duration-300 group/btn ${
                          isAnimating ? "animate-bounce-gentle" : ""
                        } ${
                          superGoal.trim() && !isLoading && !isAnimating
                            ? "bg-gradient-to-r from-orange-500/15 to-orange-500/15 hover:from-orange-500/25 hover:to-orange-500/25 border border-orange-500/30 hover:border-orange-500/100 text-orange-500 hover:text-gray-100 shadow-lg hover:shadow-orange-500/20"
                            : "bg-muted/30 border border-border/50 text-muted-foreground/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isLoading ? (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : isAnimating ? (
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" />
                          ) : (
                            <ArrowRightIcon className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          )}
                          <span className="hidden sm:inline">
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
                  <div className="flex flex-wrap justify-center gap-2">
                    {exampleGoals.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSuperGoal(example)}
                        className="px-4 py-2 text-sm bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20 rounded-full transition-all hover-scale"
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

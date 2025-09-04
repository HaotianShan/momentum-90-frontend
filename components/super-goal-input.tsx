"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { submitSuperGoal, checkUserLoggedIn } from "@/app/actions";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowRightIcon, TargetIcon, SparklesIcon } from "@/components/icons";
import dotenv from "dotenv";
dotenv.config();

interface PlanResponse {
  success: boolean;
  goal: string;
  structured_plan: {
    monthly_actions: Record<string, string>;
    weekly_milestones: Record<string, string>;
  };
}

export default function SuperGoalInput() {
  const [superGoal, setSuperGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submittedGoal, setSubmittedGoal] = useState("");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
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

  useEffect(() => {
    if (submittedGoal) {
      const fetchPlan = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_X_API_KEY;

          if (!apiKey) {
            toast.error("Configuration error - please contact support");
            return;
          }

          const response = await fetch(
            `https://momentum90-backend-659784348393.us-south1.run.app/generate-plan?text=${encodeURIComponent(
              submittedGoal
            )}`,
            {
              headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.success) {
            setPlan(data);
          } else {
            toast.error("Failed to generate plan");
          }
        } catch (error) {
          console.error("Failed to fetch plan:", error);
          toast.error("Failed to generate plan");
        }
      };
      fetchPlan();
    }
  }, [submittedGoal]);

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
  //           `https://momentum90-backend-659784348393.us-south1.run.app/generate-banner?text=${encodeURIComponent(
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
        setSubmittedGoal(goal);
        setSuperGoal("");
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
        {!submittedGoal && (
          <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all"></div>
                <div className="relative bg-card border-2 border-border hover:border-primary/50 transition-all rounded-2xl p-1 shadow-card hover:shadow-glow">
                  <div className="relative">
                    <TargetIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6 group-hover:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder={
                        isAuthenticated
                          ? "What's your epic quest? (e.g., Master guitar, Launch a startup, Write a novel...)"
                          : "Click to login and set your super goal"
                      }
                      value={superGoal}
                      onChange={(e) => setSuperGoal(e.target.value)}
                      onClick={handleInputClick}
                      className="pl-16 pr-6 py-8 text-lg rounded-xl border-0 bg-transparent focus:ring-0 placeholder:text-muted-foreground/70"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Example Goals */}
              {isAuthenticated && (
                <div
                  className="text-center animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <p className="text-sm text-muted-foreground mb-3 font-medium">
                    🔥 Popular quests:
                  </p>
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

              {/* Submit Button */}
              {isAuthenticated && (
                <div
                  className={`transition-all duration-300 ${
                    isAnimating ? "animate-bounce-gentle" : ""
                  }`}
                >
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={!superGoal.trim() || isAnimating || isLoading}
                    className="w-full py-8 text-xl font-bold rounded-2xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <SparklesIcon className="w-6 h-6" />
                      {isLoading
                        ? "Saving..."
                        : isAnimating
                        ? "Creating Your Adventure..."
                        : "Begin My 90-Day Quest"}
                      <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </div>
                  </Button>
                </div>
              )}

              {/* Encouragement */}
              {isAuthenticated && (
                <div
                  className="text-center animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <p className="text-sm text-muted-foreground">
                    ✨ <span className="font-medium">Join thousands</span> who've
                    transformed their dreams into reality
                  </p>
                </div>
              )}
            </form>
          </div>
        )}

        {submittedGoal && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="bg-[#FFF5E8] border-[#FC7B11]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Super Goal:
                </h3>
                <p className="text-lg text-gray-800 mb-4">{submittedGoal}</p>

                {/* Display the banner image if available */}
                {bannerUrl && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Your Goal Banner:
                    </h4>
                    <Image
                      src={bannerUrl}
                      alt="Goal banner"
                      width={600}
                      height={300}
                      className="rounded-md object-cover w-full"
                    />
                  </div>
                )}

                {plan?.success && plan.structured_plan && (
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Your Goal: {plan.goal}
                    </h2>

                    {/* Monthly Actions */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-blue-600 mb-4">
                        Monthly Actions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(
                          plan.structured_plan.monthly_actions
                        ).map(([month, action]) => (
                          <div
                            key={month}
                            className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                          >
                            <h4 className="font-medium text-blue-800">
                              {month
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h4>
                            <p className="mt-2 text-gray-700">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Milestones */}
                    <div>
                      <h3 className="text-xl font-semibold text-green-600 mb-4">
                        Weekly Milestones
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(
                          plan.structured_plan.weekly_milestones
                        ).map(([week, milestone]) => (
                          <div
                            key={week}
                            className="bg-green-50 p-4 rounded-lg border border-green-100"
                          >
                            <h4 className="font-medium text-green-800">
                              {week
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h4>
                            <p className="mt-2 text-gray-700">{milestone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

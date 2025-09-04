"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { submitSuperGoal, checkUserLoggedIn } from "@/app/actions";
import { toast } from "sonner";
import Image from "next/image";
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
    await handleGoalSubmission(superGoal);
  };

  const handleInputClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {!submittedGoal && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={
                      isAuthenticated
                        ? "Enter your super goal..."
                        : "Click to login and set your super goal"
                    }
                    value={superGoal}
                    onChange={(e) => setSuperGoal(e.target.value)}
                    onClick={handleInputClick}
                    className="text-lg py-4 px-4 border-2 border-gray-200 focus:border-[#FC7B11] focus:ring-[#FC7B11] transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                {isAuthenticated && (
                  <Button
                    type="submit"
                    disabled={isLoading || !superGoal.trim()}
                    className="w-full bg-[#FC7B11] hover:bg-[#E66A0A] text-white font-semibold py-3 px-6 rounded-md transition-all duration-200"
                  >
                    {isLoading ? "Saving..." : "Save Super Goal"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
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

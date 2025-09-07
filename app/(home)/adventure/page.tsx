"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdventureRoadmap } from "@/components/adventure-roadmap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface PlanResponse {
  success: boolean;
  goal: string;
  structured_plan: {
    [monthKey: string]: {
      action: string;
      weeks: {
        [weekKey: string]: string;
      };
    };
  };
}

interface Quest {
  number: number;
  title: string;
  description: string;
  completed?: boolean;
  reward: string;
  difficulty: "Novice" | "Explorer" | "Adventurer" | "Hero" | "Legend";
  xp: number;
}

function AdventureContent() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const goal = searchParams.get("goal");
  const adventureId = searchParams.get("id");
  const { data: session } = useSession();

  useEffect(() => {
    if (!goal && !adventureId) {
      toast.error(
        "No goal or adventure found. Please set your super goal first."
      );
      router.push("/");
      return;
    }

    const fetchPlan = async () => {
      try {
        // If we have an adventure ID, load existing adventure
        if (adventureId && session?.user?.id) {
          const response = await fetch(`/api/adventure/${adventureId}`);
          if (response.ok) {
            const adventure = await response.json();
            if (adventure.quests && adventure.quests.length > 0) {
              setQuests(adventure.quests);
              setPlan({
                success: true,
                goal: adventure.superGoal,
                structured_plan: {},
              });
              setIsLoading(false);
              return;
            } else {
              // Adventure exists but no quests generated yet, use the superGoal from the adventure
              if (adventure.superGoal) {
                // Set the goal from the adventure and continue to generate plan
                const url = new URL(window.location.href);
                url.searchParams.set("goal", adventure.superGoal);
                window.history.replaceState({}, "", url.toString());
                // Continue to plan generation below
              }
            }
          }
        }

        // Otherwise, generate new plan
        if (!goal) {
          toast.error("No goal found. Please set your super goal first.");
          router.push("/");
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_X_API_KEY;

        if (!apiKey) {
          toast.error("Configuration error - please contact support");
          return;
        }

        const response = await fetch(
          `https://momentum90-backend-2-659784348393.northamerica-northeast2.run.app/generate-plan?text=${encodeURIComponent(
            goal
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
          const newQuests = convertPlanToQuests(data);
          setQuests(newQuests);

          // Save the generated quests to the database if we have an adventure ID
          if (adventureId && session?.user?.id) {
            try {
              await fetch("/api/adventure/save-progress", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  adventureId: adventureId,
                  userId: session.user.id,
                  quests: newQuests,
                  completedQuests: [],
                  totalXP: 0,
                }),
              });
            } catch (error) {
              console.error("Failed to save generated quests:", error);
              // Don't show error to user as the quests are still displayed
            }
          }
        } else {
          toast.error("Failed to generate plan");
        }
      } catch (error) {
        console.error("Failed to fetch plan:", error);
        toast.error("Failed to generate plan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [goal, adventureId, session?.user?.id, router]);

  const convertPlanToQuests = (plan: PlanResponse): Quest[] => {
    const quests: Quest[] = [];
    let questNumber = 1;

    // Convert the new structure: Month_X.weeks.Week_X
    Object.entries(plan.structured_plan).forEach(([monthKey, monthData]) => {
      if (monthKey.startsWith("Month_") && monthData.weeks) {
        Object.entries(monthData.weeks).forEach(([weekKey, milestone]) => {
          const difficulty = getDifficultyForWeek(questNumber);
          const xp = getXPForDifficulty(difficulty);

          quests.push({
            number: questNumber,
            title: formatWeekTitle(weekKey),
            description: milestone,
            completed: false, // You can implement completion tracking later
            reward: getRewardForWeek(questNumber),
            difficulty,
            xp,
          });
          questNumber++;
        });
      }
    });

    return quests;
  };

  const getDifficultyForWeek = (weekNumber: number): Quest["difficulty"] => {
    if (weekNumber <= 3) return "Novice";
    if (weekNumber <= 6) return "Explorer";
    if (weekNumber <= 9) return "Adventurer";
    if (weekNumber <= 12) return "Hero";
    return "Legend";
  };

  const getXPForDifficulty = (difficulty: Quest["difficulty"]): number => {
    switch (difficulty) {
      case "Novice":
        return 100;
      case "Explorer":
        return 200;
      case "Adventurer":
        return 300;
      case "Hero":
        return 500;
      case "Legend":
        return 1000;
      default:
        return 100;
    }
  };

  const getRewardForWeek = (weekNumber: number): string => {
    const rewards = [
      "Unlock basic skills and confidence",
      "Build momentum and habits",
      "Master fundamentals",
      "Develop advanced techniques",
      "Achieve breakthrough moments",
      "Reach intermediate level",
      "Overcome major challenges",
      "Demonstrate mastery",
      "Showcase expertise",
      "Become a role model",
      "Achieve expert status",
      "Reach legendary level",
      "Complete your transformation",
    ];
    return rewards[Math.min(weekNumber - 1, rewards.length - 1)];
  };

  const formatWeekTitle = (week: string): string => {
    return week.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleQuestToggle = async (questNumber: number, completed: boolean) => {
    if (!session?.user?.id) {
      toast.error("Please log in to save your progress");
      return;
    }

    setIsSaving(true);

    try {
      // Update local state
      const updatedQuests = quests.map((quest) =>
        quest.number === questNumber ? { ...quest, completed } : quest
      );
      setQuests(updatedQuests);

      // Calculate completed quests and total XP
      const completedQuests = updatedQuests
        .filter((quest) => quest.completed)
        .map((quest) => quest.number);

      const totalXP = updatedQuests
        .filter((quest) => quest.completed)
        .reduce((sum, quest) => sum + quest.xp, 0);

      // Save to database
      const response = await fetch("/api/adventure/save-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adventureId: adventureId,
          userId: session.user.id,
          quests: updatedQuests,
          completedQuests,
          totalXP,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      // Example using a library like Sonner
      if (completed) {
        toast.success("Weekly Goal Complete!", {
          description: "Another productive week in the books. Great work!",
          icon: "🎉",
        });
      } else {
        toast("Quest Status Updated", {
          description: "This quest has been returned to your active list.",
          icon: "🔄",
        });
      }
    } catch (error) {
      console.error("Failed to save quest progress:", error);
      toast.error("Failed to save progress. Please try again.");

      // Revert local state on error
      const revertedQuests = quests.map((quest) =>
        quest.number === questNumber
          ? { ...quest, completed: !completed }
          : quest
      );
      setQuests(revertedQuests);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="text-slate-300">Creating your 90 day plan...</p>
        </div>
      </div>
    );
  }

  if (!plan || !plan.success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white">Adventure Not Found</h1>
          <p className="text-slate-300">
            We couldn't generate your adventure plan. Please try setting your
            super goal again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => router.back()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header with navigation */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="flex items-center gap-2 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-8 px-6">
        <AdventureRoadmap
          goal={plan.goal}
          quests={quests}
          onQuestToggle={handleQuestToggle}
        />
      </div>
    </div>
  );
}

export default function AdventurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
            <p className="text-slate-300">Loading your adventure...</p>
          </div>
        </div>
      }
    >
      <AdventureContent />
    </Suspense>
  );
}

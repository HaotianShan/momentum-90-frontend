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
    monthly_actions: Record<string, string>;
    weekly_milestones: Record<string, string>;
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
      toast.error("No goal or adventure found. Please set your super goal first.");
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
            if (adventure.quests) {
              setQuests(adventure.quests);
              setPlan({
                success: true,
                goal: adventure.superGoal,
                structured_plan: {
                  monthly_actions: {},
                  weekly_milestones: {}
                }
              });
              setIsLoading(false);
              return;
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

    // Convert weekly milestones to quests
    Object.entries(plan.structured_plan.weekly_milestones).forEach(([week, milestone]) => {
      const difficulty = getDifficultyForWeek(questNumber);
      const xp = getXPForDifficulty(difficulty);
      
      quests.push({
        number: questNumber,
        title: formatWeekTitle(week),
        description: milestone,
        completed: false, // You can implement completion tracking later
        reward: getRewardForWeek(questNumber),
        difficulty,
        xp,
      });
      questNumber++;
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
      case "Novice": return 100;
      case "Explorer": return 200;
      case "Adventurer": return 300;
      case "Hero": return 500;
      case "Legend": return 1000;
      default: return 100;
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
      "Complete your transformation"
    ];
    return rewards[Math.min(weekNumber - 1, rewards.length - 1)];
  };

  const formatWeekTitle = (week: string): string => {
    return week
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleQuestToggle = async (questNumber: number, completed: boolean) => {
    if (!session?.user?.id) {
      toast.error("Please log in to save your progress");
      return;
    }

    setIsSaving(true);
    
    try {
      // Update local state
      const updatedQuests = quests.map(quest => 
        quest.number === questNumber 
          ? { ...quest, completed }
          : quest
      );
      setQuests(updatedQuests);

      // Calculate completed quests and total XP
      const completedQuests = updatedQuests
        .filter(quest => quest.completed)
        .map(quest => quest.number);
      
      const totalXP = updatedQuests
        .filter(quest => quest.completed)
        .reduce((sum, quest) => sum + quest.xp, 0);

      // Save to database
      const response = await fetch('/api/adventure/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          quests: updatedQuests,
          completedQuests,
          totalXP,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      toast.success(completed ? "Quest completed! 🎉" : "Quest unmarked");
    } catch (error) {
      console.error('Failed to save quest progress:', error);
      toast.error("Failed to save progress. Please try again.");
      
      // Revert local state on error
      const revertedQuests = quests.map(quest => 
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Creating your epic adventure...</p>
        </div>
      </div>
    );
  }

  if (!plan || !plan.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground">Adventure Not Found</h1>
          <p className="text-muted-foreground">
            We couldn't generate your adventure plan. Please try setting your super goal again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              Your Adventure
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-8 px-6">
        {isSaving && (
          <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            Saving progress...
          </div>
        )}
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
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    }>
      <AdventureContent />
    </Suspense>
  );
}

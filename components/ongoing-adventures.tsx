"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress"; // Assumes you have this from shadcn/ui
import { MapPin, Trophy, Clock, Target, Star } from "lucide-react";

// --- Helper Types & Functions (unchanged) ---

interface Adventure {
  id: string;
  superGoal: string;
  createdAt: string;
  quests: any[];
  completedQuests: number[];
  totalXP: number;
}

const getDifficultyLevel = (completedQuestsCount: number) => {
  if (completedQuestsCount <= 3)
    return {
      level: "Novice",
      color: "bg-green-900/50 text-green-300 border-green-700/50",
    };
  if (completedQuestsCount <= 6)
    return {
      level: "Explorer",
      color: "bg-blue-900/50 text-blue-300 border-blue-700/50",
    };
  if (completedQuestsCount <= 9)
    return {
      level: "Adventurer",
      color: "bg-purple-900/50 text-purple-300 border-purple-700/50",
    };
  if (completedQuestsCount <= 12)
    return {
      level: "Hero",
      color: "bg-orange-900/50 text-orange-300 border-orange-700/50",
    };
  return {
    level: "Legend",
    color: "bg-red-900/50 text-red-300 border-red-700/50",
  };
};

const getDaysElapsed = (createdAt: string) => {
  const startDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(days, 90); // Cap at 90
};

// --- Main Component (unchanged) ---

export const OngoingAdventures = () => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchAdventures();
    }
  }, [session?.user?.id, status]);

  const fetchAdventures = async () => {
    try {
      const response = await fetch("/api/adventure/user-adventures");
      if (response.ok) {
        const data = await response.json();
        setAdventures(data);
      }
    } catch (error) {
      console.error("Failed to fetch adventures:", error);
    }
  };

  if (status === "loading") {
    return <AdventuresSkeleton />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (adventures.length === 0) {
    return <EmptyState onAction={() => router.push("/")} />;
  }

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-3xl font-bold text-white tracking-tight">
        My Super Goals
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adventures.map((adventure) => (
          <AdventureCard key={adventure.id} adventure={adventure} />
        ))}
      </div>
    </div>
  );
};

// --- Sub-components with Design Improvements ---

const AdventureCard = ({ adventure }: { adventure: Adventure }) => {
  const router = useRouter();
  const {
    id,
    superGoal,
    createdAt,
    quests = [],
    completedQuests = [],
    totalXP = 0,
  } = adventure;

  const totalQuests = quests?.length;
  const completedCount = completedQuests.length;
  const progress =
    totalQuests > 0 ? Math.round((completedCount / totalQuests) * 100) : 0;
  const daysElapsed = getDaysElapsed(createdAt);
  const difficulty = getDifficultyLevel(completedCount);
  const isCompleted = progress === 100;

  const cardClasses = `
    p-6 flex flex-col group cursor-pointer transition-all duration-300
    bg-slate-900/40 border border-slate-800 backdrop-blur-sm
    hover:bg-slate-900/60 hover:border-orange-500/60
    ${isCompleted ? "border-yellow-500/40 shadow-lg shadow-yellow-500/10" : ""}
  `;

  return (
    <Card
      className={cardClasses}
      onClick={() =>
        router.push(`/adventure?id=${id}&goal=${encodeURIComponent(superGoal)}`)
      }
    >
      <div className="flex-grow space-y-4">
        {/* --- Card Header: Goal Title and Status --- */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold text-white tracking-tight line-clamp-3 group-hover:text-orange-400 transition-colors">
            {superGoal}
          </h3>
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${difficulty.color} border`}>
                  {difficulty.level}
                </Badge>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium text-white">
                    {totalXP} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Progress Section --- */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-base font-semibold text-white">
              {completedCount} / {totalQuests}
            </span>
            <span className="text-sm font-medium text-slate-300">Quests</span>
          </div>
          <Progress
            value={progress}
            className="h-2.5 bg-slate-700/50 [&>div]:bg-orange-500"
          />
        </div>
      </div>

      {/* --- Footer: Time Stat --- */}
      <div className="mt-6 border-t border-slate-800 pt-4 flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Day {daysElapsed} of 90</span>
      </div>
    </Card>
  );
};

const AdventuresSkeleton = () => (
  <div className="space-y-6 mt-10">
    <div className="h-8 w-1/3 bg-slate-800 rounded-md animate-pulse" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 bg-slate-900/40 border border-slate-800">
          <div className="flex-grow space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="h-6 w-40 bg-slate-800 rounded animate-pulse" />
                <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-12 w-20 bg-slate-800 rounded-md animate-pulse" />
            </div>
            <div className="pt-2 space-y-2">
              <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse" />
              <div className="h-2.5 w-full bg-slate-800 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// EmptyState remains largely the same, but can be updated for consistency
const EmptyState = ({ onAction }: { onAction: () => void }) => (
  <div className="text-center py-20 px-6 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-dashed border-slate-700 mt-10">
    <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-4" />
    <h3 className="text-2xl font-bold text-white mb-2">Your Journey Awaits</h3>
    <p className="text-slate-400 mb-6 max-w-md mx-auto">
      An adventure is a grand goal broken into smaller quests. Start your first
      90-day journey now!
    </p>
    <Button onClick={onAction} size="lg">
      <Target className="w-5 h-5 mr-2" />
      Create First Adventure
    </Button>
  </div>
);

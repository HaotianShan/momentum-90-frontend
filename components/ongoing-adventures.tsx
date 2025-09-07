"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  Trophy, 
  Calendar, 
  Play, 
  Star,
  Clock,
  Target
} from "lucide-react";

interface Adventure {
  id: string;
  superGoal: string;
  createdAt: string;
  quests: any[];
  completedQuests: number[];
  totalXP: number;
}

export const OngoingAdventures = () => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }
    
    if (session?.user?.id) {
      fetchAdventures();
    } else {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  const fetchAdventures = async () => {
    try {
      const response = await fetch('/api/adventure/user-adventures');
      if (response.ok) {
        const data = await response.json();
        setAdventures(data);
      }
    } catch (error) {
      console.error('Failed to fetch adventures:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (adventure: Adventure) => {
    if (!adventure.quests || adventure.quests.length === 0) return 0;
    return Math.round((adventure.completedQuests?.length || 0) / adventure.quests.length * 100);
  };

  const getDaysSinceStart = (createdAt: string) => {
    const startDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDifficultyLevel = (completedQuests: number) => {
    if (completedQuests <= 3) return { level: "Novice", color: "bg-green-900/50 text-green-300 border-green-700/50" };
    if (completedQuests <= 6) return { level: "Explorer", color: "bg-blue-900/50 text-blue-300 border-blue-700/50" };
    if (completedQuests <= 9) return { level: "Adventurer", color: "bg-purple-900/50 text-purple-300 border-purple-700/50" };
    if (completedQuests <= 12) return { level: "Hero", color: "bg-orange-900/50 text-orange-300 border-orange-700/50" };
    return { level: "Legend", color: "bg-red-900/50 text-red-300 border-red-700/50" };
  };

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">My Adventures</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse bg-slate-800/50 border-slate-700/50">
              <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-slate-700/50 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">My Adventures</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse bg-slate-800/50 border-slate-700/50">
              <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-slate-700/50 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (adventures.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Adventures Yet</h3>
        <p className="text-slate-300 mb-6">
          Start your first 90-day adventure by setting a super goal!
        </p>
        <Button onClick={() => router.push('/')} className="gap-2">
          <Target className="w-4 h-4" />
          Create Adventure
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Adventures</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adventures.map((adventure) => {
          const progress = getProgressPercentage(adventure);
          const daysSinceStart = getDaysSinceStart(adventure.createdAt);
          const difficulty = getDifficultyLevel(adventure.completedQuests?.length || 0);
          const isCompleted = progress === 100;

          return (
            <Card 
              key={adventure.id} 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
              onClick={() => router.push(`/adventure?id=${adventure.id}&goal=${encodeURIComponent(adventure.superGoal)}`)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {adventure.superGoal}
                    </h3>
                    {isCompleted && (
                      <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${difficulty.color} border`}>
                      {difficulty.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {adventure.totalXP || 0} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {adventure.completedQuests?.length || 0} of {adventure.quests?.length || 0} quests
                    </span>
                    <span className="font-medium text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{daysSinceStart} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{90 - daysSinceStart} left</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full gap-2" 
                  variant={isCompleted ? "outline" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/adventure?id=${adventure.id}&goal=${encodeURIComponent(adventure.superGoal)}`);
                  }}
                >
                  <Play className="w-4 h-4" />
                  {isCompleted ? "View Adventure" : "Continue Adventure"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

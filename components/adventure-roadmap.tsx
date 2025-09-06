"use client";

import {
  Crown,
  Flag,
  Lock,
  MapPin,
  Star,
  Sword,
  Trophy,
  Zap,
  Shield,
  Gem,
  CheckCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { useState } from "react";

interface Quest {
  number: number;
  title: string;
  description: string;
  completed?: boolean;
  reward: string;
  difficulty: "Novice" | "Explorer" | "Adventurer" | "Hero" | "Legend";
  xp: number;
}

interface AdventureRoadmapProps {
  goal: string;
  quests: Quest[];
  onQuestToggle?: (questNumber: number, completed: boolean) => void;
}

export const AdventureRoadmap = ({ goal, quests, onQuestToggle }: AdventureRoadmapProps) => {
  const [hoveredQuest, setHoveredQuest] = useState<number | null>(null);

  const completedQuests = quests.filter((quest) => quest.completed).length;
  const currentQuest =
    completedQuests < quests.length ? completedQuests : quests.length - 1;
  const totalXP = quests
    .slice(0, completedQuests)
    .reduce((sum, quest) => sum + quest.xp, 0);
  const progressPercentage = (completedQuests / quests.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "text-green-500 bg-green-50";
      case "Explorer":
        return "text-blue-500 bg-blue-50";
      case "Adventurer":
        return "text-purple-500 bg-purple-50";
      case "Hero":
        return "text-orange-500 bg-orange-50";
      case "Legend":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getQuestIcon = (
    index: number,
    completed: boolean,
    isCurrent: boolean
  ) => {
    if (completed) return <CheckCircle className="w-8 h-8 text-primary" />;
    if (isCurrent)
      return <Zap className="w-8 h-8 text-accent animate-glow-pulse" />;
    if (index < 3) return <Star className="w-8 h-8 text-muted-foreground" />;
    if (index < 6) return <Sword className="w-8 h-8 text-muted-foreground" />;
    if (index < 9) return <Shield className="w-8 h-8 text-muted-foreground" />;
    return <Crown className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Stats Header */}
      <Card className="p-8 bg-gradient-hero text-primary-foreground border-0 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Flag className="w-8 h-8 animate-float" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{goal}</h1>
                <p className="text-primary-foreground/80 text-lg">
                  Your Epic 90-Day Adventure
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6" />
                <span className="text-2xl font-bold">{totalXP}</span>
                <span className="text-primary-foreground/80">XP</span>
              </div>
              <div className="text-primary-foreground/80 text-sm">
                Level {Math.floor(totalXP / 1000) + 1} Adventurer
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-primary-foreground/90 font-medium">
              <span>
                {completedQuests} of {quests.length} quests completed
              </span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full h-4 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground transition-all duration-1000 rounded-full relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-slide-in-right"></div>
              </div>
            </div>
            <div className="text-center">
              {completedQuests === quests.length ? (
                <div className="flex items-center justify-center gap-2 animate-bounce-gentle">
                  <Crown className="w-6 h-6" />
                  <span className="text-lg font-bold">
                    Quest Complete! You're a Legend! 🎉
                  </span>
                </div>
              ) : (
                <span className="text-primary-foreground/80">
                  Next milestone: Week {currentQuest + 1} -{" "}
                  {quests[currentQuest]?.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Adventure Path */}
      <div className="relative">
        {/* Path Line */}
        <div className="absolute left-8 top-20 bottom-20 w-1 adventure-path rounded-full"></div>

        <div className="space-y-6">
          {quests.map((quest, index) => {
            const isCompleted = quest.completed;
            const isCurrent = index === currentQuest && !isCompleted;
            const isLocked = index > currentQuest;

            return (
              <div
                key={quest.number}
                className={`relative transition-all duration-300 ${
                  hoveredQuest === index ? "transform scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredQuest(index)}
                onMouseLeave={() => setHoveredQuest(null)}
              >
                {/* Quest Node */}
                <div className="absolute left-4 top-8 z-10">
                  <div
                    className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary/20 border-4 border-primary shadow-glow"
                        : ""
                    }
                    ${
                      isCurrent
                        ? "bg-accent/20 border-4 border-accent shadow-soft animate-glow-pulse"
                        : ""
                    }
                    ${
                      isLocked
                        ? "bg-muted border-4 border-muted-foreground/30"
                        : ""
                    }
                    ${
                      !isCompleted && !isCurrent && !isLocked
                        ? "bg-card border-4 border-border"
                        : ""
                    }
                  `}
                  >
                    {isLocked ? (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      getQuestIcon(index, isCompleted || false, isCurrent)
                    )}
                  </div>
                </div>

                {/* Quest Card */}
                <Card
                  className={`
                  ml-24 p-6 transition-all duration-300 hover:shadow-card
                  ${
                    isCompleted
                      ? "bg-primary/5 border-primary/20 shadow-soft"
                      : ""
                  }
                  ${isCurrent ? "bg-accent/5 border-accent/20 shadow-card" : ""}
                  ${
                    isLocked
                      ? "bg-muted/20 border-muted-foreground/10 opacity-60"
                      : ""
                  }
                  ${!isLocked && onQuestToggle ? "cursor-pointer hover:scale-[1.01]" : ""}
                `}
                  onClick={() => {
                    if (!isLocked && onQuestToggle) {
                      onQuestToggle(quest.number, !isCompleted);
                    }
                  }}
                >
                  <div className="space-y-4">
                    {/* Quest Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Week {quest.number}
                          </span>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              quest.difficulty
                            )}`}
                          >
                            {quest.difficulty}
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Gem className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {quest.xp} XP
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                          {quest.title}
                          {isCurrent && (
                            <span className="text-accent animate-glow-pulse">
                              ← You are here!
                            </span>
                          )}
                        </h3>
                      </div>

                      {isCompleted && (
                        <div className="flex items-center gap-1 text-primary animate-bounce-gentle">
                          <Trophy className="w-5 h-5" />
                          <span className="text-sm font-medium">Complete!</span>
                        </div>
                      )}
                    </div>

                    {/* Quest Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {quest.description}
                    </p>

                    {/* Reward Badge */}
                    <div className="flex items-center gap-2 p-3 bg-gradient-accent rounded-lg border border-accent/20">
                      <Star className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-accent-foreground">
                        <strong>Reward:</strong> {quest.reward}
                      </span>
                    </div>

                    {/* Action Hint */}
                    {isCurrent && !isLocked && (
                      <div className="mt-4 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg animate-fade-in">
                        <p className="text-sm text-primary font-medium">
                          🎯 Ready to tackle this challenge? Click to mark as complete when done!
                        </p>
                      </div>
                    )}
                    
                    {/* Click hint for completed quests */}
                    {isCompleted && onQuestToggle && (
                      <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <p className="text-sm text-green-700 font-medium">
                          ✅ Completed! Click to unmark if needed.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Final Victory Banner */}
        {completedQuests === quests.length && (
          <div className="mt-12 text-center animate-bounce-gentle">
            <Card className="p-8 bg-gradient-hero text-primary-foreground border-0 shadow-glow">
              <div className="space-y-4">
                <Crown className="w-16 h-16 mx-auto animate-float" />
                <h2 className="text-3xl font-bold">🎉 QUEST COMPLETED! 🎉</h2>
                <p className="text-xl text-primary-foreground/90">
                  You've conquered your 90-day adventure and earned the title of{" "}
                  <strong>Master Achiever</strong>!
                </p>
                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalXP}</div>
                    <div className="text-sm text-primary-foreground/80">
                      Total XP Earned
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quests.length}</div>
                    <div className="text-sm text-primary-foreground/80">
                      Quests Mastered
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-primary-foreground/80">
                      Days of Growth
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import {
  Crown,
  Flag,
  Lock,
  Star,
  Trophy,
  Zap,
  Check,
  Gem,
} from "lucide-react";
import { Card } from "./ui/card";

// Interface definitions remain the same
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

export const AdventureRoadmap = ({
  goal,
  quests,
  onQuestToggle,
}: AdventureRoadmapProps) => {
  const completedQuests = quests.filter((quest) => quest.completed).length;
  const totalXP = quests
    .slice(0, completedQuests)
    .reduce((sum, quest) => sum + quest.xp, 0);
  const progressPercentage = (completedQuests / quests.length) * 100;
  
  const getCurrentQuest = () => {
    if (completedQuests === quests.length) return null;
    return quests[completedQuests];
  };
  const currentQuest = getCurrentQuest();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "text-green-400 border-green-500/50 bg-green-500/10";
      case "Explorer":
        return "text-blue-400 border-blue-500/50 bg-blue-500/10";
      case "Adventurer":
        return "text-purple-400 border-purple-500/50 bg-purple-500/10";
      case "Hero":
        return "text-orange-400 border-orange-500/50 bg-orange-500/10";
      case "Legend":
        return "text-red-400 border-red-500/50 bg-red-500/10";
      default:
        return "text-gray-400 border-gray-500/50 bg-gray-500/10";
    }
  };

  const renderDescriptionWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const parts = text.split(linkRegex);
    return (
      <>
        {parts.map((part, index) => {
          if (index % 3 === 2) return null;
          if (index % 3 === 1) {
            const url = parts[index + 1];
            return (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline font-medium transition-colors">
                {part}
              </a>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans px-4">
      {/* --- MODIFIED --- Header Card is now responsive */}
      <Card className="p-4 md:p-6 bg-slate-900/50 border-slate-700/50 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Flag className="w-7 h-7 md:w-8 md:h-8 text-orange-500 shrink-0" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{goal}</h1>
                <p className="text-slate-400 text-sm md:text-base">Your Epic 90-Day Adventure</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 self-stretch md:self-auto">
              <Trophy className="w-6 h-6 text-orange-500" />
              <div>
                <span className="text-xl md:text-2xl font-bold text-white">{totalXP}</span>
                <span className="text-slate-400"> XP</span>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Level {Math.floor(totalXP / 1000) + 1}
                </div>
              </div>
            </div>
          </div>
          {/* Progress Bar Section remains largely the same */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium text-sm">
              <span>Progress</span>
              <span>{completedQuests} / {quests.length} Quests</span>
            </div>
            <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center pt-2">
              {progressPercentage === 100 ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Crown className="w-5 h-5" />
                  <span className="text-lg font-bold">Adventure Complete! 🎉</span>
                </div>
              ) : (
                <span className="text-slate-400 text-sm truncate">
                  <strong className="text-slate-200">Next Up:</strong> {currentQuest?.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* --- MODIFIED --- Adventure Path now uses responsive layouts */}
      <div className="space-y-4 md:space-y-6">
        {quests.map((quest) => {
          const isCompleted = quest.completed ?? false;
          const isCurrent = quest.number === currentQuest?.number;
          const isLocked = !isCompleted && !isCurrent;
          const buttonCursor = !isLocked && onQuestToggle ? "cursor-pointer" : "cursor-default";

          return (
            <Card
              key={quest.number}
              className={`
                transition-all duration-300 border overflow-hidden
                ${isLocked ? "bg-slate-800/40 border-slate-700/30" : "bg-slate-800/70 border-slate-700/80"}
                ${isCurrent ? "!border-orange-500/80 shadow-2xl shadow-orange-900/50" : ""}
                ${isCompleted ? "border-slate-700/50" : ""}
              `}
            >
              {/* --- NEW --- Using Grid for powerful responsive layout changes */}
              <div className="flex lg:grid lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)]">
                {/* --- Left / Title Section (Visible as first column on LG screens) --- */}
                <div className={`p-4 lg:p-5 ${isLocked ? "opacity-50" : ""} hidden lg:block`}>
                  <p className="text-sm font-semibold text-orange-400">Quest {quest.number}</p>
                  <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                </div>

                {/* --- Center / Timeline Section --- */}
                <div className="relative flex-shrink-0 w-16 lg:w-20 flex justify-center">
                  <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-slate-700 rounded-full"></div>
                  {isCompleted && <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-gradient-to-b from-orange-500 to-amber-500"></div>}
                  <button
                    onClick={() => onQuestToggle && onQuestToggle(quest.number, !isCompleted)}
                    disabled={isLocked || !onQuestToggle}
                    className={`
                      absolute top-1/2 -translate-y-1/2 z-10
                      w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300
                      ring-8 ring-slate-800 ${buttonCursor} transform
                      focus:outline-none focus:ring-4 focus:ring-orange-500/50 active:scale-90
                      ${isCompleted ? "bg-orange-500 text-white" : ""}
                      ${isCurrent ? "bg-orange-400/20 border-2 border-orange-400 text-orange-400 animate-pulse lg:scale-110" : ""}
                      ${isLocked ? "bg-slate-700 text-slate-500 border-2 border-slate-600" : ""}
                    `}
                  >
                    {isLocked ? <Lock className="w-6 h-6" /> : isCompleted ? <Check className="w-7 h-7" /> : <Zap className="w-6 h-6" />}
                  </button>
                </div>
                
                {/* --- Right / Details Section --- */}
                <div className={`flex-1 p-4 lg:p-5 ${isLocked ? "opacity-50" : ""}`}>
                  {/* Title block for mobile/tablet view */}
                  <div className="block lg:hidden mb-2">
                     <p className="text-sm font-semibold text-orange-400">Quest {quest.number}</p>
                     <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                  </div>
                  
                  {/* Tags and Description */}
                  <div className="space-y-3">
                     <div className="flex flex-wrap items-center gap-3">
                       <div className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getDifficultyColor(quest.difficulty)}`}>
                         {quest.difficulty}
                       </div>
                       <div className="flex items-center gap-1.5 text-amber-400">
                         <Gem className="w-4 h-4" />
                         <span className="text-sm font-medium">{quest.xp} XP</span>
                       </div>
                     </div>
                     <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                       {renderDescriptionWithLinks(quest.description)}
                     </p>
                  </div>

                  {/* Reward */}
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-md mt-4">
                    <Star className="w-5 h-5 text-orange-400 shrink-0" />
                    <span className="text-sm text-slate-300">
                      <strong className="font-semibold text-orange-300">Reward:</strong> {quest.reward}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* --- Final celebratory card is already responsive --- */}
        {progressPercentage === 100 && (
          <Card className="border-amber-400/50 bg-slate-800/80 shadow-lg shadow-amber-900/40">
            <div className="p-6 md:p-8 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Crown className="w-8 h-8 md:w-9 md:h-9" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-amber-300 mb-2">
                  Victory! The Goal is Achieved!
                </h3>
                <p className="text-slate-300 max-w-lg mx-auto text-sm md:text-base">
                  You have conquered every quest and completed your adventure. Well done!
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
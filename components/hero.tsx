import { Sparkles, MapPin, Trophy, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 px-4">
      {/* Floating background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-accent/40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-secondary/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-60 right-1/3 w-1 h-1 bg-primary/20 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Animated badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 hover-scale hover-glow animate-bounce-gentle">
          <Sparkles className="w-5 h-5 mr-2 animate-glow-pulse" />
          <span className="text-sm font-medium">
            Your Epic Adventure Awaits
          </span>
        </div>

        {/* Main heading with staggered animation */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          Transform Your
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            {" "}Dream Quest{" "}
          </span>
          Into Your Success Story
        </h1>

        {/* Subheading */}
        <p
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Stop dreaming, start adventuring! Turn any ambitious goal into an epic
          90-day quest with weekly challenges, milestones, and victories.
        </p>

        {/* Animated feature highlights */}
        <div
          className="flex flex-col md:flex-row items-center justify-center gap-8 text-muted-foreground mb-16 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-3 hover-scale group">
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">90-Day Quest</span>
          </div>
          <div className="flex items-center gap-3 hover-scale group">
            <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium">Weekly Victories</span>
          </div>
          <div className="flex items-center gap-3 hover-scale group">
            <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-all">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-medium">Level Up Daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}

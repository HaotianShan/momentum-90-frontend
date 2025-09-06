import { Sparkles, MapPin, Trophy, Zap } from "lucide-react";
import InteractiveBlurText from "./interactive-blur-text";

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
        {/* Main heading with staggered animation */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in mt-16">
          Build
          <InteractiveBlurText />
        </h1>

        {/* Subheading */}
        <p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Turn your super goals into a clear, weekly action plan and achieve them in 90 days.
        </p>
      </div>
    </section>
  );
}

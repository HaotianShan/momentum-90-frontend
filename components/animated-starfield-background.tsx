// src/components/animated-starfield-background.tsx
export default function AnimatedStarfieldBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
      {/* Stars Layer 1 (Closest) */}
      <div
        className="absolute inset-0 h-full w-full animate-[animate-stars_30s_linear_infinite] bg-repeat"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, #ffffff, transparent)," +
            "radial-gradient(1px 1px at 80px 120px, #ffffff, transparent)," +
            "radial-gradient(0.5px 0.5px at 150px 70px, #dddddd, transparent)",
          backgroundSize: "200px 200px",
        }}
      />
      {/* Stars Layer 2 (Middle) */}
      <div
        className="absolute inset-0 h-full w-full animate-[animate-stars_100s_linear_infinite] bg-repeat"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 40px 80px, #ffffff, transparent)," +
            "radial-gradient(0.5px 0.5px at 100px 160px, #dddddd, transparent)," +
            "radial-gradient(1px 1px at 180px 30px, #ffffff, transparent)",
          backgroundSize: "300px 300px",
        }}
      />
      {/* Stars Layer 3 (Farthest) */}
      <div
        className="absolute inset-0 h-full w-full animate-[animate-stars_150s_linear_infinite] bg-repeat"
        style={{
          backgroundImage:
            "radial-gradient(0.5px 0.5px at 50px 50px, #dddddd, transparent)," +
            "radial-gradient(0.5px 0.5px at 200px 200px, #bbbbbb, transparent)," +
            "radial-gradient(1px 1px at 250px 80px, #ffffff, transparent)",
          backgroundSize: "400px 400px",
        }}
      />

      {/* Gradient Overlays (from original) */}
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-950/50 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/15 via-slate-950/50 to-transparent blur-3xl" />
    </div>
  );
}

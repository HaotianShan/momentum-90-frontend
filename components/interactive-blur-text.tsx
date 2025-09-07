"use client";

import { useRef, useEffect } from "react";

const GlobalFocusText = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate the mouse's position as a ratio of the window's dimensions
      const mouseXRatio = e.clientX / windowWidth;
      const mouseYRatio = e.clientY / windowHeight;

      // Apply this ratio to the element's dimensions to get the new focus point
      const elementX = mouseXRatio * rect.width;
      const elementY = mouseYRatio * rect.height;

      ref.current.style.setProperty("--mouse-x", `${elementX}px`);
      ref.current.style.setProperty("--mouse-y", `${elementY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="relative inline-block mx-2 text-7xl md:text-10xl mt-2"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Blurred Base Text */}
      <span
        className="bg-gradient-hero bg-clip-text text-transparent"
        style={{ filter: "blur(4px)" }}
      >
        Momentum
      </span>

      {/* Sharp Text with "Focus Lens" Mask */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-hero bg-clip-text text-transparent pointer-events-none"
        style={{
          mask: `radial-gradient(
            circle 150px at var(--mouse-x) var(--mouse-y), 
            black 40%, 
            transparent 100%
          )`,
          WebkitMask: `radial-gradient(
            circle 150px at var(--mouse-x) var(--mouse-y), 
            black 40%, 
            transparent 100%
          )`,
        }}
      >
        Momentum
      </span>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-2xl scale-125 pointer-events-none -z-10" />
    </span>
  );
};

export default GlobalFocusText;

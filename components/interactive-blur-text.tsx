'use client';

const InteractiveBlurText = () => {
  return (
    <span className="relative inline-block mx-2">
      {/* Base text with left-to-right blur gradient */}
      <span
        className="bg-gradient-hero bg-clip-text text-transparent"
        style={{
          WebkitMask: 'linear-gradient(to right, black 0%, black 30%, transparent 100%)',
          mask: 'linear-gradient(to right, black 0%, black 30%, transparent 100%)',
          filter: 'blur(0px)',
        }}
      >
        Momentum
      </span>
      
      {/* Blurred text overlay */}
      <span
        className="absolute inset-0 bg-gradient-hero bg-clip-text text-transparent pointer-events-none"
        style={{
          WebkitMask: 'linear-gradient(to right, transparent 0%, transparent 70%, black 100%)',
          mask: 'linear-gradient(to right, transparent 0%, transparent 70%, black 100%)',
          filter: 'blur(4px)',
        }}
      >
        Momentum
      </span>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-2xl scale-125 pointer-events-none"></div>
    </span>
  );
};

export default InteractiveBlurText;
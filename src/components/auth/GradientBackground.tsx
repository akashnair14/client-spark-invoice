
import React from "react";

// Animated dark tech background (radial + conic, for sleekness)
const GradientBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
    <div className="absolute inset-0 bg-[#121212]" />
    <div className="absolute inset-0 bg-[conic-gradient(at_left,_#1a1d5c_0%,#0a1633_30%,#20206e_55%,#130d44_100%)] opacity-80 animate-gradient-rotate" />
    <div className="absolute -inset-12 bg-gradient-radial from-blue-700/30 via-sky-400/10 to-transparent w-[110vw] h-[85vh] left-1/2 -translate-x-1/2 -top-[10%] opacity-80 blur-3xl" />
    <div className="absolute inset-0 bg-black/60" />
    <style>
      {`
      @keyframes gradient-rotate {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
      .animate-gradient-rotate {
        animation: gradient-rotate 32s linear infinite;
      }
      `}
    </style>
  </div>
);

export default GradientBackground;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumLoaderProps {
  /** "full" = full screen (auth/protected route), "inline" = within content area */
  variant?: "full" | "inline";
  className?: string;
}

const messages = [
  "Preparing your workspace",
  "Loading data",
  "Almost ready",
];

const PremiumLoader: React.FC<PremiumLoaderProps> = ({ variant = "inline", className = "" }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isFull = variant === "full";

  return (
    <div
      className={`flex items-center justify-center ${
        isFull ? "min-h-screen bg-background" : "min-h-[50vh]"
      } ${className}`}
    >
      {/* Ambient background blobs — full variant only */}
      {isFull && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]"
            animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px]"
            animate={{ x: [0, -50, 40, 0], y: [0, 30, -50, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Core animated element */}
        <div className="relative w-20 h-20">
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          />

          {/* Rotating arc 1 */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 80 80"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 170"
              opacity="0.6"
            />
          </motion.svg>

          {/* Rotating arc 2 — counter */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 80 80"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="40" cy="40" r="28"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="40 140"
              opacity="0.4"
            />
          </motion.svg>

          {/* Inner glowing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]"
              animate={{ scale: [1, 0.92, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="text-primary font-bold text-base tracking-tight"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                S
              </motion.span>
            </motion.div>
          </div>

          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
              style={{ top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 2) * 34, 0],
                y: [0, Math.sin((i * Math.PI) / 2) * 34, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Animated message */}
        <div className="flex flex-col items-center gap-2 min-h-[44px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={msgIndex}
              className="text-sm font-medium text-foreground/70 tracking-wide"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {messages[msgIndex]}
            </motion.span>
          </AnimatePresence>

          {/* Animated dots progress */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-primary/50"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtle shimmer bar */}
        <div className="w-32 h-[2px] rounded-full bg-border/40 overflow-hidden">
          <motion.div
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;

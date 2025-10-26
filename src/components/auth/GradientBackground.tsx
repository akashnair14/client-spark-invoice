import React from "react";
import { motion } from "framer-motion";

// Check if user prefers reduced motion
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

// Modern animated gradient background with mesh effect and accessibility support
const GradientBackground: React.FC = () => {
  // Blob animation variants
  const blobVariants = {
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.1, 0.9, 1],
      x: prefersReducedMotion ? 0 : [0, 50, -30, 0],
      y: prefersReducedMotion ? 0 : [0, -30, 50, 0],
      opacity: [0.3, 0.5, 0.3],
    }
  };

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
      
      {/* Animated mesh gradient blobs with framer-motion */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{
          duration: prefersReducedMotion ? 0 : 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
      />
      
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{
          duration: prefersReducedMotion ? 0 : 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]"
      />
      
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{
          duration: prefersReducedMotion ? 0 : 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[90px]"
      />
      
      {/* Additional floating orbs for depth */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          y: [0, -50, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]"
      />
      
      <motion.div
        animate={prefersReducedMotion ? {} : {
          y: [0, 50, 0],
          x: [0, -30, 0],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-primary/8 rounded-full blur-[70px]"
      />
      
      {/* Animated grid overlay */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      
      {/* Radial gradient for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/50 to-background" />
    </div>
  );
};

export default GradientBackground;

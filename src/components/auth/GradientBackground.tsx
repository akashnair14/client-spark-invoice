import React from "react";

// Modern animated gradient background with mesh effect
const GradientBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
    
    {/* Animated mesh gradient blobs */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
    <div className="absolute top-1/3 right-1/3 w-[350px] h-[350px] bg-primary/15 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
    
    {/* Animated grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
    
    {/* Subtle noise texture */}
    <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
  </div>
);

export default GradientBackground;

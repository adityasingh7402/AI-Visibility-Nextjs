"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BackgroundHexagons = ({ className = "" }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hexagon dimensions - slightly larger for impact
  const s = 45; 
  const h = Math.sqrt(3) * s;

  if (!mounted) return null;

  const getPoints = (x: number, y: number) => {
    return [
      [x + s / 2, y],
      [x + 1.5 * s, y],
      [x + 2 * s, y + h / 2],
      [x + 1.5 * s, y + h],
      [x + s / 2, y + h],
      [x, y + h / 2],
    ].map(p => p.join(",")).join(" ");
  };

  const renderCluster = (clusterIndex: number) => {
    const hexagons = [];
    const rows = 5;
    const cols = 5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Higher density in the core of the cluster
        const dist = Math.sqrt(r * r + c * c);
        if (Math.random() > dist * 0.15) {
          const x = c * 1.5 * s;
          const y = r * h + (c % 2 === 0 ? 0 : h / 2);
          const isGlow = Math.random() > 0.7;
          
          hexagons.push({ x, y, isGlow, r, c });
        }
      }
    }

    return (
      <g key={clusterIndex}>
        {hexagons.map((hex, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: (hex.r + hex.c) * 0.08 + clusterIndex * 0.3,
            }}
          >
            {/* 3D Tile with stronger shadow */}
            <polygon
              points={getPoints(hex.x, hex.y)}
              fill="url(#hex-grad)"
              stroke="#cbd5e1"
              strokeWidth="1"
              filter="url(#hex-shadow-heavy)"
            />

            {/* Intense Cyan/Blue Glow */}
            {hex.isGlow && (
              <motion.g
                animate={{ 
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {/* Glow Ring */}
                <polygon
                  points={getPoints(hex.x, hex.y)}
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#cyan-outer-glow)"
                />
                {/* Inner Glow Fill */}
                <polygon
                  points={getPoints(hex.x, hex.y)}
                  fill="url(#cyan-inner-glow)"
                  className="opacity-20"
                />
              </motion.g>
            )}
          </motion.g>
        ))}
      </g>
    );
  };

  return (
    <div className={`absolute pointer-events-none select-none overflow-hidden ${className}`} aria-hidden="true" style={{ zIndex: 0 }}>
      {/* Increased contrast background pulse */}
      <div className="absolute inset-0 bg-cyan-400/5 blur-[120px] rounded-full" />
      
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-80"
      >
        <defs>
          <filter id="hex-shadow-heavy" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.4" />
          </filter>
          
          <filter id="cyan-outer-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" operator="over" />
          </filter>

          <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <radialGradient id="cyan-inner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top Left Cluster */}
        <g transform="translate(30,30)">
          {renderCluster(0)}
        </g>

        {/* Bottom Right Cluster */}
        <g transform="translate(350,350) rotate(180, 100, 100)">
          {renderCluster(1)}
        </g>
      </svg>
    </div>
  );
};

export default BackgroundHexagons;

'use client';

import React, { useEffect, useState } from 'react';

export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  type: 'hex' | 'diamond' | 'circle';
  color: 'cyan' | 'emerald' | 'purple';
  glowIntensity: number;
};

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      opacity: Math.random() * 0.8 + 0.2,
      type: Math.random() > 0.7 ? 'hex' : Math.random() > 0.5 ? 'diamond' : 'circle',
      color: Math.random() > 0.6 ? 'cyan' : Math.random() > 0.3 ? 'emerald' : 'purple',
      glowIntensity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(8px) rotate(90deg); }
          50% { transform: translateY(-8px) translateX(-5px) rotate(180deg); }
          75% { transform: translateY(-12px) translateX(3px) rotate(270deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes matrix {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-float { animation: float infinite ease-in-out; }
        .animate-pulse-custom { animation: pulse 3s infinite ease-in-out; }
        .animate-matrix { animation: matrix 12s infinite linear; }
        .glow-cyan { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
        .glow-emerald { box-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981; }
        .glow-purple { box-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7; }
        .hex-shape { clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); }
        .diamond-shape { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
      `}</style>

      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute ${
            p.color === 'cyan'
              ? 'bg-cyan-400 glow-cyan'
              : p.color === 'emerald'
              ? 'bg-emerald-400 glow-emerald'
              : 'bg-purple-400 glow-purple'
          } ${
            p.type === 'hex'
              ? 'hex-shape animate-matrix'
              : p.type === 'diamond'
              ? 'diamond-shape animate-pulse-custom'
              : 'rounded-full animate-float'
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: `brightness(${1 + p.glowIntensity})`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;

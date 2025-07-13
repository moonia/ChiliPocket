'use client';
import React, { ReactNode } from 'react';

interface HoloCardProps {
  children: ReactNode;
  className?: string;
}

const HoloCard: React.FC<HoloCardProps> = ({ children, className = '' }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    (e.currentTarget as HTMLDivElement).style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateY(-8px) 
      scale(1.03)
    `;

    const holoElement = e.currentTarget.querySelector('.holo-effect') as HTMLElement;
    if (holoElement) {
      holoElement.style.background = `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 0, 255, 0.2) 25%,
          rgba(0, 255, 255, 0.2) 50%,
          rgba(255, 255, 0, 0.2) 75%,
          transparent 100%
        )
      `;
      holoElement.style.opacity = '1';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    const holoElement = e.currentTarget.querySelector('.holo-effect') as HTMLElement;
    if (holoElement) {
      holoElement.style.opacity = '0';
    }
  };

  return (
    <div
      className={`group relative bg-[#13131a] border border-[#232334] rounded-2xl p-10 shadow-md transition duration-700 cursor-pointer overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'all 0.3s ease-out' }}
    >
      {/* Holo shine */}
      <div className="holo-effect absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none z-20" />

      {/* Shimmer & Glow overlays */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shimmer-effect" />
      </div>

      {/* Soft blurred border glow */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-pink-500/20 blur-lg rounded-2xl opacity-50 group-hover:opacity-100 transition-all duration-700" />

      {/* Shine tint */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">{children}</div>

      {/* Sparkling dots */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full pulse-effect"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .shimmer-effect {
          animation: shimmer 2s ease-in-out infinite;
        }

        .pulse-effect {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HoloCard;

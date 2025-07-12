'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function PlayersCards() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const players = [
    { name: 'Yamal', src: '/playersCards/yamal.png' },
    { name: 'Hakimi', src: '/playersCards/hakimi.png' },
    { name: 'Mbappe', src: '/playersCards/mbappe.png' },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev + 1) % players.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev - 1 + players.length) % players.length);
  };

  const getRelativeIndex = (index: number): number => {
    const diff = (index - currentIndex + players.length) % players.length;
    return diff;
  };

  const getStyleByPosition = (relativeIndex: number) => {
    switch (relativeIndex) {
      case 0:
        return {
          transform: 'translateX(0) scale(1.1)',
          zIndex: 30,
          opacity: 1,
          width: 400,
          height: 500,
        };
      case 1:
        return {
          transform: 'translateX(220px) scale(0.9)',
          zIndex: 20,
          opacity: 0.8,
          width: 300,
          height: 400,
        };
      case 2:
        return {
          transform: 'translateX(-220px) scale(0.9)',
          zIndex: 20,
          opacity: 0.8,
          width: 300,
          height: 400,
        };
      default:
        return {
          transform: 'translateX(0) scale(0.8)',
          zIndex: 10,
          opacity: 0,
        };
    }
  };

  return (
    <div className="mt-16 relative flex justify-center items-center w-full max-w-4xl mx-auto overflow-hidden">
      <button
        onClick={handlePrevious}
        className="absolute left-0 z-40 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="relative flex justify-center items-center w-[500px] h-[500px]">
        {players.map((player, index) => {
          const relativeIndex = getRelativeIndex(index);
          const style = getStyleByPosition(relativeIndex);

          return (
            <div
              key={player.name}
              className={`w-[${style.width}px] h-[${style.height}px] absolute transition-all duration-500 ease-in-out`}
              style={{
                transform: style.transform,
                zIndex: style.zIndex,
                opacity: style.opacity,
              }}
            >
              <Image
                width={style.width}
                height={style.height}
                src={player.src}
                alt={`${player.name} Card`}
                className="object-cover rounded-xl"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 z-40 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

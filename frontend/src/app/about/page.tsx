'use client';

import React from 'react';
import Link from 'next/link';
import FloatingParticles from '../components/FloatingParticles';

export default function About() {
  return (
    <main className="min-h-screen bg-[#0f0c29] text-white px-6 py-24 flex flex-col items-center relative">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-400/10 via-purple-600/10 to-transparent blur-2xl opacity-30 z-0" />

      <FloatingParticles />
      <div className="relative z-10 max-w-4xl text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-8">
          About the Project
        </h1>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          This project was created as part of the <span className="text-[#ff004f] font-semibold">Chiliz Hackathon 2025</span>, with the mission of merging the thrill of live events and sports fandom with the power of Web3 technology.
        </p>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          We took inspiration from <strong>POAPs</strong> (Proof of Attendance Protocols), which are digital collectibles that act as verifiable memories of participation. These unique tokens are tied to events, matches, or key moments — giving fans something to own, cherish, and show off forever.
        </p>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Our goal was to reimagine this concept through an interactive and gamified experience: fans can now scan tickets, mint NFT cards, and climb the leaderboard by actively participating in real-world or online events.
        </p>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          The NFTs and POAPs minted through our platform are secured on the <span className="text-[#ff004f] font-semibold">Chiliz blockchain</span>, ensuring authenticity, ownership, and transparency.
        </p>

        <p className="text-lg text-gray-300 mb-12 leading-relaxed">
          Whether you&apos;re a hardcore fan, a collector, or simply curious about the future of fandom in Web3, this project is for you. Join us, start collecting, and let your passion shine on-chain.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-10 py-4 bg-[#ff004f] text-white font-normal rounded-full hover:bg-white hover:text-[#ff004f] transition"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}

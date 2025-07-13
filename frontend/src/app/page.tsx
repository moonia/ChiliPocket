'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Partners from './components/Partners';
import Footbar from './components/Footbar';
import PlayersCards from './components/PlayersCards';
import { Zap, Shield, Trophy, Users, ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import HoloCard from './components/HoloCard';
import FloatingParticles from './components/FloatingParticles';

interface FadeInSectionProps {
  delay: number;
  children: React.ReactNode;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ delay, children }) => {
  return (
    <div 
      className="opacity-100 transform translate-y-0 transition-all duration-1000"
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      setScroll(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-gradient-to-r from-[#ff004f] to-cyan-400 transition-all duration-150"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative min-h-screen text-white font-sans bg-[#0f0c29] overflow-hidden">
      <ScrollProgress />
      <div className="absolute inset-0 bg-gradient-radial from-cyan-400/10 via-purple-600/10 to-transparent blur-2xl opacity-30 z-0" />
      <FloatingParticles />
      <div className="relative z-10">
        <Navbar />

        <FadeInSection delay={0.1}>
          <section className="text-center px-6 mt-10 py-16">
            <div className="max-w-4xl mx-auto mt-10">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-snug mb-6 text-white">
                FEEL THE GAME.<br />
                <span className="text-white">EARN CARDS, SHARE PASSION</span>
              </h1>
              <p className="text-md md:text-ml text-gray-400 mb-10">
                Mint NFT cards, climb the leaderboard, and own your digital glory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative px-8 py-3 bg-[#ff004f] text-white rounded-full font-medium border border-[#ff004f] hover:bg-white hover:text-[#ff004f]">
                  <span className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-white group-hover:text-[#ff004f] transition-colors" />
                    <span className="group-hover:text-[#ff004f] transition-colors">START COLLECTING</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-[#ff004f] transition-colors" />
                  </span>
                </button>
                <button className="px-8 py-3 border border-white rounded-full text-sm font-medium text-white hover:bg-white hover:text-[#ff004f] transition flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="flex justify-center gap-12 mt-16 text-center">
                {[['9.5K+', 'Events'], ['90K+', 'NFT Cards'], ['1K+', 'Community']].map(([num, label], i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-1">
                      {num}
                    </div>
                    <div className="text-sm uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={0.3}><PlayersCards /></FadeInSection>
        <FadeInSection delay={0.5}><Partners /></FadeInSection>

        <FadeInSection delay={0.6}>
          <section className="mt-40 px-6 py-32">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">PLAY, SCAN, COLLECT, PROGRESS</h2>
                <p className="text-lg text-gray-400">
                  A gamified, decentralized collectible experience
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    icon: <Trophy className="w-7 h-7 text-white" />, 
                    title: 'Earn NFT Cards',
                    desc: 'Scan your match tickets, complete quests and unlock blockchain-based collectibles that are truly yours.',
                  },
                  {
                    icon: <Shield className="w-7 h-7 text-white" />, 
                    title: 'Connect Your Wallet',
                    desc: 'Effortlessly access Web3 via MetaMask or WalletConnect and start collecting instantly.',
                  },
                  {
                    icon: <Users className="w-7 h-7 text-white" />, 
                    title: 'Collect & Rise',
                    desc: 'Trade, share, and shine on the leaderboard with unique NFTs representing your fandom.',
                  },
                ].map(({ icon, title, desc }, i) => (
                  <HoloCard key={i}>
                    <div className="flex flex-col items-start">
                      <div className="mb-6 w-14 h-14 rounded-full flex items-center justify-center bg-[#1f1f29]">
                        {icon}
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </HoloCard>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={1.3}>
          <section className="px-6 py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-10">
                POAPs powered by blockchain, designed for fans
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-20">
                Thanks to the <span className="text-[#ff004f] font-semibold">Chiliz blockchain</span>, we offer fans the ability to collect <strong>verifiable POAPs</strong> (Proof of Attendance Protocol) tied to real events, forever stored on-chain.
              </p>

              <div className="relative ml-4 space-y-12">
                {[
                  {
                    icon: '📍',
                    title: 'Proof of presence',
                    description:
                      'Each POAP is a unique token linked to a real match, meetup, or fan moment — a forever memory secured on-chain.',
                  },
                  {
                    icon: '📦',
                    title: 'Limited & immutable',
                    description:
                      'POAPs can’t be faked, duplicated or deleted. Once minted, they’re yours — forever. A digital badge of honor.',
                  },
                  {
                    icon: '🤝',
                    title: 'Powered by Chiliz ecosystem',
                    description:
                      'Through Chiliz’s partnerships with major sports clubs, fans like you can collect official POAPs from iconic events.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                    className="relative pl-10"
                  >
                    <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-[#ff004f] shadow-lg" />
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
                      <span className="text-2xl">{item.icon}</span>
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-16">
                🔗 These POAPs are minted on <span className="text-white font-medium">Chiliz</span> — the blockchain infrastructure powering major sports experiences.
              </p>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={1.2}>
          <section className="mt-48 px-6 py-32 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                🎯 Ready to join the movement?
              </h2>
              <p className="text-lg text-gray-400 mb-12">
                Join thousands of collectors already on the chain. Mint, play, and rise.
              </p>
              <button className="px-10 py-4 bg-[#ff004f] text-white font-semibold rounded-full hover:bg-white hover:text-[#ff004f] transition">
                Start Now
              </button>
            </div>
          </section>
        </FadeInSection>

        <Footbar />
      </div>
    </main>
  );
}

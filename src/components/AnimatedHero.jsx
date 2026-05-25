import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Wallet, Cpu, DollarSign, TrendingDown, Users, Code } from 'lucide-react';

export default function AnimatedHero() {
  const [estSpend, setEstSpend] = useState(150);
  const estimatedSavings = Math.round(estSpend * 0.35);

  // Background floating particles definition
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * -10
  }));

  return (
    <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 min-h-[90vh] flex items-center bg-slate-950 text-slate-100">
      
      {/* 1. FUTURISTIC BACKGROUND AND PARTICLES */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* Animated Radial Gradients */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-brand-2/15 via-brand-1/10 to-transparent blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/4 right-10 h-[400px] w-[400px] rounded-full bg-brand-3/10 blur-[100px]" 
        />
        
        {/* Floating Background Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-1/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: TEXT CONTENT AND CTAs */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full border border-brand-2/30 bg-brand-2/10 px-3 py-1.5 text-xs font-semibold text-brand-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen AI Spend Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
            >
              AI Spend <br className="hidden sm:inline" />
              <span className="gradient-text font-black">Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto lg:mx-0 max-w-lg text-sm sm:text-base text-slate-400 leading-relaxed"
            >
              Visualize and optimize your AI costs in real time. Identify seat overlap, plan mismatches, and discover immediate opportunities to save hundreds monthly.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/audit">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="glow-btn flex items-center space-x-2 rounded-full bg-gradient-to-r from-brand-1 via-brand-2 to-brand-3 px-7 py-3.5 text-sm font-bold text-white shadow-xl"
                >
                  <span>Audit My Spend</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </motion.button>
              </Link>
              
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "var(--slate-800)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/40 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors"
                >
                  <span>See How It Works</span>
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: FUTURISTIC INTERACTIVE DASHBOARD ANIMATION */}
          <div className="lg:col-span-7 relative h-[500px] w-full flex items-center justify-center">
            
            {/* SVG Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 600 500">
              <defs>
                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--brand-1)" />
                  <stop offset="100%" stopColor="var(--brand-2)" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--brand-3)" />
                  <stop offset="100%" stopColor="var(--brand-2)" />
                </linearGradient>
              </defs>
              
              {/* Path 1: Calculator (Top Left) to Center */}
              <motion.path 
                d="M 170 120 Q 220 200 300 250" 
                fill="transparent" 
                stroke="url(#lineGrad1)" 
                strokeWidth="1.5"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [-100, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              {/* Path 2: Analytics (Top Right) to Center */}
              <motion.path 
                d="M 430 110 Q 380 180 300 250" 
                fill="transparent" 
                stroke="url(#lineGrad2)" 
                strokeWidth="1.5"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              {/* Path 3: Recommendations (Bottom Left) to Center */}
              <motion.path 
                d="M 160 380 Q 220 300 300 250" 
                fill="transparent" 
                stroke="url(#lineGrad2)" 
                strokeWidth="1.5"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [-100, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
              />
              {/* Path 4: Models Stack (Bottom Right) to Center */}
              <motion.path 
                d="M 440 370 Q 380 310 300 250" 
                fill="transparent" 
                stroke="url(#lineGrad1)" 
                strokeWidth="1.5"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* 2. CENTRAL ORB / SYSTEM CORE */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              {/* outer animated ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute h-32 w-32 rounded-full border border-dashed border-brand-2/40 flex items-center justify-center"
              />
              {/* glowing pulsing core */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 30px rgba(249, 115, 22, 0.4)",
                    "0 0 50px rgba(249, 115, 22, 0.7)",
                    "0 0 30px rgba(249, 115, 22, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-20 w-20 rounded-full bg-gradient-to-tr from-brand-1 via-brand-2 to-brand-3 p-[1px] flex items-center justify-center"
              >
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-brand-2 animate-pulse" />
                </div>
              </motion.div>
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-2 mt-4 bg-slate-950/80 px-2 py-0.5 rounded border border-brand-2/20">
                Engine Core
              </span>
            </div>

            {/* 3. FLOATING GLASSMORPHISM CARDS */}
            
            {/* Card 1: Interactive Quick ROI Calculator (Top Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30, y: -30 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0],
                rotate: [-0.5, 0.5, -0.5]
              }}
              transition={{
                y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 35px rgba(234, 179, 8, 0.35)",
                borderColor: "rgba(234, 179, 8, 0.4)" 
              }}
              className="absolute top-4 left-4 md:top-8 md:left-8 z-20 w-[220px] rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-1 tracking-wider uppercase flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> ROI Calculator
                </span>
                <span className="text-[8px] bg-slate-900 border border-slate-800 rounded px-1 text-slate-400">
                  Interactive
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>AI Spend:</span>
                  <span className="font-bold text-white">${estSpend}/mo</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="800"
                  step="10"
                  value={estSpend}
                  onChange={(e) => setEstSpend(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-1"
                />
                <div className="rounded-lg bg-slate-950/60 p-2 text-center border border-slate-900">
                  <span className="text-[9px] text-slate-400 block">Est. Monthly Savings</span>
                  <span className="text-lg font-black text-brand-1">${estimatedSavings}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Analytics Sparkline Chart (Top Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30, y: -30 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, 8, 0],
                rotate: [0.5, -0.5, 0.5]
              }}
              transition={{
                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                opacity: { duration: 0.5, delay: 0.1 },
                scale: { duration: 0.5, delay: 0.1 }
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 35px rgba(34, 197, 94, 0.35)",
                borderColor: "rgba(34, 197, 94, 0.4)" 
              }}
              className="absolute top-2 right-4 md:top-6 md:right-8 z-20 w-[200px] rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-3 tracking-wider uppercase flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Savings Trend
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[20px] font-extrabold text-white leading-tight">
                  +35.4%
                  <span className="text-[9px] text-brand-3 ml-1">efficiency</span>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30">
                  <motion.path
                    d="M0 25 Q15 20 30 12 T60 18 T90 2"
                    fill="transparent"
                    stroke="var(--brand-3)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="90"
                    cy="2"
                    r="2"
                    fill="var(--brand-3)"
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </svg>
                <p className="text-[8px] text-slate-400">Total verified savings: $145k+</p>
              </div>
            </motion.div>

            {/* Card 3: Dynamic Recommendation Alert (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, 10, 0],
                rotate: [-0.5, 0.5, -0.5]
              }}
              transition={{
                y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 5.8, ease: "easeInOut" },
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 }
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 35px rgba(249, 115, 22, 0.35)",
                borderColor: "rgba(249, 115, 22, 0.4)" 
              }}
              className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 w-[210px] rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 shadow-xl transition-all"
            >
              <span className="text-[10px] font-bold text-brand-2 tracking-wider uppercase flex items-center gap-1 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Recommendation
              </span>
              <div className="space-y-2 text-[10px]">
                <div className="rounded-lg bg-brand-2/10 border border-brand-2/20 p-2 text-slate-200">
                  <span className="font-bold text-brand-2 block">Redundant Editors</span>
                  Cursor Pro + GitHub Copilot detected.
                </div>
                <div className="flex justify-between items-center text-[9px] text-brand-3 font-bold">
                  <span>Action: Cancel Copilot</span>
                  <span>Save $20/mo</span>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Audited Tools Badges Stack (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0],
                rotate: [0.5, -0.5, 0.5]
              }}
              transition={{
                y: { repeat: Infinity, duration: 5.2, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6.2, ease: "easeInOut" },
                opacity: { duration: 0.5, delay: 0.3 },
                scale: { duration: 0.5, delay: 0.3 }
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 35px rgba(234, 179, 8, 0.35)",
                borderColor: "rgba(234, 179, 8, 0.4)" 
              }}
              className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 w-[190px] rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 shadow-xl transition-all"
            >
              <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1 mb-3">
                <Code className="w-3.5 h-3.5 text-brand-1" /> Active Stack
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full bg-brand-1" /> ChatGPT
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full bg-brand-2" /> Claude
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full bg-brand-3" /> Cursor
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full bg-blue-500" /> Copilot
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Award, Users, TrendingUp } from 'lucide-react';

export default function Hero() {
  const [estSpend, setEstSpend] = useState(150);

  // Estimating 35% savings on average
  const estimatedSavings = Math.round(estSpend * 0.35);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-slate-950">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 opacity-40 blur-[80px]" />
      <div className="absolute top-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-pink-500/10 opacity-30 blur-[80px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Version 2.0 Is Here — Optimized for Teams & Enterprises</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Stop Overpaying <br className="hidden sm:inline" />
              for <span className="gradient-text font-extrabold">AI Tools & API Keys</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto lg:mx-0 max-w-xl text-lg text-slate-300"
            >
              Audit your AI tool usage and spend in 30 seconds. Identify seat overlap, plan mismatches, and discover immediate opportunities to save hundreds monthly.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/audit">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="glow-btn flex items-center space-x-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/20"
                >
                  <span>Audit My Spend</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-4 text-base font-semibold text-slate-200 transition-colors"
                >
                  <span>See How It Works</span>
                </motion.button>
              </a>
            </motion.div>

            {/* Social Trust Metrics */}
            <motion.div
              variants={itemVariants}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0"
            >
              <div>
                <p className="text-2xl font-bold text-white">$145k+</p>
                <p className="text-xs text-slate-400">Total savings generated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4,200+</p>
                <p className="text-xs text-slate-400">Audits completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">35.4%</p>
                <p className="text-xs text-slate-400">Avg. subscription reduction</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Mini ROI Interactive Calculator & Floating Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
              className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Top gradient border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold tracking-wide uppercase text-indigo-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> Quick Estimate
                </span>
                <span className="text-xs text-slate-400 border border-slate-700 rounded-full px-2.5 py-0.5 bg-slate-800/50">
                  Instant ROI
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-slate-300">
                    <span>Current Monthly AI Spend:</span>
                    <span className="font-bold text-white text-lg">${estSpend}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={estSpend}
                    onChange={(e) => setEstSpend(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>$20</span>
                    <span>$500</span>
                    <span>$1000+</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Estimated Savings Potential</span>
                  <motion.p
                    key={estimatedSavings}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-extrabold text-indigo-400 tracking-tight"
                  >
                    ${estimatedSavings}
                    <span className="text-sm text-slate-400 font-medium">/month</span>
                  </motion.p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    (${estimatedSavings * 12} saved annually)
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Audits user seat overlaps automatically</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Suggests cheaper open-source options</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Award className="h-3.5 w-3.5 text-emerald-400" />
                    <span>100% anonymous & secure</span>
                  </div>
                </div>

                <Link to="/audit" className="block w-full">
                  <button className="w-full rounded-xl py-3 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all hover:border-slate-600 flex items-center justify-center space-x-1">
                    <span>Start Detailed Audit</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

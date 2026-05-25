import { motion } from 'framer-motion';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import Form from '../components/Form';

export default function Audit() {
  return (
    <div className="bg-slate-950 min-h-screen pt-12 pb-24 relative">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-600/10 opacity-30 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 opacity-30 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Audit Engine</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Spend Optimizer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Select your software stack below. We'll identify plan redundancies and misconfigurations instantly.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Form />
        </motion.div>

        {/* Security & Info Footer Card */}
        <div className="mx-auto max-w-2xl mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/10 p-5 text-left">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                Privacy & Data Security Guaranteed
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                SpendWise AI does not sell or share your billing data. Calculations are executed client-side, and results are only stored in the cloud if you choose to share your dashboard URL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

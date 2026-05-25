import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-pink-600/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="space-y-8 max-w-md"
      >
        {/* 404 Heading */}
        <div className="space-y-2">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            className="text-[8rem] font-black leading-none gradient-text"
          >
            404
          </motion.h1>
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Audit prompt */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 text-left space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">While You're Here</span>
          </div>
          <p className="text-sm text-slate-300">
            Did you know most teams overpay for AI tools by <strong className="text-white">35%+</strong>? Run a free audit in 30 seconds.
          </p>
          <Link to="/audit">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Audit My AI Spend</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

        {/* Back home link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}

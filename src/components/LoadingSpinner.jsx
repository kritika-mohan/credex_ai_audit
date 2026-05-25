import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 space-y-6">
      {/* Animated Logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative h-16 w-16"
      >
        <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-md" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg shadow-xl shadow-indigo-500/30">
          <Wallet className="h-8 w-8 text-white" />
        </div>
      </motion.div>

      {/* Pulsing dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-indigo-500"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}

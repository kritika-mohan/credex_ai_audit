import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResultCard({ rec }) {
  const { tool, currentSpend, recommendedAction, savings, reason } = rec;

  // Extract savings number for highlighting. E.g. "$120" -> 120 or "₹10000" -> 10000 (roughly >$500 is >40,000 INR)
  const isHighSavings = () => {
    if (!savings) return false;
    const num = parseInt(savings.replace(/[^0-9]/g, '')) || 0;
    if (savings.includes('₹')) {
      return num >= 40000; // ~500 USD in INR
    }
    return num >= 150; // High savings threshold
  };

  const highSavingsFlag = isHighSavings();

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden border ${
        highSavingsFlag 
          ? 'border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 to-slate-900/40 shadow-lg shadow-indigo-500/5' 
          : 'border-slate-800 bg-slate-900/20'
      }`}
    >
      {/* High Savings Banner */}
      {highSavingsFlag && (
        <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1 shadow-md">
          <Sparkles className="h-3 w-3" />
          <span>High Impact</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Header: Tool and Savings */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full gradient-bg" />
              {tool}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Spend: <span className="font-semibold text-slate-200">{currentSpend}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Monthly Savings</span>
            <span className="text-2xl font-extrabold text-indigo-400 tracking-tight">
              {savings}
            </span>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4 flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 flex-shrink-0">
            <TrendingDown className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
              Recommended Action
            </span>
            <p className="text-sm font-semibold text-white flex items-center gap-1">
              {recommendedAction}
            </p>
          </div>
        </div>

        {/* Explanation Reason */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Why we recommend this
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Micro status indicator */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-[10px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Safe to optimize
          </span>
          <span>Zero workflow disruption</span>
        </div>
      </div>
    </motion.div>
  );
}

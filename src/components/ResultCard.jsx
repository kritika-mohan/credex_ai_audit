import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import formatCurrency from '../utils/formatCurrency';

export default function ResultCard({ rec }) {
  const { currency } = useCurrency();
  const { tool, recommendedAction, savingsRaw, currentSpendRaw, reason } = rec;

  // Extract savings number for highlighting.
  const isHighSavings = () => {
    return savingsRaw >= 150; // High savings threshold (USD)
  };

  const highSavingsFlag = isHighSavings();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl ${
        highSavingsFlag 
          ? 'bg-gradient-to-b from-indigo-500/10 to-white/5 border border-indigo-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
          : 'bg-white/5 border border-white/10'
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
              Current Spend: <span className="font-semibold text-slate-200">{formatCurrency(currentSpendRaw || 0, currency)}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Monthly Savings</span>
            <span className="text-2xl font-extrabold text-indigo-400 tracking-tight">
              {formatCurrency(savingsRaw || 0, currency)}
            </span>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="rounded-xl bg-slate-950/60 border border-white/5 p-4 flex items-start space-x-3 shadow-inner">
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

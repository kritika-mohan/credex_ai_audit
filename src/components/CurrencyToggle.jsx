import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative flex items-center rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 p-1 shadow-inner">
      {/* Background slider animation */}
      <motion.div
        className="absolute top-1 bottom-1 w-[60px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md"
        initial={false}
        animate={{
          left: currency === 'USD' ? 4 : 64,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      
      <button
        onClick={() => setCurrency('USD')}
        className={`relative z-10 flex w-[60px] items-center justify-center py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
          currency === 'USD' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        $ USD
      </button>
      
      <button
        onClick={() => setCurrency('INR')}
        className={`relative z-10 flex w-[60px] items-center justify-center py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
          currency === 'INR' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        ₹ INR
      </button>
    </div>
  );
}

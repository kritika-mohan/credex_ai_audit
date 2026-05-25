import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Share2, Wallet, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { fetchAuditFromDb } from '../utils/supabaseClient';
import ResultCard from '../components/ResultCard';

export default function Share() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState(null);
  
  const hash = searchParams.get('hash');

  useEffect(() => {
    async function loadSharedAudit() {
      setIsLoading(true);
      // Fetch details using ID or hash
      const res = await fetchAuditFromDb(id === 'shared' ? null : id, hash);
      if (res.success) {
        setAuditData(res.data);
      } else {
        console.error("Failed to load public audit");
      }
      setIsLoading(false);
    }
    loadSharedAudit();
  }, [id, hash]);

  if (isLoading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-400">Loading shared audit...</p>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center space-y-4 px-4">
        <h2 className="text-xl font-bold">Shared Audit Not Found</h2>
        <p className="text-sm text-slate-400 text-center">
          The link you followed may have expired or is incorrect.
        </p>
        <Link to="/">
          <button className="rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  const { input_tools, audit_results, team_size, use_case, currency, company_name } = auditData;
  const recommendations = audit_results?.recommendations || [];
  const monthlySavings = audit_results?.totalMonthlySavings || 0;
  const annualSavings = audit_results?.totalAnnualSavings || 0;

  const totalCurrentSpend = input_tools.reduce((sum, t) => sum + Number(t.monthlySpend || 0), 0);
  const totalOptimizedSpend = Math.max(0, totalCurrentSpend - monthlySavings);
  
  const efficiencyScore = totalCurrentSpend > 0 
    ? Math.round((monthlySavings / totalCurrentSpend) * 100) 
    : 0;

  return (
    <div className="bg-slate-950 min-h-screen pb-24 text-slate-100 relative">
      {/* Decorative gradient element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-96 w-full max-w-7xl bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent rounded-full blur-[100px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Branding header for public viewers */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-900 pb-5">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              SpendWise<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <span className="flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Privacy Verified
          </span>
        </div>

        {/* Audit Results Main Showcase Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 bg-slate-900/10 border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full" />
          
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Public Audit Report</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              AI Stack Optimized {company_name && `for ${company_name}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Stack analysis based on {input_tools.length} services for a team of {team_size || '1+'} using AI for {use_case || 'general workflows'}.
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-slate-800/80 py-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Monthly Savings</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-1">{currency}{monthlySavings}</p>
            </div>
            <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-800/80 py-4 sm:py-0">
              <span className="text-xs text-slate-500 uppercase font-semibold">Annual Savings</span>
              <p className="text-3xl font-extrabold text-pink-400 mt-1">{currency}{annualSavings}</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Optimizer Ratio</span>
              <p className="text-3xl font-extrabold text-white mt-1">{efficiencyScore}%</p>
            </div>
          </div>

          {/* Spend Breakdown Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-950/60 p-4 border border-slate-850">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Current monthly budget: <strong className="text-slate-200">{currency}{totalCurrentSpend}</strong></span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Optimized total bill: {currency}{totalOptimizedSpend}/mo
            </div>
          </div>

          {/* Recommendations list */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white">Savings recommendations details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <ResultCard key={idx} rec={rec} />
              ))}
            </div>
          </div>
        </div>

        {/* Viral Conversion Box */}
        <div className="mt-10 glass-panel rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/20 via-slate-900/30 to-purple-950/20 border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="h-5 w-5 text-indigo-400" /> Stop Overpaying for AI Tools
            </h4>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Create your own secure, anonymous AI Spend Audit in under 30 seconds. Uncover duplicate seats and billing inefficiencies immediately.
            </p>
          </div>
          <Link to="/">
            <button className="glow-btn inline-flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <span>Audit My Spend</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

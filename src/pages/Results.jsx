import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Calendar, Share2, Copy, Check, TrendingDown, 
  HelpCircle, Mail, Phone, ChevronRight, AlertTriangle, ArrowLeft
} from 'lucide-react';
import { fetchAuditFromDb } from '../utils/supabaseClient';
import { generateMockAiSummary } from '../utils/auditEngine';
import ResultCard from '../components/ResultCard';

export default function Results() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const auditId = searchParams.get('id') || searchParams.get('local_id');
  const hash = searchParams.get('hash');

  useEffect(() => {
    async function loadAudit() {
      setIsLoading(true);
      const res = await fetchAuditFromDb(auditId, hash);
      if (res.success) {
        setAuditData(res.data);
        
        // Trigger confetti on successful load of positive savings
        const savings = res.data.audit_results?.totalMonthlySavings || 0;
        if (savings > 0) {
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#6366f1', '#a855f7', '#ec4899']
            });
          }, 400);
        }

        // Simulate AI Summary Generation Effect
        setTimeout(() => {
          const summary = generateMockAiSummary(
            res.data.audit_results,
            res.data.team_size || 1,
            res.data.use_case || 'mixed'
          );
          setAiSummary(summary);
          setAiLoading(false);
        }, 2200);

      } else {
        console.error("Failed to load audit data");
      }
      setIsLoading(false);
    }
    loadAudit();
  }, [auditId, hash]);

  // Copy shareable link helper
  const handleCopyLink = () => {
    const origin = window.location.origin;
    let shareUrl = '';
    
    if (hash) {
      shareUrl = `${origin}/result/shared?hash=${hash}`;
    } else if (auditId) {
      shareUrl = `${origin}/result/${auditId}`;
    } else {
      shareUrl = window.location.href;
    }

    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock consultation booking
  const handleBookConsultation = (e) => {
    e.preventDefault();
    if (!bookingDate) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setBookingSuccess(false);
      setBookingDate('');
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-400">Loading audit results...</p>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center space-y-4 px-4">
        <AlertTriangle className="h-12 w-12 text-amber-400" />
        <h2 className="text-xl font-bold">Audit Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm text-center">
          We couldn't fetch the requested AI audit results. Check the link or create a new audit.
        </p>
        <Link to="/audit">
          <button className="rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold">
            Create New Audit
          </button>
        </Link>
      </div>
    );
  }

  const { input_tools, audit_results, team_size, use_case, currency, company_name } = auditData;
  const recommendations = audit_results?.recommendations || [];
  const monthlySavings = audit_results?.totalMonthlySavings || 0;
  const annualSavings = audit_results?.totalAnnualSavings || 0;

  // Calculate Spend Metrics
  const totalCurrentSpend = input_tools.reduce((sum, t) => sum + Number(t.monthlySpend || 0), 0);
  const totalOptimizedSpend = Math.max(0, totalCurrentSpend - monthlySavings);

  // Optimizer Efficiency Score
  const efficiencyScore = totalCurrentSpend > 0 
    ? Math.round((monthlySavings / totalCurrentSpend) * 100) 
    : 0;

  return (
    <div className="bg-slate-950 min-h-screen pb-24 text-slate-100 relative">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/5 opacity-40 blur-[100px]" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
          <div>
            <Link to="/audit" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to Edit
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Audit Dashboard {company_name && <span className="text-indigo-400 font-medium">for {company_name}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Stack efficiency breakdown based on {input_tools.length} active AI subscriptions.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-slate-900"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Results</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOP SECTION: Savings Metrics & Circular Efficiency Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Savings Summary Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Monthly Savings */}
            <div className="glass-panel rounded-2xl p-6 bg-slate-900/10 border border-slate-800 relative overflow-hidden flex flex-col justify-between h-48">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Monthly Savings Potential</span>
                <h3 className="text-5xl font-black text-white mt-3 tracking-tight">
                  {currency}{monthlySavings}
                </h3>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                Immediate reduction of <span className="text-white font-semibold">~{efficiencyScore}%</span> in operational billing.
              </p>
            </div>

            {/* Annual Savings */}
            <div className="glass-panel rounded-2xl p-6 bg-slate-900/10 border border-slate-800 relative overflow-hidden flex flex-col justify-between h-48">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Projected Annual Savings</span>
                <h3 className="text-5xl font-black text-white mt-3 tracking-tight">
                  {currency}{annualSavings}
                </h3>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                Estimated capital reallocated for R&D/Productivity.
              </p>
            </div>

          </div>

          {/* Efficiency Gauge Card */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-6 bg-slate-900/10 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Optimizer Efficiency Score</span>
            
            {/* SVG Circular Gauge */}
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="#1e293b" strokeWidth="8" fill="transparent" 
                />
                {/* Progress Ring */}
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  stroke="url(#gradient)" strokeWidth="8" fill="transparent" 
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * efficiencyScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{efficiencyScore}%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Savings Ratio</span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <span className="text-xs text-slate-300 font-semibold">
                Current Stack Spend: {currency}{totalCurrentSpend}/mo
              </span>
              <p className="text-[10px] text-slate-500">
                Optimized Stack: {currency}{totalOptimizedSpend}/mo
              </p>
            </div>
          </div>

        </div>

        {/* AI GENERATED SUMMARY PANEL */}
        <div className="glass-panel rounded-2xl p-6 bg-gradient-to-r from-indigo-950/20 via-slate-900/30 to-purple-950/20 border border-indigo-500/20 mb-8 relative overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center space-x-1 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-full text-[10px] text-indigo-400 font-bold">
            <Sparkles className="h-3 w-3" />
            <span>AI Executive Summary</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Custom Spend Strategy</h3>
            
            <AnimatePresence mode="wait">
              {aiLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col space-y-2 py-2"
                >
                  <div className="h-3.5 w-3/4 rounded bg-slate-800 animate-pulse" />
                  <div className="h-3.5 w-5/6 rounded bg-slate-800 animate-pulse" />
                  <div className="h-3.5 w-2/3 rounded bg-slate-800 animate-pulse" />
                </motion.div>
              ) : (
                <motion.p
                  key="summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-slate-200 leading-relaxed font-medium"
                >
                  {aiSummary}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* PER TOOL BREAKDOWN */}
        <div className="space-y-6 mb-12">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Stack Optimization Recommendations</span>
            <span className="text-xs text-slate-500 font-normal">({recommendations.length} items flagged)</span>
          </h3>

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-10 text-center space-y-3">
              <Check className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Your stack is fully optimized!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                We did not detect any duplicate subscriptions, seat underutilizations, or API plan overspends.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, idx) => (
                <ResultCard key={idx} rec={rec} />
              ))}
            </div>
          )}
        </div>

        {/* CTA ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Consultation booking card */}
          <div className="glass-panel rounded-2xl p-6 bg-slate-900/10 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">Book a Credex Optimization Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with our senior consultants to automate your SaaS subscription management, negotiate custom API enterprise pricing, and set up local model caching.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Calendar className="h-4.5 w-4.5 text-indigo-400" />
              <span>Schedule Free Strategy Call</span>
            </button>
          </div>

          {/* Email Capture Confirmation */}
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-b from-slate-900/10 to-slate-900/30 border border-slate-850 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">Interactive Savings Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We have prepared a comprehensive 4-page PDF analysis report outlining cash-flow trends, pricing alerts, and consolidation details.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center space-x-3 text-emerald-400">
              <Check className="h-5 w-5 flex-shrink-0" />
              <div className="text-xs text-left">
                <span className="font-semibold block text-emerald-300">PDF Report Dispatched</span>
                <span className="text-slate-400">Check inbox for {auditData.email || 'your email'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CONSULTATION BOOKING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span>Confirm Strategy Session</span>
              </h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                &times;
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h5 className="text-sm font-bold text-white">Meeting Scheduled!</h5>
                <p className="text-xs text-slate-400">Check your inbox for calendar invites and details.</p>
              </div>
            ) : (
              <form onSubmit={handleBookConsultation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Select Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-slate-500 leading-normal">
                  Our team will run a deep-dive crawl on your SaaS profile ahead of the 15-minute sync. Zero cost, 100% confidential.
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 text-sm transition-colors"
                >
                  Confirm Slot
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}

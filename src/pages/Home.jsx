import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Sparkles, TrendingDown, Layers, Lightbulb, 
  HelpCircle, ChevronDown, Check, Zap, Star, MessageSquare 
} from 'lucide-react';
import AnimatedHero from '../components/AnimatedHero';
import { useCurrency } from '../context/CurrencyContext';
import formatCurrency from '../utils/formatCurrency';

const FEATURES = [
  {
    icon: ShieldAlert,
    title: "Find Hidden Costs",
    description: "Identify users billing on team seats without reaching minimum quotas. Uncover zombie subscriptions and automatic renewals."
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Get context-aware action steps (e.g., cancelling Copilot if you use Cursor, or consolidating Claude and ChatGPT Plus accounts)."
  },
  {
    icon: TrendingDown,
    title: "Instant Savings Insights",
    description: "Calculate immediate monthly and 12-month savings. Implement prompt caching strategies that drop API bills by up to 50%."
  }
];

const getAuditRules = (currency) => [
  {
    rule: "Seat Count Match",
    scenario: "ChatGPT or Claude Team plans with under 3 active members.",
    action: "Downgrade seats to individual Plus/Pro plans.",
    savings: `Up to ${formatCurrency(10, currency)}/user per month + removes minimum user penalties.`
  },
  {
    rule: "Editor Redundancy",
    scenario: "Paid Cursor subscription running alongside GitHub Copilot.",
    action: "Deprecate Copilot; Cursor has built-in completions.",
    savings: `Save ${formatCurrency(10, currency)} - ${formatCurrency(20, currency)} per seat monthly.`
  },
  {
    rule: "API Optimization",
    scenario: "High API usage of Claude Sonnet or GPT-4o.",
    action: "Configure prompt caching & route standard tasks to cheaper models.",
    savings: "Typical reduction of 30% - 60% on total token costs."
  }
];

const getFaqs = (currency) => [
  {
    q: "How does the SpendWise AI audit work?",
    a: "We analyze your active AI tool configurations, seat distributions, and API expenditures. Using our optimization engine, we cross-reference this against plan rules, redundancy rules, and API billing options to generate a customized savings map."
  },
  {
    q: "Is my spend and team data kept secure?",
    a: "Absolutely. All audit processing happens directly in your browser. If you choose to save and share your report, it is persisted securely (and anonymous-by-design) via Supabase, or encrypted directly within the URL hash without being stored on our servers."
  },
  {
    q: "What kind of teams benefit most from SpendWise AI?",
    a: `Teams between 2 and 150 members experience the highest rate of 'subscription creep'—paying for multiple redundant tools per developer or marketer. We regularly find savings of ${formatCurrency(200, currency)}–${formatCurrency(1200, currency)}/month for these cohorts.`
  },
  {
    q: "Can I customize the recommendation rules?",
    a: "Our core engine is built on standard business rules. If you schedule a custom consultation, we can run specialized audits for enterprise agreements, custom API usage, and self-hosted model migrations."
  }
];

export default function Home() {
  const { currency } = useCurrency();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <AnimatedHero />

      {/* Feature Grid Section */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-950 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Audit and Optimize in 3 Steps
            </h2>
            <p className="text-slate-400 text-base">
              No spreadsheets, no manual calculation. Just instant cost reduction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col items-center text-center space-y-4"
                >
                  <div className="p-4 rounded-xl gradient-bg text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audit Engine Rules Explainer Section */}
      <section id="engine" className="py-20 border-t border-slate-900 bg-slate-900/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Engine Intro */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center lg:justify-start gap-1">
                <Zap className="h-3.5 w-3.5" /> Engine Rules
              </span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Transparent optimization logic.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                SpendWise AI evaluates your inputs using dynamic heuristics built from actual IT auditing guidelines. We prioritize license efficiency and API caching so you maintain tool quality without the markup.
              </p>
              <div className="pt-4 hidden lg:block">
                <Link to="/audit">
                  <button className="rounded-full bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors">
                    Start Full Audit
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Heuristic Cards */}
            <div className="lg:col-span-7 space-y-4">
              {getAuditRules(currency).map((rule, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 rounded-full px-2.5 py-0.5 border border-indigo-500/20">
                      Rule {idx + 1}: {rule.rule}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Average Savings: {rule.savings.split(' ')[1] || '30%'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mt-1">If {rule.scenario}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      👉 <span className="text-slate-300 font-semibold">{rule.action}</span> ({rule.savings})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Loved by Founders & Builders</h2>
            <p className="text-slate-400 text-sm">See how teams are optimizing their workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic">
                &ldquo;We were paying for both Copilot and Cursor licenses for 14 devs. SpendWise AI immediately caught it, saving us over {formatCurrency(200, currency)} a month with a single recommendation.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-sm">
                  AR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aniket Roy</h4>
                  <p className="text-xs text-slate-500">CTO, DevScale</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic">
                &ldquo;I set up a 2-seat ChatGPT Team plan last year. SpendWise flagged that downgrading to Plus was safe for our small workflow. Instant downgrade saved us {formatCurrency(120, currency)}/year.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">
                  KM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kunal Mehta</h4>
                  <p className="text-xs text-slate-500">Founder, ContentHQ</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic">
                &ldquo;Our token bills on GPT-4o were skyrocketing. SpendWise's advice on Prompt Caching saved us 40% on API costs in the first 2 weeks. Incredible tool!&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/60">
                <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center font-bold text-pink-400 text-sm">
                  SD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sarah Davis</h4>
                  <p className="text-xs text-slate-500">VP Eng, FinFlow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about our audit engine.</p>
          </div>

          <div className="space-y-4">
            {getFaqs(currency).map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-slate-200 hover:text-white font-medium focus:outline-none transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-900/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Call To Action */}
      <section className="py-20 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to reclaim your <br />
            AI budget?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
            Join thousands of smart businesses auditing their stack. It takes 30 seconds and is 100% free.
          </p>
          <div className="pt-2">
            <Link to="/audit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glow-btn inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/20"
              >
                <Sparkles className="h-5 w-5" />
                <span>Audit My Spend Now</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300 text-base">SpendWise<span className="text-indigo-400 font-extrabold">AI</span></span>
          </div>
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} SpendWise AI. Powered by Credex Consultation. All rights reserved.
          </p>
          <div className="flex space-x-6 text-slate-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

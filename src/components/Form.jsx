import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Trash2, HelpCircle, 
  Mail, Building, Briefcase, DollarSign, Users, Cpu, FileCode, Search, Edit3
} from 'lucide-react';
import { saveAudit, saveLead } from '../utils/supabaseClient';
import { runSpendAudit } from '../utils/auditEngine';

// Tool metadata helper
const AVAILABLE_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', icon: Sparkles, plans: ['Plus', 'Team', 'Enterprise', 'API'], defaultPlan: 'Plus', defaultCost: 20 },
  { id: 'claude', name: 'Claude', icon: Cpu, plans: ['Free', 'Pro', 'Team', 'API'], defaultPlan: 'Pro', defaultCost: 20 },
  { id: 'cursor', name: 'Cursor', icon: FileCode, plans: ['Pro', 'Business'], defaultPlan: 'Pro', defaultCost: 20 },
  { id: 'copilot', name: 'GitHub Copilot', icon: FileCode, plans: ['Individual', 'Business', 'Enterprise'], defaultPlan: 'Individual', defaultCost: 10 },
  { id: 'gemini', name: 'Gemini', icon: Sparkles, plans: ['Advanced', 'Business', 'Enterprise'], defaultPlan: 'Advanced', defaultCost: 20 },
  { id: 'openai_api', name: 'OpenAI API', icon: Cpu, plans: ['API Usage-based'], defaultPlan: 'API Usage-based', defaultCost: 50 }
];

export default function Form() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [selectedTools, setSelectedTools] = useState([]); // list of tool IDs
  const [toolConfigs, setToolConfigs] = useState({}); // { chatgpt: { plan: 'Plus', monthlySpend: 20, users: 1, currency: '$' } }
  const [companyDetails, setCompanyDetails] = useState({
    teamSize: '',
    useCase: 'mixed',
    email: '',
    companyName: '',
    role: '',
    honeypot: '' // Spam protection
  });
  
  // Validation / Error State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('spendwise_form_state');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedTools) setSelectedTools(parsed.selectedTools);
        if (parsed.toolConfigs) setToolConfigs(parsed.toolConfigs);
        if (parsed.companyDetails) setCompanyDetails(parsed.companyDetails);
      }
    } catch (e) {
      console.error('Failed to load localStorage data:', e);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('spendwise_form_state', JSON.stringify({
      selectedTools,
      toolConfigs,
      companyDetails
    }));
  }, [selectedTools, toolConfigs, companyDetails]);

  // Handle Tool Select / Unselect
  const handleToggleTool = (toolId) => {
    const isSelected = selectedTools.includes(toolId);
    let updatedTools;
    
    if (isSelected) {
      updatedTools = selectedTools.filter(id => id !== toolId);
      const updatedConfigs = { ...toolConfigs };
      delete updatedConfigs[toolId];
      setToolConfigs(updatedConfigs);
    } else {
      updatedTools = [...selectedTools, toolId];
      const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
      
      setToolConfigs({
        ...toolConfigs,
        [toolId]: {
          plan: toolDef.defaultPlan,
          monthlySpend: toolDef.defaultCost,
          users: 1,
          currency: '$'
        }
      });
    }
    
    setSelectedTools(updatedTools);
    if (errors.selectedTools) {
      const newErrors = { ...errors };
      delete newErrors.selectedTools;
      setErrors(newErrors);
    }
  };

  // Handle individual tool configuration changes
  const handleConfigChange = (toolId, field, value) => {
    const currentConfig = toolConfigs[toolId] || {};
    
    // Automatically recalculate estimate if plan or users changes
    let extraChanges = {};
    if (field === 'plan') {
      const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
      if (toolDef) {
        let baseCost = 20;
        if (toolId === 'chatgpt') {
          if (value === 'Team') baseCost = 30;
          else if (value === 'Enterprise') baseCost = 60;
          else if (value === 'API') baseCost = 50;
        } else if (toolId === 'claude') {
          if (value === 'Free') baseCost = 0;
          else if (value === 'Team') baseCost = 30;
          else if (value === 'API') baseCost = 50;
        } else if (toolId === 'cursor') {
          if (value === 'Business') baseCost = 40;
        } else if (toolId === 'copilot') {
          if (value === 'Business') baseCost = 19;
          else if (value === 'Enterprise') baseCost = 39;
        } else if (toolId === 'gemini') {
          if (value === 'Business') baseCost = 30;
          else if (value === 'Enterprise') baseCost = 40;
        }
        
        const users = currentConfig.users || 1;
        extraChanges.monthlySpend = value.includes('API') || value.includes('Usage') 
          ? (currentConfig.monthlySpend || 50) 
          : baseCost * users;
      }
    } else if (field === 'users') {
      const usersNum = parseInt(value) || 1;
      const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
      if (toolDef && !currentConfig.plan.includes('API') && !currentConfig.plan.includes('Usage')) {
        let baseCost = 20;
        const currentPlan = currentConfig.plan;
        if (toolId === 'chatgpt') {
          if (currentPlan === 'Team') baseCost = 30;
          else if (currentPlan === 'Enterprise') baseCost = 60;
        } else if (toolId === 'claude') {
          if (currentPlan === 'Free') baseCost = 0;
          else if (currentPlan === 'Team') baseCost = 30;
        } else if (toolId === 'cursor') {
          if (currentPlan === 'Business') baseCost = 40;
        } else if (toolId === 'copilot') {
          if (currentPlan === 'Business') baseCost = 19;
          else if (currentPlan === 'Enterprise') baseCost = 39;
        } else if (toolId === 'gemini') {
          if (currentPlan === 'Business') baseCost = 30;
          else if (currentPlan === 'Enterprise') baseCost = 40;
        }
        extraChanges.monthlySpend = baseCost * usersNum;
      }
    }

    setToolConfigs({
      ...toolConfigs,
      [toolId]: {
        ...currentConfig,
        [field]: value,
        ...extraChanges
      }
    });
  };

  // Step 1 Validator
  const handleNextStep1 = () => {
    if (selectedTools.length === 0) {
      setErrors({ selectedTools: 'Please select at least one AI tool to audit' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // Step 2 Validator
  const handleNextStep2 = () => {
    const configErrors = {};
    selectedTools.forEach(toolId => {
      const conf = toolConfigs[toolId];
      if (!conf || !conf.monthlySpend || conf.monthlySpend < 0) {
        configErrors[toolId] = 'Please enter a valid monthly spend';
      }
    });

    if (Object.keys(configErrors).length > 0) {
      setErrors(configErrors);
      return;
    }
    setErrors({});
    setStep(3);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check spam honeypot
    if (companyDetails.honeypot) {
      console.warn("Spam submission blocked");
      return;
    }

    // Validate details
    const fieldErrors = {};
    if (!companyDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyDetails.email)) {
      fieldErrors.email = 'Please enter a valid business email address';
    }
    if (!companyDetails.companyName) {
      fieldErrors.companyName = 'Company name is required';
    }
    if (!companyDetails.teamSize || companyDetails.teamSize <= 0) {
      fieldErrors.teamSize = 'Please specify your team size';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Map configuration into structure for the engine
      const mappedTools = selectedTools.map(id => {
        const config = toolConfigs[id];
        const toolDef = AVAILABLE_TOOLS.find(t => t.id === id);
        return {
          id,
          name: toolDef.name,
          plan: config.plan,
          monthlySpend: Number(config.monthlySpend),
          users: Number(config.users || 1),
          currency: config.currency || '$',
          useCase: companyDetails.useCase
        };
      });

      // Select dominant currency
      const primaryCurrency = toolConfigs[selectedTools[0]]?.currency || '$';

      // Run Audit Core Logic
      const auditResults = runSpendAudit(mappedTools, primaryCurrency);

      // Save Audit to Supabase
      const auditData = {
        inputTools: mappedTools,
        auditResults: auditResults,
        teamSize: Number(companyDetails.teamSize),
        useCase: companyDetails.useCase,
        currency: primaryCurrency,
        companyName: companyDetails.companyName
      };

      const saveResponse = await saveAudit(auditData);

      // Save Lead if audit save succeeded
      if (saveResponse.success && saveResponse.id) {
        await saveLead(
          companyDetails.email,
          companyDetails.companyName,
          companyDetails.role,
          saveResponse.id
        );
      }

      // Clear localStorage draft on success
      localStorage.removeItem('spendwise_form_state');

      // Navigate to Results page with IDs/hashes
      if (saveResponse.isLocal) {
        navigate(`/results?local_id=${saveResponse.id}&hash=${saveResponse.hash}`);
      } else {
        navigate(`/results?id=${saveResponse.id}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while generating your audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Wizard Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step >= 1 ? 'gradient-bg text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span className="text-sm font-semibold text-slate-200">Select Tools</span>
          </div>
          <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'gradient-bg' : 'bg-slate-800'}`} />
          <div className="flex items-center space-x-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step >= 2 ? 'gradient-bg text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span className="text-sm font-semibold text-slate-200">Configure Spend</span>
          </div>
          <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'gradient-bg' : 'bg-slate-800'}`} />
          <div className="flex items-center space-x-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step >= 3 ? 'gradient-bg text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span className="text-sm font-semibold text-slate-200">Submit Audit</span>
          </div>
        </div>
      </div>

      {/* Steps Container */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 bg-slate-900/40 relative overflow-hidden border border-slate-800">
        <AnimatePresence mode="wait">
          {/* STEP 1: Tool Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">Select the AI Tools in your Stack</h2>
                <p className="text-sm text-slate-400 mt-1">Choose all platforms your team currently pays for.</p>
              </div>

              {errors.selectedTools && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 text-center">
                  {errors.selectedTools}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AVAILABLE_TOOLS.map(tool => {
                  const isSelected = selectedTools.includes(tool.id);
                  const IconComp = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      onClick={() => handleToggleTool(tool.id)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer rounded-2xl border p-5 flex flex-col items-center justify-center text-center space-y-3 transition-all relative overflow-hidden h-36 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full gradient-bg text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-500/25 text-indigo-400' : 'bg-slate-900 text-slate-400'}`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold text-white">{tool.name}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800/60">
                <button
                  onClick={handleNextStep1}
                  className="rounded-xl bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Configure Spends</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Configure Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Configure Plans & Seat Allocation</h2>
                <p className="text-sm text-slate-400 mt-1">Specify user counts and exact billing numbers for accuracy.</p>
              </div>

              <div className="space-y-6">
                {selectedTools.map(toolId => {
                  const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
                  const config = toolConfigs[toolId] || {};
                  const isApiPlan = config.plan?.includes('API') || config.plan?.includes('Usage');
                  const Icon = toolDef.icon;

                  return (
                    <div 
                      key={toolId} 
                      className="rounded-xl border border-slate-800/80 bg-slate-950/30 p-5 space-y-4 hover:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-slate-900 text-indigo-400">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-white">{toolDef.name}</span>
                        </div>
                        <button
                          onClick={() => handleToggleTool(toolId)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Plan */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Active Plan</label>
                          <select
                            value={config.plan}
                            onChange={(e) => handleConfigChange(toolId, 'plan', e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            {toolDef.plans.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        {/* Users / Seats (Disabled for API plan) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">
                            {isApiPlan ? 'Est. Devs Using' : 'Paid Seats'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={config.users}
                            onChange={(e) => handleConfigChange(toolId, 'users', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Currency Toggle */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Currency</label>
                          <select
                            value={config.currency}
                            onChange={(e) => handleConfigChange(toolId, 'currency', e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="$">USD ($)</option>
                            <option value="₹">INR (₹)</option>
                          </select>
                        </div>

                        {/* Monthly Spend */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Monthly Bill</label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-slate-500 text-sm">{config.currency}</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={config.monthlySpend}
                              onChange={(e) => handleConfigChange(toolId, 'monthlySpend', Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 pl-7 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800/60">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextStep2}
                  className="rounded-xl bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Review Profile</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Company Details & Lead Capture */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Generate Your Savings Report</h2>
                <p className="text-sm text-slate-400 mt-1">Provide context to tailor the audit heuristics to your organization.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot Spam Protection (Hidden Field) */}
                <input
                  type="text"
                  name="honeypot"
                  value={companyDetails.honeypot}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team Size */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span>Total Company/Team Size</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      value={companyDetails.teamSize}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, teamSize: e.target.value })}
                      className={`w-full rounded-lg border bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none ${errors.teamSize ? 'border-red-500/50' : 'border-slate-800'}`}
                    />
                    {errors.teamSize && <p className="text-xs text-red-400">{errors.teamSize}</p>}
                  </div>

                  {/* Primary Usecase */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-slate-500" />
                      <span>Primary AI Use Case</span>
                    </label>
                    <select
                      value={companyDetails.useCase}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, useCase: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="coding">Software Development & Coding</option>
                      <option value="writing">Content Writing & Copy</option>
                      <option value="research">Academic & Market Research</option>
                      <option value="mixed">Mixed/General Workflows</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800/80 pt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Lead Verification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={companyDetails.email}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                        className={`w-full rounded-lg border bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none ${errors.email ? 'border-red-500/50' : 'border-slate-800'}`}
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" /> Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Inc."
                        value={companyDetails.companyName}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                        className={`w-full rounded-lg border bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none ${errors.companyName ? 'border-red-500/50' : 'border-slate-800'}`}
                      />
                      {errors.companyName && <p className="text-xs text-red-400">{errors.companyName}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> Your Title / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CTO, Engineering Lead"
                        value={companyDetails.role}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, role: e.target.value })}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-5 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glow-btn rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl hover:shadow-indigo-500/10 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Analyzing Stack...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5" />
                        <span>Run Spend Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

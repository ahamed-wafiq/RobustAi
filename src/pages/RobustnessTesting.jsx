import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  TrendingDown, 
  Layers, 
  HelpCircle,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ATTACK_SCENARIOS, 
  PERTURBATION_DECAY_CURVE, 
  DOMAIN_SHIFT_BENCHMARKS 
} from '../data/robustnessData';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

export default function RobustnessTesting() {
  const [selectedAttackId, setSelectedAttackId] = useState(ATTACK_SCENARIOS[0].id);
  const activeAttack = ATTACK_SCENARIOS.find(a => a.id === selectedAttackId) || ATTACK_SCENARIOS[0];
  const [isSimulating, setIsSimulating] = useState(false);

  const deltaDrop = activeAttack.originalProbAI - activeAttack.perturbedProbAI;

  const handleSimulateAttack = (attackId) => {
    setSelectedAttackId(attackId);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Adversarial Robustness & Evasion Stress-Lab
              </h1>
              <Badge variant="warning">Stress-Test Bench</Badge>
            </div>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Simulate deliberate evasion vectors including synonym substitution, homoglyph injection, and prompt-level paraphrasing to quantify detector degradation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Synthetic Vulnerability Benchmark</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Attack Vectors Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Select Adversarial Attack Scenario
          </h2>
          <span className="text-xs text-slate-400">
            {ATTACK_SCENARIOS.length} stress-test vectors available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ATTACK_SCENARIOS.map((attack) => {
            const isSelected = selectedAttackId === attack.id;
            return (
              <button
                key={attack.id}
                onClick={() => handleSimulateAttack(attack.id)}
                type="button"
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={
                      attack.threatLevel.includes('Critical') 
                        ? 'ai' 
                        : attack.threatLevel.includes('High') 
                        ? 'warning' 
                        : 'indigo'
                    }
                    size="sm"
                  >
                    {attack.threatLevel} Threat
                  </Badge>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {attack.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {attack.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Attack Comparison Workbench */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Workbench Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 text-base">
                Active Scenario: {activeAttack.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Technique: <span className="font-mono text-slate-700">{activeAttack.technique}</span>
            </p>
          </div>

          {/* Degradation Score Summary Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Confidence Drop</span>
                <span className="font-bold font-mono text-rose-600">
                  -{deltaDrop}% AI Confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Text Comparison */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: Original AI Text */}
          <div className="space-y-3 flex flex-col justify-between p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unmodified Baseline AI Output
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-rose-100 text-rose-800">
                  {activeAttack.originalProbAI}% AI Confidence
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-4 rounded-lg border border-slate-200 min-h-[120px]">
                {activeAttack.originalText}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Easily flagged by perplexity and n-gram classifiers.</span>
            </div>
          </div>

          {/* Right: Perturbed / Evasion Text */}
          <div className="space-y-3 flex flex-col justify-between p-5 rounded-xl bg-blue-50/40 border border-blue-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Adversarially Perturbed Variant
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                  activeAttack.perturbedProbAI < 50
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {activeAttack.perturbedProbAI}% AI Confidence
                </span>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-4 rounded-lg border border-blue-100 min-h-[120px]">
                {activeAttack.perturbedText}
              </div>
            </div>

            <div className="text-[11px] text-blue-700 flex items-center gap-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Detector tricked into classifying text as ambiguous or human.</span>
            </div>
          </div>

        </div>

        {/* Vulnerability Analysis Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800">
                Vulnerability Breakdown & Mechanics:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {activeAttack.vulnerabilityAnalysis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Degradation Curve Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Adversarial Degradation Curve Across Perturbation Intensity
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracking model classification retention as perturbation swap rate escalates from 0% to 50%.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="text-slate-600">Baseline Detector</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-blue-700 font-semibold">Standard Transformer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-emerald-700 font-bold">AI-Guard Ensemble</span>
            </div>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={PERTURBATION_DECAY_CURVE}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="perturbationRate" 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis 
                unit="%" 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <Tooltip 
                formatter={(val, name) => [
                  `${val}% Detection Accuracy`, 
                  name === 'baselineDetector' 
                    ? 'Baseline' 
                    : name === 'transformerDetector' 
                    ? 'Standard Transformer' 
                    : 'AI-Guard Ensemble'
                ]}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '10px', 
                  borderColor: '#e2e8f0', 
                  fontSize: '12px' 
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line 
                type="monotone" 
                dataKey="baselineDetector" 
                name="Baseline Detector" 
                stroke="#94a3b8" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="transformerDetector" 
                name="Standard Transformer" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="aiGuardEnsemble" 
                name="AI-Guard Ensemble (Proposed)" 
                stroke="#059669" 
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-Domain Benchmarks Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Cross-Domain Generalization Benchmarks
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulated In-Distribution vs Out-of-Distribution Data
          </span>
        </div>

        <p className="text-xs text-slate-500">
          How evasion success rates fluctuate across varied literary styles and target demographic domains.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {DOMAIN_SHIFT_BENCHMARKS.map((benchmark, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-slate-100/60 transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {benchmark.domain}
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>F1 Score:</span>
                  <span className="font-mono font-semibold text-slate-800">{benchmark.f1}%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Evasion Rate:</span>
                  <span className="font-mono font-semibold text-rose-600">{benchmark.evasionRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

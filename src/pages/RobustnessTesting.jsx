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
  Compass,
  Sliders,
  Play,
  RotateCcw,
  Eye,
  FileCheck
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
import FuzzyFurButton from '../components/common/FuzzyFurButton';
import FuzzyFurPillButton from '../components/common/FuzzyFurPillButton';

export default function RobustnessTesting() {
  const [selectedAttackId, setSelectedAttackId] = useState(ATTACK_SCENARIOS[0].id);
  const [perturbationIntensity, setPerturbationIntensity] = useState(25); // 10% to 50%
  const [isSimulating, setIsSimulating] = useState(false);
  const [appliedPerturbation, setAppliedPerturbation] = useState(false);

  const activeAttack = ATTACK_SCENARIOS.find(a => a.id === selectedAttackId) || ATTACK_SCENARIOS[0];

  // Dynamic calculated degradation based on intensity slider
  const intensityFactor = perturbationIntensity / 25; // 1.0 at 25%
  const baseDrop = activeAttack.originalProbAI - activeAttack.perturbedProbAI;
  const dynamicDrop = Math.min(activeAttack.originalProbAI - 5, Math.round(baseDrop * intensityFactor));
  const dynamicPerturbedProb = Math.max(5, activeAttack.originalProbAI - dynamicDrop);

  const handleSelectAttack = (attackId) => {
    setSelectedAttackId(attackId);
    setAppliedPerturbation(false);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 300);
  };

  const handleApplyAttack = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setAppliedPerturbation(true);
      setIsSimulating(false);
    }, 350);
  };

  const handleReset = () => {
    setAppliedPerturbation(false);
  };

  // Helper to highlight differences between original and perturbed text
  const renderHighlightedDiff = () => {
    const origWords = (activeAttack.originalText || '').split(/\s+/);
    const pertWords = (activeAttack.perturbedText || '').split(/\s+/);

    return (
      <div className="text-xs text-[#30312D] leading-relaxed font-sans bg-[#FFFDF8] p-5 rounded-3xl border-2 border-dashed border-[#9BAE83]/50 min-h-[140px] space-y-2 shadow-inner">
        <p>
          {pertWords.map((word, i) => {
            const isDifferent = !origWords.includes(word);
            if (isDifferent) {
              return (
                <span
                  key={i}
                  className="bg-[#E58B36]/30 text-[#6B2E05] px-2 py-0.5 rounded-md font-black mx-0.5 border border-dashed border-[#E58B36] inline-block shadow-2xs"
                  title="Perturbed token substitution"
                >
                  {word}
                </span>
              );
            }
            return <span key={i}> {word} </span>;
          })}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="knitted-card p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF8] via-[#FFFCF5] to-[#F5EEDB] border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#435744] bg-[#9BAE83]/30 px-3.5 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
                ADVERSARIAL STRESS-LAB
              </span>
              <Badge variant="warning">Evasion Benchmarking</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#30312D] tracking-tight">
              Adversarial Robustness & <span className="text-[#E58B36] underline decoration-wavy decoration-[#E58B36]">Evasion Lab</span>
            </h1>
            <p className="text-sm sm:text-base text-[#30312D]/85 leading-relaxed font-medium">
              Quantify detector failure boundaries by simulating synonym substitutions, homoglyph injection, prompt injection, and whitespace manipulation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black bg-[#FFFDF8] border-2 border-dashed border-[#E7B44F] text-[#543A05] px-4 py-2 rounded-2xl shadow-xs">
            <AlertTriangle className="w-4 h-4 text-[#B58422] shrink-0" />
            <span>Synthetic Evasion Benchmark</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Attack Scenario Selector Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#435744]">
            Select Adversarial Attack Scenario:
          </h2>
          <span className="text-xs text-[#30312D]/70 font-bold">
            {ATTACK_SCENARIOS.length} stress-test vectors available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {ATTACK_SCENARIOS.map((attack) => {
            const isSelected = selectedAttackId === attack.id;
            const furColor = attack.threatLevel.includes('Critical')
              ? 'red'
              : attack.threatLevel.includes('High')
              ? 'mustard'
              : 'green';

            return (
              <button
                key={attack.id}
                onClick={() => handleSelectAttack(attack.id)}
                type="button"
                className={`p-4 rounded-3xl border-3 text-left transition-all ${
                  isSelected
                    ? 'plush-forest shadow-md scale-102 border-dashed border-[#9BAE83] text-[#FFFDF9]'
                    : 'bg-[#FFFDF8] border-dashed border-[#435744]/25 hover:border-[#9BAE83] hover:bg-[#FFFCF5] text-[#30312D] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <FuzzyFurButton
                    size="xs"
                    color={furColor}
                    icon={ShieldAlert}
                    className="pointer-events-none"
                  />
                  <Badge 
                    variant={
                      attack.threatLevel.includes('Critical') 
                        ? 'orange' 
                        : attack.threatLevel.includes('High') 
                        ? 'warning' 
                        : 'sage'
                    }
                    size="sm"
                  >
                    {attack.threatLevel}
                  </Badge>
                </div>

                <h3 className="font-black text-sm">
                  {attack.name}
                </h3>
                <p className={`text-[11px] mt-1 line-clamp-2 leading-tight ${isSelected ? 'text-[#FFFDF9]/80' : 'text-[#30312D]/70'}`}>
                  {attack.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Workbench: Before and After Diff */}
      <div className="knitted-card p-6 sm:p-8 space-y-6 border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        
        {/* Workbench Header & Dynamic Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#435744]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="plush-circle-btn plush-orange w-10 h-10 shrink-0 shadow-sm">
                <Flame className="w-5 h-5 embroidered-icon" />
              </div>
              <h3 className="font-black text-[#30312D] text-base">
                Active Scenario: {activeAttack.name}
              </h3>
            </div>
            <p className="text-xs text-[#30312D]/75 font-semibold">
              Technique: <span className="font-mono text-[#435744] font-bold">{activeAttack.technique}</span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 flex items-center gap-2.5 shadow-2xs">
              <TrendingDown className="w-4 h-4 text-[#E58B36]" />
              <div className="text-xs">
                <span className="text-[#30312D]/60 block text-[10px] font-black uppercase tracking-wider">Confidence Drop</span>
                <span className="font-black font-mono text-[#9E4D09] text-sm">
                  -{dynamicDrop}% AI Likelihood
                </span>
              </div>
            </div>

            <div className="p-3 px-4 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 flex items-center gap-2.5 shadow-2xs">
              <Sliders className="w-4 h-4 text-[#435744]" />
              <div className="text-xs">
                <span className="text-[#30312D]/60 block text-[10px] font-black uppercase tracking-wider">Perturbation Intensity</span>
                <span className="font-black font-mono text-[#435744] text-sm">
                  {perturbationIntensity}% Token Swaps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Adjustable Perturbation Intensity Slider in Quilted Inset */}
        <div className="p-5 rounded-3xl quilted-inset space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-black text-[#30312D]">
            <span className="flex items-center gap-2 text-[#435744]">
              <Sliders className="w-4 h-4 text-[#9BAE83]" />
              Adjust Perturbation Intensity (Adversarial Budget):
            </span>
            <span className="font-mono text-sm font-black text-[#435744] bg-[#FFFDF8] px-3 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
              {perturbationIntensity}% Swaps
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={perturbationIntensity}
            onChange={(e) => setPerturbationIntensity(Number(e.target.value))}
            className="w-full accent-[#435744] cursor-pointer h-2 bg-[#DED6C7] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#30312D]/70 font-bold">
            <span>10% (Subtle Synonym replacement)</span>
            <span>25% (Standard Evasion)</span>
            <span>50% (Heavy Syntactic disruption)</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Workbench Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Panel: Unperturbed Baseline AI Output */}
          <div className="p-5 rounded-3xl quilted-inset flex flex-col justify-between space-y-3 shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#30312D]/70">
                  Original AI Text (Unperturbed)
                </span>
                <Badge variant="orange" size="sm">
                  {activeAttack.originalProbAI}% AI Confidence
                </Badge>
              </div>

              <div className="text-xs text-[#30312D] leading-relaxed font-sans bg-[#FFFDF8] p-5 rounded-3xl border-2 border-dashed border-[#435744]/20 min-h-[140px] shadow-inner">
                {activeAttack.originalText}
              </div>
            </div>

            <div className="text-[11px] text-[#30312D]/80 flex items-center gap-2 pt-1 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E58B36]"></span>
              <span>Easily flagged by n-gram frequency and perplexity baselines.</span>
            </div>
          </div>

          {/* Right Panel: Adversarially Perturbed Variant with Highlights */}
          <div className="p-5 rounded-3xl bg-[#9BAE83]/20 border-3 border-dashed border-[#9BAE83] flex flex-col justify-between space-y-3 shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#435744]">
                  Perturbed Text (Evasion Highlighted)
                </span>
                <Badge variant={dynamicPerturbedProb < 50 ? 'sage' : 'warning'} size="sm">
                  {dynamicPerturbedProb}% AI Confidence (Evasion)
                </Badge>
              </div>

              {/* Render Diff Highlighter */}
              {renderHighlightedDiff()}
            </div>

            <div className="text-[11px] text-[#435744] flex items-center gap-2 pt-1 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9BAE83]"></span>
              <span>Highlighted tokens degrade statistical likelihood and evade detector.</span>
            </div>
          </div>

        </div>

        {/* Forensic Vulnerability Explanation */}
        <div className="p-5 rounded-3xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/25 text-xs space-y-1.5 shadow-2xs">
          <h4 className="font-black text-[#435744] flex items-center gap-2 text-sm">
            <ShieldAlert className="w-4 h-4 text-[#B58422]" />
            Forensic Vulnerability Diagnosis:
          </h4>
          <p className="text-[#30312D]/85 leading-relaxed text-xs font-medium">
            {activeAttack.vulnerabilityAnalysis}
          </p>
        </div>

        {/* Action Controls as Plush Fur Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t-2 border-dashed border-[#435744]/15">
          <FuzzyFurPillButton
            variant="cream"
            size="md"
            icon={RotateCcw}
            onClick={handleReset}
            title="Reset adversarial scenario"
          >
            Reset Scenario
          </FuzzyFurPillButton>
          
          <FuzzyFurPillButton
            variant="forest"
            size="lg"
            icon={isSimulating ? undefined : Play}
            onClick={handleApplyAttack}
            disabled={isSimulating}
            title="Simulate adversarial attack perturbation"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Simulating Perturbation...</span>
              </span>
            ) : (
              'Simulate Adversarial Attack'
            )}
          </FuzzyFurPillButton>
        </div>

      </div>

      {/* Perturbation Decay Curve Visualization */}
      <div className="knitted-card p-6 sm:p-8 space-y-5 border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#30312D]">
              Perturbation Decay Curve (Model Robustness under Adversarial Pressure)
            </h3>
            <p className="text-xs text-[#30312D]/75 font-medium">
              Detector accuracy decays rapidly as perturbation swaps increase from 0% to 50%. The ensemble architecture retains higher resilience.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-black">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E58B36]"></span>
              <span className="text-[#9E4D09]">Baseline (Logistic)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#343B59]"></span>
              <span className="text-[#343B59]">RoBERTa-Large</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#435744]"></span>
              <span className="text-[#435744]">AI-Guard Ensemble</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={PERTURBATION_DECAY_CURVE}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
              <XAxis 
                dataKey="perturbationRate" 
                tick={{ fill: '#30312D', fontSize: 12, fontWeight: 700 }} 
                axisLine={{ stroke: '#C8BEAE' }}
              />
              <YAxis 
                unit="%"
                domain={[0, 100]}
                tick={{ fill: '#30312D', fontSize: 12, fontWeight: 600 }} 
                axisLine={{ stroke: '#C8BEAE' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFDF8', 
                  borderColor: '#9BAE83', 
                  borderRadius: '1.25rem',
                  borderWidth: '2px',
                  borderStyle: 'dashed',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="baselineDetector" 
                name="Baseline (TF-IDF)" 
                stroke="#E58B36" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#E58B36' }} 
              />
              <Line 
                type="monotone" 
                dataKey="transformerDetector" 
                name="RoBERTa-Large" 
                stroke="#343B59" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#343B59' }} 
              />
              <Line 
                type="monotone" 
                dataKey="aiGuardEnsemble" 
                name="AI-Guard Ensemble" 
                stroke="#435744" 
                strokeWidth={3.5} 
                dot={{ r: 5, fill: '#435744' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-Domain Shift Benchmarks Table */}
      <div className="knitted-card p-6 sm:p-8 space-y-4 border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="space-y-1">
          <h3 className="text-base font-black text-[#30312D]">
            Cross-Domain Evasion Benchmarks
          </h3>
          <p className="text-xs text-[#30312D]/75 font-medium">
            Evasion rate measures the percentage of synthetic text that successfully bypasses the detection boundary across domains.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-dashed border-[#435744]/20 text-[#435744] font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Evaluation Domain</th>
                <th className="py-3 px-3">Precision</th>
                <th className="py-3 px-3">Recall</th>
                <th className="py-3 px-3">F1 Score</th>
                <th className="py-3 px-3">Evasion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[#435744]/15 text-[#30312D]">
              {DOMAIN_SHIFT_BENCHMARKS.map((benchmark, idx) => (
                <tr key={idx} className="hover:bg-[#9BAE83]/15 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#435744]">
                    {benchmark.domain}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">{benchmark.precision}%</td>
                  <td className="py-3.5 px-3 font-mono font-bold">{benchmark.recall}%</td>
                  <td className="py-3.5 px-3 font-mono font-black text-[#435744]">{benchmark.f1}%</td>
                  <td className="py-3.5 px-3 font-mono">
                    <span className={`px-3 py-1 rounded-full font-black text-[11px] ${
                      benchmark.evasionRate > 20
                        ? 'bg-[#E58B36]/30 text-[#6B2E05] border border-dashed border-[#E58B36]'
                        : 'bg-[#9BAE83]/30 text-[#1F2C18] border border-dashed border-[#9BAE83]'
                    }`}>
                      {benchmark.evasionRate}% Evasion
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

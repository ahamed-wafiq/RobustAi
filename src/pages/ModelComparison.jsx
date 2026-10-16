import React, { useState } from 'react';
import { 
  GitCompare, 
  Cpu, 
  Zap, 
  Clock, 
  HardDrive, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Layers,
  HelpCircle,
  TrendingUp,
  BarChart2,
  FileCheck,
  Split,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  MODEL_SPECS, 
  COMPARATIVE_METRICS, 
  ROC_CURVE_DATA, 
  DOMAIN_TRANSFER_GAP,
  CONFUSION_MATRICES 
} from '../data/benchmarkData';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

export default function ModelComparison() {
  const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'roc' | 'domain' | 'matrix'

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Page Header */}
      <div className="knitted-card p-4 sm:p-7 lg:p-8 bg-gradient-to-br from-[#FFFDF8] via-[#FFFCF5] to-[#F5EEDB] border-2 sm:border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#435744] bg-[#9BAE83]/30 px-3 sm:px-3.5 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
                ARCHITECTURE COMPARISON
              </span>
              <Badge variant="sage">Scientific Laboratory</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#30312D] tracking-tight">
              Two approaches. <span className="text-[#435744] underline decoration-wavy decoration-[#9BAE83]">One research question.</span>
            </h1>
            <p className="text-xs sm:text-base text-[#30312D]/85 leading-relaxed font-medium">
              Explore the trade-offs between classical machine learning and contextual transformer models for AI text forensics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black bg-[#FFFDF8] border-2 border-dashed border-[#E7B44F] text-[#543A05] px-3.5 sm:px-4 py-2 rounded-2xl shadow-xs">
            <AlertTriangle className="w-4 h-4 text-[#B58422] shrink-0" />
            <span>Illustrative Literature Benchmarks</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Research Integrity Clarification Alert */}
      <div className="knitted-card p-4 sm:p-5 bg-[#FFFDF8] border-2 sm:border-3 border-dashed border-[#343B59]/40 text-xs sm:text-sm text-[#30312D] flex items-start gap-3 sm:gap-3.5 shadow-xs">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl plush-button plush-navy shrink-0 shadow-2xs flex items-center justify-center">
          <Info className="w-4 h-4 embroidered-icon-light" />
        </div>
        <div className="space-y-1 min-w-0">
          <p className="font-black text-[#343B59] text-xs sm:text-sm">
            Measured Baseline vs. Reference Transformer Notice
          </p>
          <p className="text-[#30312D]/85 leading-relaxed text-[11px] sm:text-xs font-medium">
            The <strong>Baseline Logistic Regression model</strong> is actively loaded and served by the FastAPI backend using <code className="font-mono bg-[#F5EEDB] px-1.5 py-0.5 rounded text-[#435744] font-bold">backend/models/ai_guard_baseline.joblib</code>. The RoBERTa-Large contextual sequence classifier figures are <strong>published academic reference benchmarks</strong> to contextualize trade-offs between ultra-low-latency linear representations and deep neural attention.
          </p>
        </div>
      </div>

      {/* Architecture Cards: Model A vs Model B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Model A: Baseline Logistic Regression */}
        <div className="knitted-card p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 border-2 sm:border-3 border-dashed border-[#9BAE83] relative overflow-hidden shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <Badge variant="sage" size="sm">
                Model A — Trained Baseline
              </Badge>
              <h3 className="text-lg sm:text-xl font-black text-[#30312D]">
                {MODEL_SPECS.baseline.name}
              </h3>
              <p className="text-xs text-[#30312D]/75 font-semibold">
                {MODEL_SPECS.baseline.architecture}
              </p>
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl plush-button plush-mustard shrink-0 shadow-md flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 embroidered-icon" />
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t-2 border-dashed border-[#435744]/15 text-xs">
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Parameter Scale</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.baseline.parameters}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Inference Latency</span>
              <span className="font-black text-xs sm:text-sm text-[#435744]">{MODEL_SPECS.baseline.inferenceLatency}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Artifact Size</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.baseline.memoryFootprint}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Training Budget</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.baseline.trainingTime}</span>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <p className="font-black text-[#435744] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 text-[#9BAE83]" />
                Key Architectural Advantages
              </p>
              <ul className="space-y-1 text-[#30312D]/85 pl-4 sm:pl-5 list-disc leading-relaxed text-[11px] sm:text-xs font-medium">
                {MODEL_SPECS.baseline.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-black text-[#E58B36] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <XCircle className="w-4 h-4 text-[#E58B36]" />
                Known Forensic Vulnerabilities
              </p>
              <ul className="space-y-1 text-[#30312D]/85 pl-4 sm:pl-5 list-disc leading-relaxed text-[11px] sm:text-xs font-medium">
                {MODEL_SPECS.baseline.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Model B: RoBERTa-Large Literature Reference */}
        <div className="knitted-card p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 border-2 sm:border-3 border-dashed border-[#343B59]/50 relative overflow-hidden shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <Badge variant="navy" size="sm">
                Model B — Literature Reference
              </Badge>
              <h3 className="text-lg sm:text-xl font-black text-[#30312D]">
                {MODEL_SPECS.transformer.name}
              </h3>
              <p className="text-xs text-[#30312D]/75 font-semibold">
                {MODEL_SPECS.transformer.architecture}
              </p>
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl plush-button plush-navy shrink-0 shadow-md flex items-center justify-center">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 embroidered-icon-light" />
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t-2 border-dashed border-[#435744]/15 text-xs">
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Parameter Scale</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.transformer.parameters}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Inference Latency</span>
              <span className="font-black text-xs sm:text-sm text-[#E7B44F]">{MODEL_SPECS.transformer.inferenceLatency}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Weights Size</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.transformer.memoryFootprint}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#435744]/20 shadow-2xs">
              <span className="text-[#30312D]/60 block text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Training Budget</span>
              <span className="font-black text-xs sm:text-sm text-[#30312D]">{MODEL_SPECS.transformer.trainingTime}</span>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <p className="font-black text-[#435744] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 text-[#9BAE83]" />
                Key Architectural Advantages
              </p>
              <ul className="space-y-1 text-[#30312D]/85 pl-4 sm:pl-5 list-disc leading-relaxed text-[11px] sm:text-xs font-medium">
                {MODEL_SPECS.transformer.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-black text-[#E58B36] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <XCircle className="w-4 h-4 text-[#E58B36]" />
                Known Forensic Vulnerabilities
              </p>
              <ul className="space-y-1 text-[#30312D]/85 pl-4 sm:pl-5 list-disc leading-relaxed text-[11px] sm:text-xs font-medium">
                {MODEL_SPECS.transformer.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Benchmark Charts Tabs with Plush Controls */}
      <div className="knitted-card p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 border-2 sm:border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        
        {/* Navigation Tabs as Plush Fur Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b-2 border-dashed border-[#435744]/15">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap -mx-1 px-1">
            {[
              { id: 'performance', label: 'Core Accuracy & F1', variant: 'plush-forest', text: 'text-[#FFFDF9]' },
              { id: 'roc', label: 'ROC Curves (TPR vs FPR)', variant: 'plush-navy', text: 'text-[#FFFDF9]' },
              { id: 'domain', label: 'Domain Transfer Gap', variant: 'plush-mustard', text: 'text-[#2D220A]' },
              { id: 'matrix', label: 'Confusion Matrices', variant: 'plush-orange', text: 'text-[#FFFDF9]' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`plush-button ${tab.variant} ${tab.text} px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black transition-all shadow-sm shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'scale-105 shadow-lg ring-2 sm:ring-3 ring-white ring-offset-2 ring-offset-[#435744] z-10 opacity-100'
                      : 'opacity-75 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-black">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#9BAE83] inline-block shadow-2xs"></span>
              <span className="text-[#30312D]/80">Baseline (HC3)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#343B59] inline-block shadow-2xs"></span>
              <span className="text-[#343B59]">RoBERTa Literature</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Core Performance Grouped Bar Chart */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-[#30312D]">
                Core Evaluation Metrics (In-Domain vs Out-of-Domain)
              </h3>
              <p className="text-[11px] sm:text-xs text-[#30312D]/75 font-medium">
                Notice the higher ESL False Positive Rate on simple statistical baselines compared to deep contextual representations.
              </p>
            </div>

            <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={COMPARATIVE_METRICS}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" vertical={false} />
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fill: '#30312D', fontSize: 10, fontWeight: 700 }} 
                    axisLine={{ stroke: '#C8BEAE' }}
                  />
                  <YAxis 
                    tick={{ fill: '#30312D', fontSize: 10, fontWeight: 600 }} 
                    unit="%"
                    domain={[0, 100]}
                    axisLine={{ stroke: '#C8BEAE' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFDF8', 
                      borderColor: '#9BAE83', 
                      borderRadius: '1.25rem',
                      borderWidth: '2px',
                      borderStyle: 'dashed',
                      boxShadow: '0 8px 16px rgba(67, 87, 68, 0.12)',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 700
                    }} 
                  />
                  <Bar dataKey="baseline" name="Baseline (Logistic Regression)" fill="#9BAE83" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="transformer" name="RoBERTa-Large (Literature)" fill="#343B59" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive ROC Curves */}
        {activeTab === 'roc' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#30312D]">
                Receiver Operating Characteristic (ROC) Comparison
              </h3>
              <p className="text-xs text-[#30312D]/75 font-medium">
                True Positive Rate vs. False Positive Rate across decision thresholds. The diagonal indicates random guessing.
              </p>
            </div>

            <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ROC_CURVE_DATA}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
                  <XAxis 
                    dataKey="fpr" 
                    tick={{ fill: '#30312D', fontSize: 10 }} 
                    label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -10, fill: '#30312D', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis 
                    tick={{ fill: '#30312D', fontSize: 10 }} 
                    label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fill: '#30312D', fontSize: 11, fontWeight: 700 }}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFDF8', 
                      borderColor: '#9BAE83', 
                      borderRadius: '1.25rem',
                      borderWidth: '2px',
                      borderStyle: 'dashed',
                      boxShadow: '0 8px 16px rgba(67, 87, 68, 0.12)',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 700
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    name="Baseline (AUC ≈ 0.88)" 
                    stroke="#9BAE83" 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: '#9BAE83' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transformer" 
                    name="RoBERTa-Large (AUC ≈ 0.97)" 
                    stroke="#343B59" 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: '#343B59' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Domain Transfer Gap */}
        {activeTab === 'domain' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-[#30312D]">
                Cross-Domain Generalization Degradation
              </h3>
              <p className="text-[11px] sm:text-xs text-[#30312D]/75 font-medium">
                Evaluation accuracy across disparate domains. Both architectures experience accuracy loss on ESL student writing and creative prose.
              </p>
            </div>

            <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DOMAIN_TRANSFER_GAP}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" vertical={false} />
                  <XAxis 
                    dataKey="domain" 
                    tick={{ fill: '#30312D', fontSize: 10, fontWeight: 700 }} 
                  />
                  <YAxis 
                    unit="%"
                    domain={[40, 100]}
                    tick={{ fill: '#30312D', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFDF8', 
                      borderColor: '#9BAE83', 
                      borderRadius: '1.25rem',
                      borderWidth: '2px',
                      borderStyle: 'dashed',
                      fontFamily: 'Outfit, sans-serif'
                    }} 
                  />
                  <Bar dataKey="baseline" name="Baseline Model" fill="#E7B44F" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="transformer" name="RoBERTa-Large" fill="#435744" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 4: Confusion Matrices */}
        {activeTab === 'matrix' && (
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-[#30312D]">
                Confusion Matrix Analysis (Held-Out Test Set N=2,000)
              </h3>
              <p className="text-[11px] sm:text-xs text-[#30312D]/75 font-medium">
                Visualizing true positives, false positives, true negatives, and false negatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1 sm:pt-2">
              
              {/* Baseline Matrix */}
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl quilted-inset space-y-3 sm:space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-[#435744]">
                    Baseline (Logistic Regression)
                  </h4>
                  <Badge variant="sage" size="sm">N=2,000</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 text-center text-xs">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#9BAE83]/30 border-2 border-dashed border-[#9BAE83] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#2D3E24] block">True Human</span>
                    <span className="text-xl sm:text-2xl font-black text-[#2D3E24]">{CONFUSION_MATRICES.baseline.trueHuman}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#2D3E24] block font-bold">84.2%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E58B36]/30 border-2 border-dashed border-[#E58B36] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#6B2E05] block">False AI</span>
                    <span className="text-xl sm:text-2xl font-black text-[#6B2E05]">{CONFUSION_MATRICES.baseline.falseAI}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#6B2E05] block font-bold">15.8%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E7B44F]/30 border-2 border-dashed border-[#E7B44F] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#543A05] block">False Human</span>
                    <span className="text-xl sm:text-2xl font-black text-[#543A05]">{CONFUSION_MATRICES.baseline.falseHuman}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#543A05] block font-bold">19.4%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#435744]/25 border-2 border-dashed border-[#435744] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#2D3E24] block">True AI</span>
                    <span className="text-xl sm:text-2xl font-black text-[#2D3E24]">{CONFUSION_MATRICES.baseline.trueAI}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#2D3E24] block font-bold">80.6%</span>
                  </div>
                </div>
              </div>

              {/* Transformer Matrix */}
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl quilted-inset space-y-3 sm:space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-[#343B59]">
                    RoBERTa-Large (Literature Reference)
                  </h4>
                  <Badge variant="navy" size="sm">N=2,000</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 text-center text-xs">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#9BAE83]/30 border-2 border-dashed border-[#9BAE83] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#2D3E24] block">True Human</span>
                    <span className="text-xl sm:text-2xl font-black text-[#2D3E24]">{CONFUSION_MATRICES.transformer.trueHuman}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#2D3E24] block font-bold">93.8%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E58B36]/30 border-2 border-dashed border-[#E58B36] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#6B2E05] block">False AI</span>
                    <span className="text-xl sm:text-2xl font-black text-[#6B2E05]">{CONFUSION_MATRICES.transformer.falseAI}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#6B2E05] block font-bold">6.2%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E7B44F]/30 border-2 border-dashed border-[#E7B44F] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#543A05] block">False Human</span>
                    <span className="text-xl sm:text-2xl font-black text-[#543A05]">{CONFUSION_MATRICES.transformer.falseHuman}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#543A05] block font-bold">4.6%</span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#343B59]/25 border-2 border-dashed border-[#343B59] shadow-2xs">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-[#20253B] block">True AI</span>
                    <span className="text-xl sm:text-2xl font-black text-[#20253B]">{CONFUSION_MATRICES.transformer.trueAI}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#20253B] block font-bold">95.4%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

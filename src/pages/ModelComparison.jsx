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
  FileCheck
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
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Model Architecture & Benchmark Comparison
              </h1>
              <Badge variant="blue">Architecture Comparison</Badge>
            </div>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Comparative analysis contrasting the trained <strong>Logistic Regression Baseline (HC3)</strong> against an illustrative <strong>Contextual Transformer (RoBERTa-Large)</strong> from academic literature.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Illustrative Literature Benchmarks</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Research Integrity Clarification Alert */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-900">
            Measured vs. Reference Baseline Notice
          </p>
          <p className="text-blue-800/90 leading-relaxed text-xs">
            The <strong>Baseline Logistic Regression model</strong> is actively loaded and served by the FastAPI backend using <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900">backend/models/ai_guard_baseline.joblib</code>. The RoBERTa-Large metrics, ROC curves, and cross-domain projections shown below are <strong>illustrative academic reference figures</strong> from NLP literature to contextualize trade-offs between linear n-gram and deep contextual architectures. Consult your Colab <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900">metrics.json</code> for the exact held-out test measurements.
          </p>
        </div>
      </div>

      {/* High-Level Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-6 space-y-5 hover:border-emerald-300 transition-all border-t-4 border-t-emerald-600">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge variant="human">{MODEL_SPECS.baseline.statusBadge}</Badge>
              <h3 className="text-lg font-bold text-slate-900">
                {MODEL_SPECS.baseline.name}
              </h3>
              <p className="text-xs text-slate-500">
                {MODEL_SPECS.baseline.architecture}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Parameter Scale</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.baseline.parameters}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Inference Latency</span>
              <span className="font-bold text-emerald-600">{MODEL_SPECS.baseline.inferenceLatency}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Artifact Size</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.baseline.memoryFootprint}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Training Requirement</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.baseline.trainingTime}</span>
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Key Advantages
              </p>
              <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                {MODEL_SPECS.baseline.strengths.slice(0, 3).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-rose-700 mb-1 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Known Vulnerabilities
              </p>
              <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                {MODEL_SPECS.baseline.weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Transformer Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 hover:border-slate-300 transition-all border-t-4 border-t-indigo-600">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge variant="indigo">{MODEL_SPECS.transformer.statusBadge}</Badge>
              <h3 className="text-lg font-bold text-slate-900">
                {MODEL_SPECS.transformer.name}
              </h3>
              <p className="text-xs text-slate-500">
                {MODEL_SPECS.transformer.architecture}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Cpu className="w-6 h-6" />
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Parameter Scale</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.transformer.parameters}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Inference Latency</span>
              <span className="font-bold text-amber-600">{MODEL_SPECS.transformer.inferenceLatency}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Weights Footprint</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.transformer.memoryFootprint}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Training Requirement</span>
              <span className="font-bold text-slate-800">{MODEL_SPECS.transformer.trainingTime}</span>
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Key Advantages
              </p>
              <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                {MODEL_SPECS.transformer.strengths.slice(0, 3).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-rose-700 mb-1 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Known Vulnerabilities
              </p>
              <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                {MODEL_SPECS.transformer.weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Chart Section: Grouped Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Core Performance Metrics (Literature Reference Comparison)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating in-domain classification, out-of-domain transfer, and false positive rates.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-400 inline-block"></span>
              <span className="text-slate-600">Baseline (Logistic Regression)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
              <span className="text-slate-900 font-semibold">RoBERTa Reference</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COMPARATIVE_METRICS}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                unit="%" 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'baseline' ? 'Baseline (Logistic Regression)' : 'RoBERTa Reference'
                ]}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  borderColor: '#e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-xs font-medium text-slate-700">
                    {value === 'baseline' ? 'Baseline (Logistic Regression)' : 'Transformer (RoBERTa Reference)'}
                  </span>
                )}
              />
              <Bar dataKey="baseline" name="baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="transformer" name="transformer" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-slate-500 italic text-center">
          *Note: Reference comparison figures from published literature. On False Positive Rate (ESL), lower is substantially better.
        </p>
      </div>

      {/* Two Column Section: ROC Curve & Domain Transfer Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROC Curve Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                ROC Curves (Illustrative AUC Comparison)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              AUC: 0.81 vs 0.96 (Ref)
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Receiver Operating Characteristic comparing true positive rate against false positive rate across classification thresholds.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ROC_CURVE_DATA}
                margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="fpr" 
                  name="False Positive Rate" 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis 
                  domain={[0, 1]} 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip 
                  formatter={(val, name) => [
                    Number(val).toFixed(2), 
                    name === 'baseline' ? 'Baseline LR' : 'RoBERTa Ref'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    borderColor: '#e2e8f0', 
                    fontSize: '11px' 
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  name="Baseline (Ref AUC 0.81)" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  dot={{ r: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transformer" 
                  name="RoBERTa (Ref AUC 0.96)" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Transfer Gap Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Cross-Domain Generalization Reference
              </h3>
            </div>
            <Badge variant="warning">Literature Benchmark</Badge>
          </div>

          <p className="text-xs text-slate-500">
            Measuring detection accuracy when models are evaluated outside their native training distribution.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Evaluation Domain</th>
                  <th className="py-2.5 px-3 text-right">Baseline LR</th>
                  <th className="py-2.5 px-3 text-right">RoBERTa (Ref)</th>
                  <th className="py-2.5 px-3 text-right">Delta (Δ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DOMAIN_TRANSFER_GAP.map((row, idx) => {
                  const delta = (row.transformer - row.baseline).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {row.domain}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {row.baseline}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">
                        {row.transformer}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-600 font-medium">
                        +{delta}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            <strong>Key Finding:</strong> Both architectures demonstrate performance drops on Creative Fiction and Technical Writing, highlighting that detectors do not generalize across distinct genres without domain adaptation.
          </div>
        </div>

      </div>

      {/* Synthesis Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold">
            Methodological Takeaway & AI-Guard Hybrid Approach
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          While deep transformer models capture rich contextual representations, they require significant compute and remain vulnerable to adversarial perturbations. The AI-Guard project explores an <strong>ensemble hybrid approach</strong> combining lightweight statistical priors with contextual representations to provide fast, explainable, and evasion-resistant text forensics.
        </p>
      </div>
    </div>
  );
}

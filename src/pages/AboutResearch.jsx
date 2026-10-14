import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  Users, 
  Scale, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import Badge from '../components/common/Badge';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

export default function AboutResearch() {
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  const bibtexCode = `@article{aiguard2026robust,
  title={AI-Guard: A Robust AI-Generated Text Detection and Analysis System},
  author={AI-Guard Research Group},
  journal={Antigravity Research Preprint Series},
  year={2026},
  url={https://github.com/ai-guard/robust-text-detection}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                About the AI-Guard Project
              </h1>
              <Badge variant="blue">Research Whitepaper</Badge>
            </div>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Research motivation, methodological architecture, fairness considerations, and fundamental ethical limitations in AI text detection.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            <Scale className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Ethical AI Evaluation Framework</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Abstract & Research Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Article Body (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Abstract Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Project Abstract
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              As large language models (LLMs) continue to proliferate across academia, journalism, and public communication, the demand for reliable provenance verification has intensified. However, existing statistical detection mechanisms remain notoriously fragile—exhibiting severe performance decay under light paraphrasing, adversarial synonym substitutions, and out-of-domain transfer. Crucially, contemporary detectors demonstrate systematic bias against non-native English (ESL) writers, whose restricted vocabulary and syntactic predictability frequently cause them to be erroneously flagged as synthetic. <strong>AI-Guard</strong> is an academic research platform developed to benchmark, expose, and mitigate these vulnerabilities through robust ensemble stylometrics and adversarial evaluation.
            </p>
          </div>

          {/* Research Objectives */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Core Research Objectives
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="text-sm font-bold text-slate-900">Quantifying Evasion Fragility</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Systematically benchmarking the failure thresholds of TF-IDF, n-gram, and transformer classifiers when subjected to commercial paraphrasers and adversarial perturbations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="text-sm font-bold text-slate-900">Mitigating Non-Native Bias</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Developing calibration layers to decouple syntactic simplicity from synthetic generation likelihood, drastically decreasing the false positive rate on ESL student corpora.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="text-sm font-bold text-slate-900">Explainable Feature Attribution</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Providing sentence-level burstiness maps and lexical perplexity breakdowns so evaluators understand <em>why</em> a score was produced rather than relying on black-box percentages.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="text-sm font-bold text-slate-900">Robust Ensemble Forensics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unifying lightweight statistical priors with contextual transformer attention to provide defense-in-depth against single-vector evasion tactics.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Methodology & Architecture Design
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The AI-Guard pipeline employs a multi-tiered inspection protocol designed to overcome the blind spots of singular detection techniques:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Stage 1: Preprocessing & Unicode Normalization (NFKC)</span>
                    <span className="text-slate-400 font-mono">Input Sanitization</span>
                  </div>
                  <p className="text-slate-600">
                    Strips homoglyphic character exploits, zero-width joiners, and formatting anomalies before tokenization to ensure attackers cannot fragment BPE vocabularies.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Stage 2: Stylometric & Burstiness Profiling</span>
                    <span className="text-slate-400 font-mono">Statistical Heuristics</span>
                  </div>
                  <p className="text-slate-600">
                    Extracts type-token ratio (TTR), sentence-length variance, punctuation density, and surprisal entropy across sliding windows.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Stage 3: Contextual Transformer Classification Head</span>
                    <span className="text-slate-400 font-mono">Neural Representation</span>
                  </div>
                  <p className="text-slate-600">
                    Fine-tuned RoBERTa-large encoder evaluates discourse cohesion and subtle contextual transition tropes characteristic of frontier LLM generation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Stage 4: Calibrated Uncertainty Estimation</span>
                    <span className="text-slate-400 font-mono">Bayesian Calibration</span>
                  </div>
                  <p className="text-slate-600">
                    Produces a confidence interval (e.g., ±5%) and explicitly flags inputs with elevated ambiguity rather than forcing an overconfident binary prediction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ethical Framework & Limitations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              Ethical Considerations & Fundamental Limitations
            </h3>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-amber-950">
              <p className="leading-relaxed">
                As computational researchers, we emphasize several critical axioms regarding text detection technologies:
              </p>

              <ul className="space-y-2.5 list-disc pl-5 text-xs text-amber-900 leading-relaxed">
                <li>
                  <strong>Mathematical Impossibility of Infallible Detection:</strong> As generative models converge toward optimal natural language distribution modeling, the theoretical gap between human and synthetic distribution approaches zero.
                </li>
                <li>
                  <strong>Disproportionate Impact on Marginalized Writers:</strong> Non-native speakers, neurodivergent writers, and students who adhere strictly to standardized essay structures produce predictable tokens, making them vulnerable to false positive accusations.
                </li>
                <li>
                  <strong>Never Use as Standalone Evidence:</strong> Detection tool scores must never serve as sole or primary evidence in academic integrity hearings or disciplinary sanctions.
                </li>
                <li>
                  <strong>Arms Race Dynamics:</strong> Any static detection boundary can be bypassed through iterative prompt tuning and paraphrasing algorithms.
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Research Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Project Specification
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Project:</span>
                <span className="font-semibold text-slate-900">AI-Guard</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-blue-600">Active Prototype (v0.1)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Primary Domain:</span>
                <span className="font-semibold text-slate-900">NLP & Forensic Stylometry</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Target Models:</span>
                <span className="font-semibold text-slate-900">GPT-4, Claude, Llama 3</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Evaluation Datasets:</span>
                <span className="font-semibold text-slate-900">Academic, ESL, Synthetic</span>
              </div>
            </div>
          </div>

          {/* Citation BibTeX Block */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                BibTeX Citation
              </h3>
              <button
                type="button"
                onClick={handleCopyBibtex}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1 border border-slate-200"
                title="Copy BibTeX citation"
              >
                {copiedBibtex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto">
              {bibtexCode}
            </pre>
          </div>

          {/* Research Team / Contact */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Research Lab & Affiliations
            </h4>
            <p className="text-slate-600 leading-relaxed">
              AI-Guard is maintained by independent computational linguistics and adversarial machine learning researchers dedicated to open, fair, and accountable AI forensics.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

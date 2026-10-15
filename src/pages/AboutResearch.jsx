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
  ExternalLink,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import Badge from '../components/common/Badge';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';
import researchHutImg from '../assets/knitted-research-hut.jpg';

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
      <div className="knitted-card p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF8] via-[#FFFCF5] to-[#F5EEDB] border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#435744] bg-[#9BAE83]/30 px-3.5 py-1 rounded-full border-2 border-dashed border-[#9BAE83] shadow-2xs">
                RESEARCH WHITEPAPER & METHODOLOGY
              </span>
              <Badge variant="sage">Editorial Document</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#30312D] tracking-tight">
              About the <span className="text-[#435744] underline decoration-wavy decoration-[#9BAE83]">AI-Guard Project</span>
            </h1>
            <p className="text-sm sm:text-base text-[#30312D]/85 leading-relaxed font-medium">
              Research motivation, methodological architecture, fairness considerations, and fundamental ethical limitations in AI text detection.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black bg-[#FFFDF8] border-2 border-dashed border-[#435744]/30 text-[#435744] px-4 py-2 rounded-2xl shadow-xs">
            <Scale className="w-4 h-4 text-[#9BAE83] shrink-0" />
            <span>Ethical AI Evaluation Framework</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Main Grid: Article Content (8 cols) & Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Article Body (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Abstract Box */}
          <div className="knitted-card p-6 sm:p-8 space-y-3.5 border-3 border-dashed border-[#9BAE83]/60 shadow-md">
            <div className="flex items-center gap-2.5 text-[#435744]">
              <div className="w-8 h-8 rounded-full plush-sage flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 embroidered-icon" />
              </div>
              <h2 className="text-base font-black text-[#30312D]">
                Project Abstract
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-[#30312D]/85 leading-relaxed font-medium">
              As large language models (LLMs) proliferate across academia, journalism, and digital communication, the demand for reliable provenance verification has surged. However, statistical detection mechanisms remain notoriously fragile—exhibiting steep performance degradation under paraphrasing, adversarial synonym substitutions, and cross-domain transfer. Crucially, contemporary detectors demonstrate systematic bias against non-native English (ESL) writers, whose predictable syntactic choices frequently trigger false synthetic accusations. <strong>AI-Guard</strong> is an academic research platform developed to benchmark, expose, and mitigate these vulnerabilities through robust ensemble stylometrics and open adversarial evaluation.
            </p>
          </div>

          {/* Research Motivation & Objectives */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-[#435744]" />
              <h3 className="text-lg font-black text-[#30312D]">
                Core Research Objectives
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="knitted-card p-5 space-y-2 border-3 border-dashed border-[#9BAE83]/50 shadow-sm">
                <span className="w-9 h-9 rounded-2xl plush-sage text-[#2D3E24] font-black text-xs flex items-center justify-center shadow-xs">
                  01
                </span>
                <h4 className="text-sm font-black text-[#30312D]">Quantifying Evasion Fragility</h4>
                <p className="text-xs text-[#30312D]/80 leading-relaxed font-medium">
                  Systematically benchmarking the failure thresholds of TF-IDF, n-gram, and transformer classifiers when subjected to commercial paraphrasers and adversarial perturbations.
                </p>
              </div>

              <div className="knitted-card p-5 space-y-2 border-3 border-dashed border-[#435744]/30 shadow-sm">
                <span className="w-9 h-9 rounded-2xl plush-forest text-[#FFFDF9] font-black text-xs flex items-center justify-center shadow-xs">
                  02
                </span>
                <h4 className="text-sm font-black text-[#30312D]">Mitigating Non-Native Bias</h4>
                <p className="text-xs text-[#30312D]/80 leading-relaxed font-medium">
                  Developing calibration layers to decouple syntactic simplicity from synthetic generation likelihood, drastically decreasing the false positive rate on ESL student corpora.
                </p>
              </div>

              <div className="knitted-card p-5 space-y-2 border-3 border-dashed border-[#E7B44F]/50 shadow-sm">
                <span className="w-9 h-9 rounded-2xl plush-mustard text-[#543A05] font-black text-xs flex items-center justify-center shadow-xs">
                  03
                </span>
                <h4 className="text-sm font-black text-[#30312D]">Explainable Feature Attribution</h4>
                <p className="text-xs text-[#30312D]/80 leading-relaxed font-medium">
                  Providing sentence-level burstiness maps and lexical perplexity breakdowns so evaluators understand <em>why</em> a score was produced rather than relying on opaque probabilities.
                </p>
              </div>

              <div className="knitted-card p-5 space-y-2 border-3 border-dashed border-[#E58B36]/50 shadow-sm">
                <span className="w-9 h-9 rounded-2xl plush-orange text-[#6B2E05] font-black text-xs flex items-center justify-center shadow-xs">
                  04
                </span>
                <h4 className="text-sm font-black text-[#30312D]">Robust Ensemble Forensics</h4>
                <p className="text-xs text-[#30312D]/80 leading-relaxed font-medium">
                  Unifying lightweight statistical priors with contextual attention to provide defense-in-depth against single-vector evasion tactics.
                </p>
              </div>
            </div>
          </div>

          {/* System Architecture & Multi-Tier Methodology */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#435744]" />
              <h3 className="text-lg font-black text-[#30312D]">
                Multi-Tier Methodology & Architecture
              </h3>
            </div>

            <div className="knitted-card p-6 sm:p-8 space-y-4 border-3 border-dashed border-[#9BAE83]/60 shadow-lg">
              <p className="text-xs sm:text-sm text-[#30312D]/85 leading-relaxed font-medium">
                The AI-Guard pipeline combines multiple complementary inspection stages to address the blind spots of isolated classifiers:
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-2xl quilted-inset space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between font-black text-[#435744]">
                    <span>Stage 1: Preprocessing & Unicode Normalization (NFKC)</span>
                    <span className="text-[#30312D]/60 font-mono text-[10px]">Input Sanitization</span>
                  </div>
                  <p className="text-[#30312D]/80 leading-relaxed font-medium">
                    Strips homoglyphic character exploits, zero-width spaces (U+200B), and anomalous whitespace before tokenization to ensure attackers cannot fragment BPE vocabularies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl quilted-inset space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between font-black text-[#435744]">
                    <span>Stage 2: Stylometric & Burstiness Profiling</span>
                    <span className="text-[#30312D]/60 font-mono text-[10px]">Statistical Heuristics</span>
                  </div>
                  <p className="text-[#30312D]/80 leading-relaxed font-medium">
                    Extracts type-token ratio (TTR), sentence-length variance, Flesch Reading Ease score, punctuation density, and surprisal entropy across sliding windows.
                  </p>
                </div>

                <div className="p-4 rounded-2xl quilted-inset space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between font-black text-[#435744]">
                    <span>Stage 3: Trained Baseline Model (HC3 Dataset)</span>
                    <span className="text-[#30312D]/60 font-mono text-[10px]">Active Serving Model</span>
                  </div>
                  <p className="text-[#30312D]/80 leading-relaxed font-medium">
                    High-throughput scikit-learn pipeline (TfidfVectorizer on 100k unigram + bigram n-grams paired with L2-regularized Logistic Regression) served via FastAPI.
                  </p>
                </div>

                <div className="p-4 rounded-2xl quilted-inset space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between font-black text-[#435744]">
                    <span>Stage 4: Calibrated Uncertainty Estimation</span>
                    <span className="text-[#30312D]/60 font-mono text-[10px]">Confidence Bounds</span>
                  </div>
                  <p className="text-[#30312D]/80 leading-relaxed font-medium">
                    Flags inputs with high ambiguity rather than forcing an overconfident binary prediction, protecting writers against unwarranted false accusations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Disclosure: Hello-SimpleAI/HC3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#435744]" />
              <h3 className="text-lg font-black text-[#30312D]">
                Dataset Disclosure & Attribution (HC3)
              </h3>
            </div>

            <div className="knitted-card p-6 sm:p-7 space-y-3 border-3 border-dashed border-[#9BAE83]/60 shadow-md text-xs sm:text-sm text-[#30312D]/85 leading-relaxed font-medium">
              <p>
                The trained baseline model utilizes the public <strong>Human ChatGPT Comparison Corpus (HC3)</strong> curated by Hello-SimpleAI. The corpus contains paired human answers and ChatGPT completions across:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#30312D]/80">
                <li>Open-domain question answering (Reddit ELI5, Baike)</li>
                <li>Computer science and technical explanations</li>
                <li>Medicine, finance, and legal domain inquiries</li>
              </ul>
              <p className="text-xs text-[#30312D]/70 pt-1">
                Data was split using <code>GroupShuffleSplit</code> to guarantee that questions in the evaluation set never leak into training folds.
              </p>
            </div>
          </div>

          {/* Limitations and Ethical Considerations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#E7B44F]" />
              <h3 className="text-lg font-black text-[#30312D]">
                Limitations & Ethical Fairness Considerations
              </h3>
            </div>

            <div className="knitted-card p-6 sm:p-8 space-y-4 border-3 border-dashed border-[#E7B44F] bg-[#FFFDF8] text-xs sm:text-sm text-[#543A05] shadow-md">
              <p className="font-black text-[#483307] text-sm">
                Critical Ethical Constraints in AI Text Forensics:
              </p>

              <ul className="space-y-3 list-disc pl-5 text-xs text-[#6B4B0A] leading-relaxed font-medium">
                <li>
                  <strong>Non-Native English (ESL) Bias:</strong> Writers using English as an additional language frequently employ formulaic transition phrases and restricted lexical diversity. As a result, commercial and statistical detectors exhibit an elevated false-positive rate on ESL student essays.
                </li>
                <li>
                  <strong>Short-Form Text Ambiguity:</strong> Texts below 100 words lack sufficient token distributions for robust statistical burstiness estimation. Scores on short snippets must be treated as exploratory heuristics.
                </li>
                <li>
                  <strong>Adversarial Arms Race:</strong> Any static detection boundary can be bypassed through iterative synonym replacement, homoglyph insertion, or multi-pass rephrasing prompts.
                </li>
                <li>
                  <strong>Never Use as Sole Evidence:</strong> Automated AI text detection must never be utilized as definitive evidence for academic sanctions or disciplinary proceedings.
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Sidebar Info & Visuals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Decorative Knitted Research Observatory Illustration */}
          <div className="knitted-card p-5 space-y-3 border-3 border-dashed border-[#9BAE83] shadow-md relative overflow-hidden text-center">
            <div className="relative rounded-3xl overflow-hidden border-3 border-dashed border-[#9BAE83]/60 shadow-md">
              <img 
                src={researchHutImg} 
                alt="Miniature 3D knitted research study hut with telescope and green woolen hill" 
                className="w-full h-60 object-cover transform hover:scale-103 transition duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#FFFDF8]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-dashed border-[#435744]/30 text-xs font-black text-[#435744] shadow-sm">
                Miniature Field Research Station
              </div>
            </div>
            <p className="text-xs text-[#30312D]/80 font-bold">
              Handcrafted artisanal diorama representing calm, transparent linguistic inquiry.
            </p>
          </div>

          {/* Research Metadata Card */}
          <div className="knitted-card p-6 space-y-4 border-3 border-dashed border-[#435744]/25 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#435744]">
              Project Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#435744]/15">
                <span className="text-[#30312D]/70 font-bold">Project Name:</span>
                <span className="font-black text-[#30312D]">AI-Guard Forensics</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#435744]/15">
                <span className="text-[#30312D]/70 font-bold">Status:</span>
                <Badge variant="sage" size="sm">Prototype v0.2</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-[#435744]/15">
                <span className="text-[#30312D]/70 font-bold">Primary Domain:</span>
                <span className="font-black text-[#30312D]">NLP Stylometry & Forensics</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#435744]/15">
                <span className="text-[#30312D]/70 font-bold">Baseline Dataset:</span>
                <span className="font-black text-[#435744]">Hello-SimpleAI/HC3</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#30312D]/70 font-bold">Backend Serving:</span>
                <span className="font-black text-[#30312D]">FastAPI (:8000)</span>
              </div>
            </div>
          </div>

          {/* Citation BibTeX Block with Plush Fur Copy Button */}
          <div className="knitted-card p-6 space-y-3.5 border-3 border-dashed border-[#9BAE83]/60 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#30312D] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#435744]" />
                BibTeX Citation
              </h3>
              
              <button
                type="button"
                onClick={handleCopyBibtex}
                className="plush-button plush-forest px-3.5 py-1.5 text-xs font-black shadow-sm"
                title="Copy BibTeX snippet"
              >
                {copiedBibtex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#F7D487]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#F7D487]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#30312D] text-[#9BAE83] rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto border-2 border-[#435744] shadow-inner">
              {bibtexCode}
            </pre>
          </div>

          {/* Research Group Info */}
          <div className="knitted-card p-6 space-y-2.5 border-2 border-dashed border-[#435744]/25 bg-[#F5EEDB] text-xs shadow-sm">
            <h4 className="font-black text-[#435744] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#9BAE83]" />
              Research Lab & Affiliations
            </h4>
            <p className="text-[#30312D]/80 leading-relaxed font-medium">
              AI-Guard is developed for computational linguistics and adversarial machine learning research, dedicated to ethical, fair, and transparent AI forensics.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

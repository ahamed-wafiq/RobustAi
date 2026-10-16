import React from 'react';
import { ShieldCheck, AlertCircle, Heart, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-14 sm:mt-20 bg-[#FFFDF8] border-t-3 border-dashed border-[#435744]/25 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Info & Research Mission */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="plush-circle-btn plush-forest w-10 h-10 sm:w-11 sm:h-11 shrink-0 shadow-md">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 embroidered-icon-light" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-black text-[#30312D] tracking-tight">AI-Guard Research</span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-[#9BAE83]/30 text-[#1F2C18] border-2 border-dashed border-[#9BAE83]">
                    Soft Forensics Lab
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#30312D]/85 leading-relaxed max-w-md font-medium">
              An open academic research initiative focused on evaluating the vulnerabilities, ethical limitations, and domain-shift behaviors of AI-generated text detection algorithms.
            </p>
            <div className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl quilted-inset text-[11px] sm:text-xs text-[#543A05] max-w-lg shadow-sm">
              <AlertCircle className="w-4 h-4 text-[#B58422] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                <strong className="font-black text-[#483307]">Academic Integrity Notice:</strong> Statistical AI detectors produce false positives on non-native English writing and can be bypassed by paraphrasing. This prototype must never be utilized as definitive evidence in disciplinary matters.
              </p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#435744]">
              Evaluation Suite
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#30312D]/85 font-bold">
              <li>
                <Link to="/" className="hover:text-[#435744] hover:underline transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9BAE83]"></span>
                  Text Detector
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-[#435744] hover:underline transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9BAE83]"></span>
                  Model Comparison
                </Link>
              </li>
              <li>
                <Link to="/robustness" className="hover:text-[#435744] hover:underline transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E58B36]"></span>
                  Robustness Lab
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#435744] hover:underline transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#343B59]"></span>
                  About & Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research Focus */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#435744]">
              Methodology & Benchmarks
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-[#30312D]/80 font-medium">
              <li className="flex items-center gap-1.5">• Stylometric burstiness & entropy analysis</li>
              <li className="flex items-center gap-1.5">• Adversarial evasion stress-testing</li>
              <li className="flex items-center gap-1.5">• ESL & non-native author bias reduction</li>
              <li className="flex items-center gap-1.5">• Cross-domain generalization decay</li>
              <li className="flex items-center gap-1.5">• Trained on Hello-SimpleAI/HC3 corpus</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-dashed border-[#435744]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] sm:text-xs text-[#30312D]/70 font-semibold">
          <p>© {new Date().getFullYear()} AI-Guard Project. Handcrafted with care for robust AI evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="plush-button plush-mustard px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-black shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 embroidered-icon" />
              Probabilistic Research Benchmarks
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

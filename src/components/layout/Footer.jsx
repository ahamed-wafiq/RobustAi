import React from 'react';
import { ShieldCheck, BookOpen, AlertCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">AI-Guard Research</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              A robust research initiative focused on evaluating the vulnerabilities, ethical limitations, and domain-shift behaviors of AI-generated text detection algorithms.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Academic Integrity Notice:</strong> Statistical AI detectors produce false positives on non-native English writing and can be bypassed by paraphrasing. This prototype must never be utilized as definitive evidence in disciplinary matters.
              </p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Evaluation Suite
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Text Detector
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-blue-600 transition-colors">
                  Model Comparison
                </Link>
              </li>
              <li>
                <Link to="/robustness" className="hover:text-blue-600 transition-colors">
                  Robustness Testing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  Methodology & Objectives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Research Focus
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>• Stylometric burstiness & perplexity analysis</li>
              <li>• Adversarial evasion stress-testing</li>
              <li>• ESL & non-native author bias reduction</li>
              <li>• Cross-domain generalization decay</li>
              <li>• Explainable ensemble decision bounds</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AI-Guard Project. Prototype Demonstration Environment.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              All benchmark metrics are synthetic demonstration data.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

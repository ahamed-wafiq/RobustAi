import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileSearch, 
  GitCompare, 
  Flame, 
  BookOpen, 
  Menu, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Text Detector', path: '/', icon: FileSearch, description: 'Analyze & inspect text' },
    { name: 'Model Comparison', path: '/comparison', icon: GitCompare, description: 'Baseline vs Transformer' },
    { name: 'Robustness Testing', path: '/robustness', icon: Flame, description: 'Adversarial evasion benchmarks' },
    { name: 'About / Research', path: '/about', icon: BookOpen, description: 'Objectives & methodology' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">AI-Guard Research Lab</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 hidden sm:inline">Evaluation Environment v0.1-prototype</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700/80">
              Demo Mode Active
            </span>
            <span className="hidden md:inline text-slate-400">
              Probabilistic Estimates • No Authorship Guarantees
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <NavLink to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AI-Guard
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  Research
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Robust AI-Generated Text Detection & Analysis
              </p>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action / Status */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ensemble Pipeline</span>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}

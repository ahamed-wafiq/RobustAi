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
  Sparkles,
  Wand2
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { 
      name: 'Text Detector', 
      path: '/', 
      icon: FileSearch, 
      description: 'Analyze & inspect text',
      colorClass: 'plush-forest',
      textClass: 'text-[#FFFDF9]',
      iconClass: 'embroidered-icon-light'
    },
    { 
      name: 'Humanizer Studio', 
      path: '/humanizer', 
      icon: Wand2, 
      description: 'GenAI text refinement',
      colorClass: 'plush-sage',
      textClass: 'text-[#1F2C18]',
      iconClass: 'embroidered-icon'
    },
    { 
      name: 'Model Comparison', 
      path: '/comparison', 
      icon: GitCompare, 
      description: 'Baseline vs Transformer',
      colorClass: 'plush-navy',
      textClass: 'text-[#FFFDF9]',
      iconClass: 'embroidered-icon-light'
    },
    { 
      name: 'Robustness Lab', 
      path: '/robustness', 
      icon: Flame, 
      description: 'Adversarial evasion benchmarks',
      colorClass: 'plush-orange',
      textClass: 'text-[#FFFDF9]',
      iconClass: 'embroidered-icon-light'
    },
    { 
      name: 'About & Research', 
      path: '/about', 
      icon: BookOpen, 
      description: 'Objectives & methodology',
      colorClass: 'plush-mustard',
      textClass: 'text-[#2A1B04]',
      iconClass: 'embroidered-icon'
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCF5]/95 backdrop-blur-md border-b-3 border-dashed border-[#9BAE83]/40 shadow-sm transition-all">

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & title: Soft Knitted Fur Cushion Emblem */}
          <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-hidden shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl plush-button plush-forest shrink-0 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 embroidered-icon-light" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#30312D] group-hover:text-[#435744] transition-colors">
                  AI-Guard
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 bg-[#9BAE83]/30 text-[#1F2C18] border-2 border-dashed border-[#9BAE83] rounded-full">
                  Forensics
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#30312D]/70 hidden md:block font-bold">
                Soft Knitted & Tactile Text Analysis
              </p>
            </div>
          </NavLink>

          {/* Desktop Nav Links as Plush Textile Controls */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `plush-button ${item.colorClass} ${item.textClass} px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-xs font-black transition-all ${
                      isActive
                        ? 'scale-105 shadow-lg ring-2 lg:ring-3 ring-white ring-offset-2 ring-offset-[#435744]/20 opacity-100 z-10'
                        : 'opacity-85 hover:opacity-100 hover:scale-102 shadow-xs'
                    }`
                  }
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${item.iconClass} shrink-0`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action / Plush Pipeline Indicator (Cozy Wool Cream) */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="plush-button plush-cream text-[#2D2F28] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 embroidered-icon" />
              <span>Ensemble Pipeline</span>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="w-10 h-10 rounded-xl plush-button plush-cream flex items-center justify-center shadow-xs"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 embroidered-icon" /> : <Menu className="w-5 h-5 embroidered-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer with backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/25 backdrop-blur-xs z-40 md:hidden animate-fadeIn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 md:hidden border-t-2 border-dashed border-[#435744]/20 bg-[#FFFDF8] px-4 pt-4 pb-6 space-y-2.5 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-dashed border-[#435744]/15">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#435744]">
                Navigation Menu
              </span>
              <div className="plush-button plush-cream text-[#2D2F28] px-2.5 py-1 rounded-full text-[10px] font-black shadow-2xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 embroidered-icon" />
                <span>HC3 Ensemble Pipeline</span>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-black transition-all plush-button ${item.colorClass} ${item.textClass} w-full justify-start ${
                    isActive
                      ? 'scale-101 ring-3 ring-white shadow-md'
                      : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${item.iconClass}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-sm">{item.name}</div>
                    <div className="text-xs opacity-80 font-medium">{item.description}</div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
}

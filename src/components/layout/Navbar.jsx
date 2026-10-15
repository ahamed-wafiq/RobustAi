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
  Sparkles
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & title: Soft Knitted Fur Cushion Emblem */}
          <NavLink to="/" className="flex items-center gap-3.5 group focus:outline-hidden">
            <div className="w-11 h-11 rounded-2xl plush-button plush-forest shrink-0 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 embroidered-icon-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#30312D] group-hover:text-[#435744] transition-colors">
                  AI-Guard
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#9BAE83]/30 text-[#1F2C18] border-2 border-dashed border-[#9BAE83] rounded-full">
                  Forensics
                </span>
              </div>
              <p className="text-xs text-[#30312D]/70 hidden sm:block font-bold">
                Soft Knitted & Tactile Text Analysis
              </p>
            </div>
          </NavLink>

          {/* Desktop Nav Links as Plush Textile Controls — Each with its Distinct Color */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `plush-button ${item.colorClass} ${item.textClass} px-4 py-2 rounded-full text-xs font-black transition-all ${
                      isActive
                        ? 'scale-106 shadow-lg ring-3 ring-white ring-offset-2 ring-offset-[#435744]/20 opacity-100 z-10'
                        : 'opacity-85 hover:opacity-100 hover:scale-103 shadow-xs'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action / Plush Pipeline Indicator (Cozy Wool Cream) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="plush-button plush-cream text-[#2D2F28] px-4 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 embroidered-icon" />
              <span>Ensemble Pipeline</span>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="w-11 h-11 rounded-2xl plush-button plush-cream flex items-center justify-center shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 embroidered-icon" /> : <Menu className="w-5 h-5 embroidered-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-dashed border-[#435744]/20 bg-[#FFFDF8] px-4 pt-4 pb-6 space-y-2.5 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-black transition-all plush-button ${item.colorClass} ${item.textClass} ${
                  isActive
                    ? 'scale-102 ring-3 ring-white shadow-md'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                </div>
                <div>
                  <div className="font-black text-sm">{item.name}</div>
                  <div className="text-xs opacity-80 font-medium">{item.description}</div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}

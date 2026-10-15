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
import FuzzyFurButton from '../common/FuzzyFurButton';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Text Detector', path: '/', icon: FileSearch, description: 'Analyze & inspect text' },
    { name: 'Model Comparison', path: '/comparison', icon: GitCompare, description: 'Baseline vs Transformer' },
    { name: 'Robustness Lab', path: '/robustness', icon: Flame, description: 'Adversarial evasion benchmarks' },
    { name: 'About & Research', path: '/about', icon: BookOpen, description: 'Objectives & methodology' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCF5]/95 backdrop-blur-md border-b-3 border-dashed border-[#9BAE83]/40 shadow-sm transition-all">

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & title: Circular Fluffy Fur Cushion Emblem */}
          <NavLink to="/" className="flex items-center gap-3.5 group focus:outline-hidden">
            <FuzzyFurButton
              size="sm"
              color="green"
              icon={ShieldCheck}
              iconColor="cream"
              className="pointer-events-none"
            />
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

          {/* Desktop Nav Links as Plush Textile Controls */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `plush-button px-4 py-2 text-xs font-black transition-all ${
                      isActive
                        ? 'plush-sage shadow-md'
                        : 'plush-cream hover:plush-sage text-[#30312D]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 embroidered-icon" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action / Plush Pipeline Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="plush-button plush-mustard px-4 py-1.5 text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 embroidered-icon" />
              <span>Ensemble Pipeline</span>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <FuzzyFurButton
              size="sm"
              color="cream"
              icon={mobileMenuOpen ? X : Menu}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              ariaLabel="Toggle navigation menu"
            />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-dashed border-[#435744]/20 bg-[#FFFDF8] px-4 pt-4 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                  isActive
                    ? 'plush-sage border-2 border-dashed border-[#9BAE83] shadow-sm'
                    : 'bg-[#F5EEDB] text-[#30312D] hover:bg-[#9BAE83]/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'plush-forest' : 'plush-cream'}`}>
                  <Icon className="w-4 h-4 embroidered-icon" />
                </div>
                <div>
                  <div className="font-black text-sm">{item.name}</div>
                  <div className="text-xs text-[#30312D]/70 font-medium">{item.description}</div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}

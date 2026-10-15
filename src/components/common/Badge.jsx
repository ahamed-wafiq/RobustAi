import React from 'react';

export default function Badge({ 
  children, 
  variant = 'sage', 
  size = 'md',
  className = '' 
}) {
  const variantStyles = {
    // New plush & textile semantic variants
    sage: 'bg-[#9BAE83]/30 text-[#2D3E24] border-[#9BAE83] shadow-xs',
    forest: 'bg-[#435744] text-[#FFFDF9] border-[#6E8357] shadow-xs',
    mustard: 'bg-[#E7B44F]/35 text-[#543A05] border-[#E7B44F] shadow-xs',
    orange: 'bg-[#E58B36]/30 text-[#6B2E05] border-[#E58B36] shadow-xs',
    navy: 'bg-[#343B59]/25 text-[#20253B] border-[#343B59] shadow-xs',
    charcoal: 'bg-[#30312D]/15 text-[#30312D] border-[#30312D]/40 shadow-xs',

    // Functional detector states
    connected: 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83] shadow-xs',
    degraded: 'bg-[#E7B44F]/35 text-[#543A05] border-[#E7B44F] shadow-xs',
    disconnected: 'bg-[#E58B36]/35 text-[#6B2E05] border-[#E58B36] shadow-xs',
    prototype: 'bg-[#343B59]/20 text-[#20253B] border-[#343B59]/50 shadow-xs',
    experimental: 'bg-[#E7B44F]/30 text-[#543A05] border-[#E7B44F] shadow-xs',
    simulated: 'bg-[#E58B36]/25 text-[#6B2E05] border-[#E58B36] shadow-xs',

    // Backward-compatible variants
    blue: 'bg-[#343B59]/20 text-[#20253B] border-[#343B59]/50',
    human: 'bg-[#9BAE83]/30 text-[#1F2C18] border-[#9BAE83]',
    ai: 'bg-[#E58B36]/30 text-[#6B2E05] border-[#E58B36]',
    warning: 'bg-[#E7B44F]/35 text-[#543A05] border-[#E7B44F]',
    neutral: 'bg-[#F5F0E6] text-[#30312D] border-[#435744]/30',
    indigo: 'bg-[#343B59]/20 text-[#20253B] border-[#343B59]/50',
    outline: 'bg-[#FFFCF5] text-[#30312D] border-[#435744]/40'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3.5 py-1 font-bold',
    lg: 'text-sm px-4 py-1.5 font-extrabold'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-dashed tracking-wide textile-badge transition-all ${variantStyles[variant] || variantStyles.sage} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

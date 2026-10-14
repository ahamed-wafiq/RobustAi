import React from 'react';

export default function Badge({ 
  children, 
  variant = 'blue', 
  size = 'md',
  className = '' 
}) {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    human: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ai: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    outline: 'bg-white text-slate-700 border-slate-300'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1 font-medium'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide transition-colors ${variantStyles[variant] || variantStyles.blue} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

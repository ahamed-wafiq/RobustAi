import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  unit = '', 
  subtitle, 
  icon: Icon, 
  badgeText, 
  badgeVariant = 'sage',
  accentColor = 'sage',
  className = ''
}) {
  const plushIconBg = {
    sage: 'plush-sage',
    forest: 'plush-forest',
    mustard: 'plush-mustard',
    orange: 'plush-orange',
    navy: 'plush-navy',
    slate: 'plush-cream',
    blue: 'plush-navy',
    emerald: 'plush-sage',
    rose: 'plush-orange',
    amber: 'plush-mustard'
  };

  const accentBorderColor = {
    sage: 'border-[#9BAE83]',
    forest: 'border-[#435744]',
    mustard: 'border-[#E7B44F]',
    orange: 'border-[#E58B36]',
    navy: 'border-[#343B59]',
    slate: 'border-[#30312D]/40',
    blue: 'border-[#343B59]',
    emerald: 'border-[#9BAE83]',
    rose: 'border-[#E58B36]',
    amber: 'border-[#E7B44F]'
  };

  return (
    <div className={`knitted-card knitted-card-interactive p-4 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#30312D]/60">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tracking-tight text-[#30312D]">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-bold text-[#30312D]/60">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`plush-circle-btn ${plushIconBg[accentColor] || 'plush-sage'} shadow-md`}>
            <Icon className="w-5 h-5 embroidered-icon" />
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#435744]/15 flex items-center justify-between text-xs text-[#30312D]/75">
          <span className="font-semibold text-[11px]">{subtitle}</span>
          {badgeText && (
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-[#30312D] bg-[#F5EEDB] px-2.5 py-0.5 rounded-full border border-dashed border-[#435744]/30 shadow-2xs">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

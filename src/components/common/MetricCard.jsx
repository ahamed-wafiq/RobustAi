import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  unit = '', 
  subtitle, 
  icon: Icon, 
  badgeText, 
  badgeVariant = 'neutral',
  accentColor = 'blue',
  className = ''
}) {
  const accentBorder = {
    blue: 'border-l-blue-600',
    indigo: 'border-l-indigo-600',
    emerald: 'border-l-emerald-600',
    rose: 'border-l-rose-500',
    amber: 'border-l-amber-500',
    slate: 'border-l-slate-400'
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 transition-all hover:shadow-md border-l-4 ${accentBorder[accentColor] || accentBorder.blue} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-slate-500">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badgeText && (
            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

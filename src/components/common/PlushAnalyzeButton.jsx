import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PlushAnalyzeButton({
  onClick,
  disabled = false,
  isAnalyzing = false,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      aria-label="Analyze text with AI-Guard"
      title="Analyze natural language passage with AI-Guard"
      className={`group relative inline-flex items-center gap-3 p-1 rounded-full cursor-pointer transition-all focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#9BAE83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F0E6] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* 3D Plush Fur Cushion with Embroidered Magnifying Glass */}
      <div className="relative w-13 h-13 sm:w-15 sm:h-15 shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-93 group-active:translate-y-1">
        <img
          src="/images/plush-analyze-button.png"
          alt="Realistic soft fluffy fur button with embroidered magnifying glass"
          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(48,49,45,0.25)] transition-all select-none pointer-events-none"
          draggable="false"
        />

        {/* Loading Spinner Overlay when analyzing */}
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-full backdrop-blur-xs">
            <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
          </div>
        )}
      </div>

      {/* Accompanying Plush Fur Label Pill */}
      <div className="plush-button plush-forest px-5 py-2.5 text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition-transform duration-200 group-hover:scale-103 group-active:scale-97">
        <Sparkles className="w-4 h-4 text-[#F7D487]" />
        <span>{isAnalyzing ? 'Knitting Analysis...' : 'Analyze Text'}</span>
      </div>
    </button>
  );
}

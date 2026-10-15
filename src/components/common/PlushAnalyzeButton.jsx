import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * PlushAnalyzeButton - Tactile 3D Plush Fur Primary Action Button
 * Wide capsule/pill button styled in rich dense forest-green faux fur
 * with visible radiating edge fibers, soft cushion bevel, and embroidered text.
 */
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
      className={`plush-button plush-forest px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black shadow-lg flex items-center gap-2.5 transition-all duration-200 hover:scale-103 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAnalyzing ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        <Sparkles className="w-4 h-4 text-[#F7D487] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]" />
      )}
      <span className="tracking-wide">
        {isAnalyzing ? 'Knitting Analysis...' : 'Analyze Text'}
      </span>
      {!isAnalyzing && (
        <ArrowRight className="w-3.5 h-3.5 text-white/70" />
      )}
    </button>
  );
}

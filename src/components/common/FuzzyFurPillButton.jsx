import React from 'react';

/**
 * FuzzyFurPillButton - Capsule / Pill Plush Fur Button Component
 * Recreates the wide fuzzy capsule controls from the user's reference image:
 * - Thick, fluffy fur cushion with soft hair fibers radiating along the edge
 * - Embroidered dark / gold / white centered text and icons
 * - Tactile physics: soft squish on press, float on hover
 */

export default function FuzzyFurPillButton({
  icon: Icon,
  children,
  onClick,
  active = false,
  disabled = false,
  variant = 'cream', // 'cream' | 'forest' | 'mustard' | 'navy' | 'red'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  title,
  ariaLabel,
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[38px]',
    md: 'px-5 py-2.5 text-xs sm:text-sm min-h-[44px]',
    lg: 'px-6 py-3.5 text-sm sm:text-base min-h-[50px]',
  }[size] || 'px-5 py-2.5 text-xs sm:text-sm min-h-[44px]';

  const variantClasses = {
    cream: 'plush-cream text-[#2A2C27]',
    forest: 'plush-forest text-[#FFFDF9]',
    mustard: 'plush-mustard text-[#2D220A]',
    navy: 'plush-navy text-[#FFFDF9]',
    red: 'plush-orange text-[#FFFDF9]',
  }[variant] || 'plush-cream text-[#2A2C27]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      className={`group plush-button relative inline-flex items-center justify-center gap-2 rounded-full font-black select-none cursor-pointer focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ${variantClasses} ${sizeClasses} ${
        active ? 'scale-104 shadow-lg ring-2 ring-white/60' : ''
      } ${className}`}
    >
      {Icon && (
        <Icon
          className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 embroidered-icon"
          strokeWidth={2.4}
        />
      )}
      <span className="relative z-10 tracking-wide">{children}</span>
    </button>
  );
}

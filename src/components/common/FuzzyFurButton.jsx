import React from 'react';

/**
 * FuzzyFurButton - 3D Realistic Plush Fur Button Component
 * Accurately reproduces the iOS Control Center furry button aesthetic from user reference:
 * - Dense, soft faux fur with visible hair fibers radiating around the perimeter
 * - Stitched / stamped embroidered dark textile icons
 * - Available in 5 signature colorways: cream, green, mustard, navy, red
 * - Tactile physics: soft squish on press, float on hover
 */

const FUR_ASSETS = {
  cream: '/images/fur-button-cream.png',
  green: '/images/fur-button-green.png',
  mustard: '/images/fur-button-mustard.png',
  navy: '/images/fur-button-navy.png',
  red: '/images/fur-button-red.png',
};

const SIZE_MAP = {
  xs: {
    container: 'w-9 h-9',
    iconSize: 'w-4 h-4',
  },
  sm: {
    container: 'w-11 h-11',
    iconSize: 'w-5 h-5',
  },
  md: {
    container: 'w-14 h-14',
    iconSize: 'w-6 h-6',
  },
  lg: {
    container: 'w-16 h-16 sm:w-18 sm:h-18',
    iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
  },
  xl: {
    container: 'w-20 h-20 sm:w-24 sm:h-24',
    iconSize: 'w-9 h-9 sm:w-10 sm:h-10',
  },
};

export default function FuzzyFurButton({
  icon: Icon,
  label,
  color = 'cream',
  size = 'md',
  active = false,
  disabled = false,
  onClick,
  title,
  ariaLabel,
  iconColor = 'dark', // 'dark' | 'cream' | 'gold' | 'currentColor'
  className = '',
  children,
}) {
  const furImage = FUR_ASSETS[color] || FUR_ASSETS.cream;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  // Embroidered icon styling depending on contrast
  let iconClass = 'text-[#191B18] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] drop-shadow-[0_-1px_0_rgba(0,0,0,0.5)]';
  if (iconColor === 'cream') {
    iconClass = 'text-[#FFFDF5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] drop-shadow-[0_-1px_0_rgba(255,255,255,0.4)]';
  } else if (iconColor === 'gold') {
    iconClass = 'text-[#FBD38D] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] drop-shadow-[0_-1px_0_rgba(255,255,255,0.4)]';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || ariaLabel || label}
      aria-label={ariaLabel || label || title}
      className={`group relative inline-flex flex-col items-center justify-center cursor-pointer select-none focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed transition-transform duration-200 ${className}`}
    >
      {/* 3D Circular Plush Fur Cushion */}
      <div
        className={`relative ${sizeConfig.container} shrink-0 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-108 group-hover:-translate-y-1 group-active:scale-92 group-active:translate-y-1 ${
          active ? 'scale-105 filter drop-shadow-[0_6px_14px_rgba(43,62,45,0.35)]' : ''
        }`}
      >
        {/* Photorealistic Dense Fur Texture with Soft Rim Fibers */}
        <img
          src={furImage}
          alt=""
          role="presentation"
          draggable="false"
          className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(30,32,28,0.22)] select-none pointer-events-none transition-transform duration-200"
        />

        {/* Active Pill Ring Indicator for Selected States */}
        {active && (
          <div className="absolute inset-0.5 rounded-full border-2 border-white/70 pointer-events-none animate-pulse" />
        )}

        {/* Center Stitched / Embroidered Icon */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          {Icon && (
            <Icon
              className={`${sizeConfig.iconSize} ${iconClass} transition-transform duration-150 group-hover:scale-105`}
              strokeWidth={2.4}
            />
          )}
          {children}
        </div>
      </div>

      {/* Optional Caption Label beneath the button */}
      {label && (
        <span
          className={`mt-1.5 text-[11px] font-black tracking-wide text-[#30312D] text-center transition-colors ${
            active ? 'text-[#435744] font-extrabold' : 'group-hover:text-[#435744]'
          }`}
        >
          {label}
        </span>
      )}
    </button>
  );
}

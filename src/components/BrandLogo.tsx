import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  variant?: 'matcha' | 'strawberry' | 'orange' | 'white';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 28,
  variant = 'matcha',
}) => {
  const isWhite = variant === 'white';
  const isStrawberry = variant === 'strawberry';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label="ZReview Z Logo"
    >
      <defs>
        {/* Matcha Gradient */}
        <linearGradient id="zarvisBrandZMatcha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A8442" />
          <stop offset="100%" stopColor="#254820" />
        </linearGradient>

        {/* Strawberry Gradient */}
        <linearGradient id="zarvisBrandZStrawberry" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7AA6" />
          <stop offset="100%" stopColor="#D92868" />
        </linearGradient>
      </defs>

      {/* Modern, razor-sharp architectural Z glyph */}
      <path
        d="M5 6H24.5L27 8.5V11.2H16.2L24.8 20.8H27V26H7.5L5 23.5V20.8H15.8L7.2 11.2H5V6Z"
        fill={
          isWhite
            ? '#ffffff'
            : isStrawberry
            ? 'url(#zarvisBrandZStrawberry)'
            : 'url(#zarvisBrandZMatcha)'
        }
      />
      {/* Precision architectural specular highlight line */}
      <path
        d="M24.5 6L27 8.5M7.5 26L5 23.5"
        stroke={
          isWhite
            ? 'rgba(255,255,255,0.6)'
            : isStrawberry
            ? '#FFD0E0'
            : '#BCE0B6'
        }
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

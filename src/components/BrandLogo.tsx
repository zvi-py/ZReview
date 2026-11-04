import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  variant?: 'pink' | 'strawberry' | 'matcha' | 'orange' | 'white';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 28,
}) => {
  return (
    <img
      src="/assets/aistudio/image_609bb21a.png"
      alt="ZReview Logo"
      width={size}
      height={size}
      className={`shrink-0 object-contain drop-shadow-xs transition-transform ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

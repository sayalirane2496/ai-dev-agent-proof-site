'use client';

import React from 'react';

interface FoodTypeBadgeProps {
  isVeg: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FoodTypeBadge: React.FC<FoodTypeBadgeProps> = ({ isVeg, className = '', size = 'md' }) => {
  const sizeMap = {
    sm: { box: 'w-3.5 h-3.5 border-[1.5px]', inner: 'w-1.5 h-1.5' },
    md: { box: 'w-4 h-4 border-2', inner: 'w-2 h-2' },
    lg: { box: 'w-5 h-5 border-2', inner: 'w-2.5 h-2.5' },
  };

  const currentSize = sizeMap[size];

  if (isVeg) {
    return (
      <span
        title="100% Vegetarian"
        className={`inline-flex items-center justify-center rounded-[3px] border-[#008738] bg-white ${currentSize.box} ${className}`}
        aria-label="Vegetarian"
      >
        <span className={`rounded-full bg-[#008738] ${currentSize.inner}`} />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center rounded-[3px] border-[#B91C1C] bg-white ${currentSize.box} ${className}`}
      aria-label="Non-Vegetarian"
    >
      <span
        className={`border-b-[#B91C1C] border-l-transparent border-r-transparent ${
          size === 'sm'
            ? 'w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px]'
            : size === 'md'
            ? 'w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px]'
            : 'w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px]'
        }`}
      />
    </span>
  );
};

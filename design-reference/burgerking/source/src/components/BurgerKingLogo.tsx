import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BurgerKingLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none cursor-pointer ${className}`}>
      {/* Flame Bun Crown SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        className={`${heights[size]} w-auto aspect-square drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Toasted Bun */}
        <path
          d="M12 40C12 21 28 8 50 8C72 8 88 21 88 40C88 42 86 44 83 44H17C14 44 12 42 12 40Z"
          fill="#F5A623"
        />
        {/* Flame grill highlight on bun */}
        <path
          d="M26 26C34 16 66 16 74 26"
          stroke="#E08300"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Sesame seeds */}
        <circle cx="36" cy="22" r="2" fill="#FFF9E6" />
        <circle cx="50" cy="18" r="2" fill="#FFF9E6" />
        <circle cx="64" cy="22" r="2" fill="#FFF9E6" />

        {/* Central Bold Red Patty Band with BK Crown Text */}
        <path
          d="M8 48C8 46 10 44 12 44H88C90 44 92 46 92 48V52C92 54 90 56 88 56H12C10 56 8 54 8 52V48Z"
          fill="#D62300"
        />
        {/* Melting Cheddar Cheese Accent */}
        <path
          d="M14 56L22 62L32 56L42 63L52 56L66 64L76 56L86 61L86 56H14Z"
          fill="#FFB703"
        />

        {/* Bottom Bun */}
        <path
          d="M16 63H84C86 63 88 65 88 67C88 83 72 92 50 92C28 92 12 83 12 67C12 65 14 63 16 63Z"
          fill="#F5A623"
        />

        {/* Crown Emblem in the heart */}
        <path
          d="M40 50L45 46L50 50L55 46L60 50V53H40V50Z"
          fill="#FFFFFF"
        />
      </svg>

      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-tighter text-[#D62300] font-display text-xl md:text-2xl uppercase">
          BURGER KING
        </span>
        <span className="text-[9px] md:text-[10px] tracking-widest font-bold text-[#ED7117] uppercase flex items-center gap-1">
          <span>INDIA</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#008738]" />
          <span className="text-[#59483F] font-semibold text-[8px]">EST. 1954</span>
        </span>
      </div>
    </div>
  );
};

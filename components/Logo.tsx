import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 120, height = 32 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Smakowało logo"
    >
      {/* Refined low-key leaf — natural, not corporate */}
      <path
        d="M6 9 Q11 3 17 9 Q12 18 6 25 Q2 17 6 9"
        fill="#15803d"
      />
      <path
        d="M9 11 Q13 15 9 21"
        stroke="#14532d"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Elegant "Smakowało" — Playfair style */}
      <text
        x="23"
        y="21"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="17"
        fontWeight="600"
        fill="#14532d"
        letterSpacing="-0.6"
      >
        Smakowało
      </text>
      {/* Poznań tag — subtle, low-key */}
      <text
        x="23"
        y="29"
        fontFamily="Space Grotesk, system-ui, sans-serif"
        fontSize="5.5"
        fill="#6b7280"
        letterSpacing="1"
      >
        POZNAŃ + OKOLICE
      </text>
    </svg>
  );
}


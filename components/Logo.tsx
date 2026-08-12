import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 168, height = 45 }: LogoProps) {
  return (
    <img
      src="/logo-smakowalo.svg"
      alt="Smakowało"
      width={width}
      height={height}
      className={className}
      style={{ width: 'auto', height, maxWidth: '100%' }}
    />
  );
}

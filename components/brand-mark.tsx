'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md';
}

export function BrandMark({ size = 'md' }: BrandMarkProps) {
  const dimensions = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
  const baseId = useId().replace(/:/g, '');
  const fillId = `${baseId}-fill`;
  const glowId = `${baseId}-glow`;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: -2 }}
      className={`${dimensions} relative flex items-center justify-center rounded-xl bg-foreground text-background shadow-lg shadow-primary/20`}
      aria-label="Subscription Tracker"
    >
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={fillId} x1="14" y1="8" x2="52" y2="56">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="0.52" stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <radialGradient id={glowId} cx="28" cy="18" r="38">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.42" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill={`url(#${fillId})`} />
        <rect width="64" height="64" rx="16" fill={`url(#${glowId})`} />
        <path
          d="M49 19.5C44.5 13.8 34.8 11.8 27.9 15.2C21.8 18.2 21 24.7 26 28.1C29.3 30.4 35.4 30.8 39 32.9C43.9 35.8 41.5 43 33.5 43.8C27.9 44.3 22.6 42.2 19 38.1"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M15 46C23.3 53.2 43.2 52.1 50.6 39.8"
          fill="none"
          stroke="#cffafe"
          strokeLinecap="round"
          strokeOpacity="0.9"
          strokeWidth="2.6"
        />
        <path
          d="M44 16L50 19.2L44.4 22.9"
          fill="none"
          stroke="#cffafe"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
        <rect
          x="17"
          y="17"
          width="14"
          height="9"
          rx="2.5"
          fill="#0f172a"
          fillOpacity="0.32"
        />
        <path
          d="M20 21H28"
          stroke="white"
          strokeLinecap="round"
          strokeOpacity="0.85"
          strokeWidth="1.7"
        />
        <circle cx="48" cy="47" r="3.5" fill="#cffafe" />
      </svg>
    </motion.div>
  );
}

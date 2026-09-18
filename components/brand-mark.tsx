'use client';

import { motion } from 'framer-motion';

interface BrandMarkProps {
  size?: 'sm' | 'md';
}

export function BrandMark({ size = 'md' }: BrandMarkProps) {
  const dimensions = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: -2 }}
      className={`${dimensions} relative overflow-hidden rounded-xl shadow-lg shadow-primary/20`}
      aria-label="Sync Board"
    >
      <img
        src="/sync-board-logo.png"
        alt="Sync Board logo"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

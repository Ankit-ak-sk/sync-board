'use client';

import { motion } from 'framer-motion';
import React from 'react';

type SecondaryButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(({ children, isLoading = false, icon, className = '', ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-lg font-semibold text-sm
        border-2 border-input bg-background text-foreground
        hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
        transition-smooth focus-ring
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full"
        />
      )}
      {icon && !isLoading && icon}
      <span>{children}</span>
    </motion.button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

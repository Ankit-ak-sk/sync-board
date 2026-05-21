'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface StatsCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  change,
  description,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-xl border border-border
        bg-card p-6 transition-smooth
        ${className}
      `}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" />

      <div className="relative z-10 flex flex-col gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">
              {value}
            </h3>
            {change && (
              <span
                className={`
                  text-xs font-semibold px-2 py-1 rounded-md
                  ${
                    change.isPositive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                  }
                `}
              >
                {change.isPositive ? '+' : '-'}
                {Math.abs(change.value)}%
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;

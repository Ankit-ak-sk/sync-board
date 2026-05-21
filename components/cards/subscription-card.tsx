'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Trash2, Edit2, Eye } from 'lucide-react';
import React, { useState } from 'react';

export interface Subscription {
  id: string;
  name: string;
  category: string;
  cost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  nextBillingDate: string;
  icon?: string;
  isActive: boolean;
  startedDate?: string;
  paymentMethod?: string;
  reminderDays?: number;
  notes?: string;
  website?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
      productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
      storage: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-100',
      social: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100',
      analytics: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
      music: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100',
      shopping: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
      food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100',
      fitness: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100',
      learning: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[category] || colors.other;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      role="button"
      tabIndex={0}
      onClick={() => onView?.(subscription.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onView?.(subscription.id);
        }
      }}
      className={`
        group relative rounded-xl border border-border
        bg-card p-5 transition-smooth hover:shadow-lg cursor-pointer
        hover:border-accent/30 ${!subscription.isActive ? 'opacity-60' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {subscription.icon && (
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg">
              {subscription.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {subscription.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  text-xs font-semibold px-2 py-1 rounded-md capitalize
                  ${getCategoryColor(subscription.category)}
                `}
              >
                {subscription.category}
              </span>
              {!subscription.isActive && (
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(event) => {
              event.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label={`Open actions for ${subscription.name}`}
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-10 z-20 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => {
                  onView?.(subscription.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => {
                  onEdit?.(subscription.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(subscription.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-smooth flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {subscription.currency}
            {subscription.cost.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {subscription.billingCycle === 'monthly'
              ? '/mo'
              : subscription.billingCycle === 'yearly'
                ? '/yr'
                : 'one-time'}
          </span>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;

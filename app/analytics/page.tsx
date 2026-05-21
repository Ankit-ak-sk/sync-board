'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/app-layout';
import { StatsCard } from '@/components/cards/stats-card';
import { Subscription } from '@/components/cards/subscription-card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Target, AlertCircle, IndianRupee } from 'lucide-react';
import {
  initialIndianSubscriptions,
  subscriptionStorageKey,
} from '@/lib/subscriptions';

const COLORS = [
  'var(--color-primary)',
  'var(--color-accent)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AnalyticsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    initialIndianSubscriptions,
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(subscriptionStorageKey);
      if (stored) {
        setSubscriptions(JSON.parse(stored));
      }
    } catch {
      setSubscriptions(initialIndianSubscriptions);
    }
  }, []);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((subscription) => subscription.isActive),
    [subscriptions],
  );

  const getMonthlyEquivalent = (subscription: Subscription) => {
    if (subscription.billingCycle === 'yearly') return subscription.cost / 12;
    if (subscription.billingCycle === 'one-time') return 0;
    return subscription.cost;
  };

  const totalMonthly = activeSubscriptions.reduce(
    (sum, subscription) => sum + getMonthlyEquivalent(subscription),
    0,
  );
  const totalYearly = totalMonthly * 12;
  const inactiveSubscriptions = subscriptions.filter(
    (subscription) => !subscription.isActive,
  );
  const potentialSavings = inactiveSubscriptions.reduce(
    (sum, subscription) =>
      sum +
      (subscription.billingCycle === 'yearly'
        ? subscription.cost
        : subscription.cost * 12),
    0,
  );
  const mostExpensive = activeSubscriptions
    .slice()
    .sort((a, b) => getMonthlyEquivalent(b) - getMonthlyEquivalent(a))[0];
  const categoryData = Object.entries(
    activeSubscriptions.reduce<Record<string, number>>((groups, subscription) => {
      const label =
        subscription.category[0].toUpperCase() + subscription.category.slice(1);
      groups[label] = (groups[label] ?? 0) + getMonthlyEquivalent(subscription);
      return groups;
    }, {}),
  ).map(([name, value]) => ({
    name,
    value,
    percentage: totalMonthly > 0 ? Math.round((value / totalMonthly) * 100) : 0,
  }));
  const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
    (month, index) => ({
      month,
      amount: Math.round(totalMonthly + (index - 2) * 42),
    }),
  );

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-foreground mb-1">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights about your subscription spending
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatsCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Monthly Spend"
            value={`₹${totalMonthly.toFixed(0)}`}
            change={{ value: 13, isPositive: false }}
            description="Average per month"
          />

          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Annual Spend"
            value={`₹${totalYearly.toFixed(0)}`}
            description="Projected annual cost"
          />

          <StatsCard
            icon={<Target className="w-5 h-5" />}
            label="Savings Potential"
            value={`₹${potentialSavings.toFixed(0)}`}
            change={{ value: 20, isPositive: true }}
            description="By removing unused"
          />

          <StatsCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Most Expensive"
            value={mostExpensive?.name ?? 'None'}
            description={
              mostExpensive
                ? `₹${getMonthlyEquivalent(mostExpensive).toFixed(0)}/month`
                : 'No active services'
            }
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Spending by Category */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name} ${percentage}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${Number(value).toFixed(0)}`}
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Monthly Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => `₹${Number(value).toFixed(0)}`}
                />
                <Bar
                  dataKey="amount"
                  fill="var(--color-primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Insight 1 */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Category Shift</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Entertainment and food memberships make up most recurring India
              subscriptions this month
            </p>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-accent">
                OTT and food plans leading spend
              </p>
            </div>
          </div>

          {/* Top Insight 2 */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Unused Services</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You have {inactiveSubscriptions.length} inactive subscription
              {inactiveSubscriptions.length === 1 ? '' : 's'} that could be
              removed to avoid accidental renewals
            </p>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-destructive">
                Potential savings: ₹{potentialSavings.toFixed(0)}/year
              </p>
            </div>
          </div>

          {/* Top Insight 3 */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Billing Cycles</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeSubscriptions.length} active India subscriptions are being
              tracked across OTT, food, music, shopping, and fitness
            </p>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-primary">
                Next renewal in 3 days
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

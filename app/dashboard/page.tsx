'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatsCard } from '@/components/cards/stats-card';
import { SubscriptionCard, Subscription } from '@/components/cards/subscription-card';
import { PrimaryButton } from '@/components/buttons/primary-button';
import { SubscriptionModal } from '@/components/subscriptions/subscription-modal';
import {
  initialIndianSubscriptions,
  subscriptionStorageKey,
} from '@/lib/subscriptions';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const chartData = [
  { month: 'Jan', spent: 2450, projected: 2600 },
  { month: 'Feb', spent: 2599, projected: 2700 },
  { month: 'Mar', spent: 2599, projected: 2700 },
  { month: 'Apr', spent: 2798, projected: 2900 },
  { month: 'May', spent: 2798, projected: 2900 },
  { month: 'Jun', spent: 2947, projected: 3050 },
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

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialIndianSubscriptions);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(subscriptionStorageKey);
      if (stored) {
        setSubscriptions(JSON.parse(stored));
      }
    } catch {
      setSubscriptions(initialIndianSubscriptions);
    }
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(
      subscriptionStorageKey,
      JSON.stringify(subscriptions),
    );
  }, [hasLoadedStorage, subscriptions]);

  const totalMonthly = subscriptions
    .filter((s) => s.isActive && s.billingCycle === 'monthly')
    .reduce((acc, s) => acc + s.cost, 0);

  const totalYearly = subscriptions
    .filter((s) => s.isActive && s.billingCycle === 'yearly')
    .reduce((acc, s) => acc + s.cost, 0);

  const activeCount = subscriptions.filter((s) => s.isActive).length;
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.isActive);
  const selectedSubscription = subscriptions.find(
    (subscription) => subscription.id === selectedId,
  );
  const nextBilling = activeSubscriptions
    .slice()
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime(),
    )[0];
  const highestMonthly = activeSubscriptions
    .filter((subscription) => subscription.billingCycle === 'monthly')
    .slice()
    .sort((a, b) => b.cost - a.cost)[0];

  const openModal = (mode: 'view' | 'add' | 'edit', id?: string) => {
    setModalMode(mode);
    setSelectedId(id ?? null);
    setModalOpen(true);
  };

  const saveSubscription = (subscription: Subscription) => {
    setSubscriptions((current) => {
      const exists = current.some((item) => item.id === subscription.id);
      if (exists) {
        return current.map((item) =>
          item.id === subscription.id ? subscription : item,
        );
      }

      return [subscription, ...current];
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((current) =>
      current.filter((subscription) => subscription.id !== id),
    );
    setSelectedId(null);
    setModalOpen(false);
  };

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and track all your subscriptions
              </p>
            </div>
            <PrimaryButton onClick={() => openModal('add')}>
              <Plus className="w-5 h-5" />
              Add Subscription
            </PrimaryButton>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatsCard
            icon={<CreditCard className="w-5 h-5" />}
            label="Monthly Cost"
            value={`₹${totalMonthly.toFixed(0)}`}
            change={{ value: 8, isPositive: false }}
            description="Total recurring charges"
          />

          <StatsCard
            icon={<Calendar className="w-5 h-5" />}
            label="Yearly Cost"
            value={`₹${(totalMonthly * 12 + totalYearly).toFixed(0)}`}
            change={{ value: 5, isPositive: true }}
            description="Projected annual spend"
          />

          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Active Services"
            value={activeCount}
            description={`${activeCount} subscriptions tracked`}
          />

          <StatsCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Next Billing"
            value={
              nextBilling
                ? new Date(nextBilling.nextBillingDate).toLocaleDateString(
                    undefined,
                    { month: 'short', day: 'numeric' },
                  )
                : 'None'
            }
            description={nextBilling ? `${nextBilling.name} renewal` : 'No active renewals'}
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Trend */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Spending Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: '0.5rem',
                  }}
                  cursor={{ stroke: 'var(--color-accent)', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Highest Monthly Cost
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {highestMonthly
                      ? `${highestMonthly.currency}${highestMonthly.cost.toFixed(2)}`
                      : '$0.00'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {highestMonthly?.name ?? 'No monthly services'}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Potential Savings
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹1,788
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by removing inactive plans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscriptions List */}
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Subscriptions
            </h2>
            <p className="text-muted-foreground">
              Manage your active subscriptions and billing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onView={(id) => openModal('view', id)}
                onEdit={(id) => openModal('edit', id)}
                onDelete={deleteSubscription}
              />
            ))}
          </div>
        </motion.div>

        <SubscriptionModal
          open={modalOpen}
          mode={modalMode}
          subscription={selectedSubscription}
          onOpenChange={setModalOpen}
          onSave={saveSubscription}
          onDelete={deleteSubscription}
          onRequestEdit={(id) => openModal('edit', id)}
        />
      </motion.div>
    </AppLayout>
  );
}

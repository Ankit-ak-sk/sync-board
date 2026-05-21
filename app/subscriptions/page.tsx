'use client';

import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { SubscriptionCard, Subscription } from '@/components/cards/subscription-card';
import { PrimaryButton } from '@/components/buttons/primary-button';
import { SubscriptionModal } from '@/components/subscriptions/subscription-modal';
import {
  initialIndianSubscriptions,
  subscriptionCategories,
  subscriptionStorageKey,
} from '@/lib/subscriptions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const filtered = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || sub.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [subscriptions, searchTerm, selectedCategory]);

  const selectedSubscription = useMemo(
    () => subscriptions.find((subscription) => subscription.id === selectedId),
    [subscriptions, selectedId],
  );

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
                Subscriptions
              </h1>
              <p className="text-muted-foreground">
                All your subscriptions in one place
              </p>
            </div>
            <PrimaryButton onClick={() => openModal('add')}>
              <Plus className="w-5 h-5" />
              Add New
            </PrimaryButton>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex gap-2">
              {subscriptionCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-smooth
                    ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div variants={itemVariants} className="text-sm text-muted-foreground">
          Showing {filtered.length} subscription
          {filtered.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </motion.div>

        {/* Subscriptions Grid */}
        {filtered.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((subscription) => (
              <motion.div
                key={subscription.id}
                variants={itemVariants}
                layout
              >
                <SubscriptionCard
                  subscription={subscription}
                  onView={(id) => openModal('view', id)}
                  onEdit={(id) => openModal('edit', id)}
                  onDelete={deleteSubscription}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No subscriptions found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <PrimaryButton
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Search
            </PrimaryButton>
          </motion.div>
        )}

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

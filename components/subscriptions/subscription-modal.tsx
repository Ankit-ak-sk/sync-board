'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  ExternalLink,
  Pencil,
  Save,
  Trash2,
} from 'lucide-react';
import { Subscription } from '@/components/cards/subscription-card';
import { PrimaryButton } from '@/components/buttons/primary-button';
import { SecondaryButton } from '@/components/buttons/secondary-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalMode = 'view' | 'add' | 'edit';

interface SubscriptionModalProps {
  open: boolean;
  mode: ModalMode;
  subscription?: Subscription | null;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
  onRequestEdit?: (id: string) => void;
}

const emptySubscription: Subscription = {
  id: '',
  name: '',
  category: 'entertainment',
  cost: 0,
  currency: '₹',
  billingCycle: 'monthly',
  nextBillingDate: new Date().toISOString().slice(0, 10),
  icon: '📦',
  isActive: true,
  startedDate: new Date().toISOString().slice(0, 10),
  paymentMethod: 'UPI autopay',
  reminderDays: 3,
  notes: '',
  website: '',
};

const categoryOptions = [
  'entertainment',
  'music',
  'shopping',
  'food',
  'fitness',
  'learning',
  'other',
];

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-smooth focus:ring-2 focus:ring-ring';

export function SubscriptionModal({
  open,
  mode,
  subscription,
  onOpenChange,
  onSave,
  onDelete,
  onRequestEdit,
}: SubscriptionModalProps) {
  const [draft, setDraft] = useState<Subscription>(emptySubscription);
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;

    setDraft(subscription ?? { ...emptySubscription, id: crypto.randomUUID() });
  }, [open, subscription]);

  const monthlyCost = useMemo(() => {
    if (draft.billingCycle === 'yearly') return draft.cost / 12;
    if (draft.billingCycle === 'one-time') return 0;
    return draft.cost;
  }, [draft.billingCycle, draft.cost]);

  const annualCost = useMemo(() => {
    if (draft.billingCycle === 'yearly') return draft.cost;
    if (draft.billingCycle === 'one-time') return draft.cost;
    return draft.cost * 12;
  }, [draft.billingCycle, draft.cost]);

  const updateDraft = <K extends keyof Subscription>(
    key: K,
    value: Subscription[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;

    onSave({
      ...draft,
      name: draft.name.trim(),
      category: draft.category || 'other',
      cost: Number(draft.cost) || 0,
      reminderDays: Number(draft.reminderDays) || 0,
    });
    onOpenChange(false);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-2xl">
              {draft.icon || '📦'}
            </span>
            {mode === 'add' ? 'Add subscription' : draft.name || 'Subscription'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view'
              ? 'Review billing, renewal, and service details.'
              : 'Keep every renewal, payment, and reminder detail up to date.'}
          </DialogDescription>
        </DialogHeader>

        {isReadOnly ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <DollarSign className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">
                  Monthly impact
                </p>
                <p className="text-2xl font-bold">
                  {draft.currency}
                  {monthlyCost.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <Calendar className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">
                  Next billing
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(draft.nextBillingDate)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <Bell className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">
                  Reminder
                </p>
                <p className="text-lg font-semibold">
                  {draft.reminderDays ?? 0} days before
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Category" value={draft.category} />
              <Detail label="Billing cycle" value={draft.billingCycle} />
              <Detail label="Annual spend" value={`${draft.currency}${annualCost.toFixed(2)}`} />
              <Detail label="Payment method" value={draft.paymentMethod || 'Not set'} />
              <Detail label="Started" value={draft.startedDate ? formatDate(draft.startedDate) : 'Not set'} />
              <Detail label="Status" value={draft.isActive ? 'Active' : 'Inactive'} />
            </div>

            {draft.website && (
              <a
                href={draft.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open subscription website
              </a>
            )}

            {draft.notes && (
              <div className="rounded-lg border border-border p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="text-sm leading-6 text-foreground">{draft.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => updateDraft('name', event.target.value)}
                placeholder="JioHotstar Premium"
              />
            </Field>
            <Field label="Icon">
              <input
                className={inputClass}
                value={draft.icon ?? ''}
                onChange={(event) => updateDraft('icon', event.target.value)}
                placeholder="🎬"
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(event) => updateDraft('category', event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category[0].toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Billing cycle">
              <select
                className={inputClass}
                value={draft.billingCycle}
                onChange={(event) =>
                  updateDraft(
                    'billingCycle',
                    event.target.value as Subscription['billingCycle'],
                  )
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </select>
            </Field>
            <Field label="Cost">
              <input
                className={inputClass}
                min="0"
                step="0.01"
                type="number"
                value={draft.cost}
                onChange={(event) => updateDraft('cost', Number(event.target.value))}
              />
            </Field>
            <Field label="Currency">
              <select
                className={inputClass}
                value={draft.currency}
                onChange={(event) => updateDraft('currency', event.target.value)}
              >
                <option value="₹">₹ INR</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
              </select>
            </Field>
            <Field label="Next billing date">
              <input
                className={inputClass}
                type="date"
                value={draft.nextBillingDate}
                onChange={(event) => updateDraft('nextBillingDate', event.target.value)}
              />
            </Field>
            <Field label="Started date">
              <input
                className={inputClass}
                type="date"
                value={draft.startedDate ?? ''}
                onChange={(event) => updateDraft('startedDate', event.target.value)}
              />
            </Field>
            <Field label="Payment method">
              <input
                className={inputClass}
                value={draft.paymentMethod ?? ''}
                onChange={(event) => updateDraft('paymentMethod', event.target.value)}
                placeholder="Personal card"
              />
            </Field>
            <Field label="Reminder days">
              <input
                className={inputClass}
                min="0"
                type="number"
                value={draft.reminderDays ?? 0}
                onChange={(event) =>
                  updateDraft('reminderDays', Number(event.target.value))
                }
              />
            </Field>
            <Field label="Website" className="sm:col-span-2">
              <input
                className={inputClass}
                value={draft.website ?? ''}
                onChange={(event) => updateDraft('website', event.target.value)}
                placeholder="https://example.com"
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-24 resize-none`}
                value={draft.notes ?? ''}
                onChange={(event) => updateDraft('notes', event.target.value)}
                placeholder="Renewal terms, cancellation notes, shared users..."
              />
            </Field>
            <label className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium sm:col-span-2">
              <input
                checked={draft.isActive}
                type="checkbox"
                onChange={(event) => updateDraft('isActive', event.target.checked)}
              />
              Active subscription
            </label>
          </div>
        )}

        <DialogFooter className="gap-2">
          {mode === 'view' && subscription ? (
            <>
              {onDelete && (
                <SecondaryButton
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => {
                    onDelete(subscription.id);
                    onOpenChange(false);
                  }}
                >
                  Delete
                </SecondaryButton>
              )}
              <PrimaryButton
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => onRequestEdit?.(subscription.id)}
              >
                Edit
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton
              disabled={!draft.name.trim()}
              icon={mode === 'add' ? <CreditCard className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              onClick={handleSave}
            >
              {mode === 'add' ? 'Add subscription' : 'Save changes'}
            </PrimaryButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`space-y-2 text-sm font-medium ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="capitalize text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

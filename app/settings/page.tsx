'use client';

import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/app-layout';
import { PrimaryButton } from '@/components/buttons/primary-button';
import { SecondaryButton } from '@/components/buttons/secondary-button';
import { Bell, Lock, User, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearDemoSession } from '@/lib/auth';

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

export default function SettingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
  });

  const handleSignOut = () => {
    clearDemoSession();
    router.replace('/auth/login');
  };

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-foreground mb-1">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="user@example.com"
                disabled
                className="w-full px-4 py-3 rounded-lg border border-input bg-muted text-foreground disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your email address is used for login and notifications
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <PrimaryButton>Save Changes</PrimaryButton>
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'email',
                label: 'Email Notifications',
                description: 'Get notified via email about upcoming renewals and billing',
              },
              {
                id: 'push',
                label: 'Push Notifications',
                description: 'Receive push notifications on your devices',
              },
              {
                id: 'reminders',
                label: 'Billing Reminders',
                description: 'Remind me 3 days before each subscription renewal',
              },
            ].map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-smooth"
              >
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [setting.id]: !prev[setting.id as keyof typeof notifications],
                    }))
                  }
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-smooth
                    ${
                      notifications[setting.id as keyof typeof notifications]
                        ? 'bg-primary'
                        : 'bg-muted'
                    }
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full
                      bg-white transition-smooth
                      ${
                        notifications[
                          setting.id as keyof typeof notifications
                        ]
                          ? 'translate-x-5'
                          : 'translate-x-1'
                      }
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Display Preferences */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <Sun className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Display</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-smooth">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Use dark theme for the interface
                </p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-smooth
                  ${isDarkMode ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full
                    bg-white transition-smooth
                    ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">
                  Change your password regularly to keep your account secure
                </p>
              </div>
              <SecondaryButton>Change Password</SecondaryButton>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <SecondaryButton>Enable 2FA</SecondaryButton>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={itemVariants}
          className="bg-destructive/5 rounded-2xl border border-destructive/20 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-destructive/20">
            <LogOut className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-bold text-destructive">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out from this device
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="px-6 py-2 rounded-lg border-2 border-destructive text-destructive font-semibold text-sm hover:bg-destructive/10 transition-smooth"
              >
                Sign Out
              </motion.button>
            </div>

            <div className="border-t border-destructive/20 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold text-sm hover:bg-destructive/90 transition-smooth"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

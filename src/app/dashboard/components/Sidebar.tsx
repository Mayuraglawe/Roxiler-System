'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import styles from '../dashboard.module.css';



export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const userEmail = session?.user?.email || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isStoreOwner = userRole === 'STORE_OWNER';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ...(isAdmin || userRole === 'USER' || isStoreOwner ? [{ label: 'Stores', href: '/dashboard/stores', icon: '🏪' }] : []),
    ...(isAdmin ? [{ label: 'Users', href: '/dashboard/users', icon: '👥' }] : []),
    ...(isStoreOwner ? [{ label: 'Store Raters', href: '/dashboard/users', icon: '👤' }] : []),
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  // Use name, or fall back to the part before @ in email, or 'User'
  const userName = session?.user?.name || userEmail.split('@')[0] || 'User';
  const initial = (userName)[0].toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.sidebarLogo}>
          <span style={{
            background: 'var(--primary-gradient)',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
          }}>⭐</span>
          <span style={{ color: 'var(--text-main)' }}>RatingApp</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.sidebarFooter}>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-md)',
          }}
          title="Toggle Light / Dark Mode"
        >
          <span>{mounted ? (theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode') : '☀️ Light Mode'}</span>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '99px',
            background: 'rgba(99,102,241,0.15)',
            color: 'var(--primary-color)',
            fontWeight: 700
          }}>Switch</span>
        </button>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{initial}</div>
          <div className={styles.userDetails}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div className={styles.userName}>{userName}</div>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '99px',
                background: isAdmin ? 'rgba(217, 119, 6, 0.15)' : (isStoreOwner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)'),
                color: isAdmin ? 'var(--accent-amber)' : (isStoreOwner ? 'var(--accent-emerald)' : 'var(--primary-color)'),
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {isAdmin ? 'Admin' : (isStoreOwner ? 'Store Owner' : 'User')}
              </span>
            </div>
            <div className={styles.userEmail}>{userEmail}</div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={styles.logoutBtn}
          title="Sign out of account"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../dashboard.module.css';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isStoreOwner = userRole === 'STORE_OWNER';

  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || userEmail.split('@')[0] || 'User';

  const getBreadcrumb = () => {
    if (pathname.includes('/stores')) return { title: 'Stores Portal', path: 'Dashboard / Stores' };
    if (pathname.includes('/users')) return { title: isStoreOwner ? 'Store Raters' : 'System Users', path: 'Dashboard / Users' };
    if (pathname.includes('/settings')) return { title: 'Account Settings', path: 'Dashboard / Settings' };
    return { title: 'Dashboard Overview', path: 'Dashboard / Overview' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className={styles.topHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.breadcrumbPath}>{breadcrumb.path}</div>
        <h2 className={styles.headerTitle}>{breadcrumb.title}</h2>
      </div>

      <div className={styles.headerRight}>
        {/* Quick Search */}
        <div className={styles.headerSearch}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Quick search stores, users..."
            className={styles.headerSearchInput}
          />
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </div>

        {/* System Status Pill */}
        <div className={styles.statusPill}>
          <span className={styles.statusDot}></span>
          <span>System Active</span>
        </div>

        {/* Role Indicator Badge */}
        <span className={styles.roleBadge} style={{
          background: isAdmin ? 'rgba(245, 158, 11, 0.12)' : (isStoreOwner ? 'rgba(16, 185, 129, 0.12)' : 'rgba(79, 70, 229, 0.12)'),
          color: isAdmin ? '#D97706' : (isStoreOwner ? '#059669' : '#4F46E5'),
          border: isAdmin ? '1px solid rgba(245, 158, 11, 0.3)' : (isStoreOwner ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(79, 70, 229, 0.3)')
        }}>
          {isAdmin ? '👑 Admin' : (isStoreOwner ? '🏪 Store Owner' : '👥 User')}
        </span>

        {/* User Mini Profile */}
        <div className={styles.headerUserChip}>
          <div className={styles.userAvatarSmall}>
            {userName[0]?.toUpperCase() || 'U'}
          </div>
          <span className={styles.headerUserName}>{userName}</span>
        </div>
      </div>
    </header>
  );
}

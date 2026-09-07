import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = (session.user as { id: string }).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any).role || 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isStoreOwner = userRole === 'STORE_OWNER';

  let activeUsersCount = 0;
  let activeStoresCount = 0;
  let activeRatingsCount = 0;

  if (isAdmin) {
    activeUsersCount = await prisma.user.count();
    activeStoresCount = await prisma.store.count();
    activeRatingsCount = await prisma.rating.count();
  } else if (isStoreOwner) {
    const store = await prisma.store.findFirst({ where: { ownerId: userId }, include: { ratings: true } });
    if (store) {
      activeRatingsCount = store.ratings.length;
      activeStoresCount = 1;
    }
  } else {
    activeRatingsCount = await prisma.rating.count({ where: { userId } });
  }

  return (
    <div className={styles.dashboardContainer} style={{ padding: '2rem' }}>
      {/* Header Banner */}
      <header className={styles.pageHeader} style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚡</span> Dashboard Overview
          </h1>
          <p className={styles.pageSubtitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            Welcome back, <strong style={{ color: 'var(--primary-color)', fontSize: '1.05rem' }}>{session.user.name || 'User'}</strong>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: isAdmin ? 'rgba(245, 158, 11, 0.15)' : (isStoreOwner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(14, 160, 231, 0.15)'),
              color: isAdmin ? '#f59e0b' : (isStoreOwner ? '#10b981' : '#0ea0e7'),
              border: isAdmin ? '1px solid rgba(245, 158, 11, 0.3)' : (isStoreOwner ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(14, 160, 231, 0.3)'),
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {isAdmin ? '👑 Admin' : (isStoreOwner ? '🏪 Store Owner' : '👥 Normal User')}
            </span>
          </p>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(110, 202, 195, 0.15) 0%, rgba(104, 57, 184, 0.15) 100%)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {isAdmin ? '👑 Administrator Control Center' : (isStoreOwner ? '🏪 Store Management Portal' : '⭐ Discover & Rate Stores')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {isAdmin 
              ? 'Manage system users, stores, monitor ratings, and analyze performance metrics across the entire platform.' 
              : (isStoreOwner 
                ? 'Track ratings submitted by customers for your store and analyze overall rating averages.' 
                : 'Browse registered stores, view address details, and submit star ratings instantly.')}
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid} style={{ marginBottom: '3rem' }}>
        {isAdmin && (
          <div className={styles.statCard} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Total Users</h3>
              <div className={styles.statIcon} style={{ background: 'rgba(14, 160, 231, 0.15)', color: '#0ea0e7' }}>👥</div>
            </div>
            <p className={styles.statValue} style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>{activeUsersCount}</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered accounts</span>
          </div>
        )}
        
        {(isAdmin || isStoreOwner) && (
          <div className={styles.statCard} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>{isAdmin ? 'Total Stores' : 'My Stores'}</h3>
              <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>🏪</div>
            </div>
            <p className={styles.statValue} style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>{activeStoresCount}</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isAdmin ? 'Stores listed' : 'Active store profile'}</span>
          </div>
        )}

        <div className={styles.statCard} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>{isAdmin ? 'Total Ratings' : (isStoreOwner ? 'Store Ratings' : 'My Ratings')}</h3>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>⭐</div>
          </div>
          <p className={styles.statValue} style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>{activeRatingsCount}</p>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isAdmin ? 'Total ratings submitted' : (isStoreOwner ? 'Customer ratings received' : 'Ratings submitted by you')}</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🚀</span> Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <Link href="/dashboard/stores" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#f59e0b' }}>
                  🏪
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Stores Portal</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isAdmin ? 'Add & manage stores' : 'Browse & rate stores'}</p>
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Open Stores →
              </span>
            </div>
          </Link>

          {(isAdmin || isStoreOwner) && (
            <Link href="/dashboard/users" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(14, 160, 231, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#0ea0e7' }}>
                    👥
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{isAdmin ? 'User Management' : 'Store Raters'}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isAdmin ? 'Add users & assign roles' : 'View raters list'}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View Users →
                </span>
              </div>
            </Link>
          )}

          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(104, 57, 184, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#6839b8' }}>
                  🔒
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Account Security</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Change password & credentials</p>
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Manage Security →
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import styles from '../auth.module.css';
import dashboardStyles from '../dashboard/dashboard.module.css';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'admin' | 'owner' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@storeapp.com');
      setPassword('AdminPass123!');
    } else if (role === 'owner') {
      setEmail('owner@storeapp.com');
      setPassword('OwnerPass123!');
    } else {
      setEmail('user@storeapp.com');
      setPassword('UserPass123!');
    }
  };

  return (
    <>
      {justRegistered && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
          🎉 Account created successfully! Please sign in below.
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Pro Demo Accounts Quick-Fill Bar */}
      <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', textAlign: 'center' }}>
          ⚡ 1-Click Demo Credentials
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button type="button" onClick={() => fillDemoAccount('admin')} style={{ padding: '0.45rem 0.2rem', fontSize: '0.75rem', fontWeight: 700, background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>👑 Admin</button>
          <button type="button" onClick={() => fillDemoAccount('owner')} style={{ padding: '0.45rem 0.2rem', fontSize: '0.75rem', fontWeight: 700, background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>🏪 Owner</button>
          <button type="button" onClick={() => fillDemoAccount('user')} style={{ padding: '0.45rem 0.2rem', fontSize: '0.75rem', fontWeight: 700, background: '#FDF4FF', color: '#9333EA', border: '1px solid #F5D0FE', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>👥 Customer</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="name@company.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="password" className={styles.label} style={{ marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" className={styles.authLink} style={{ fontSize: '0.8rem' }}>Forgot password?</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              style={{ paddingRight: '2.8rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.authButton} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {loading ? 'Signing in...' : 'Sign In ✨'}
        </button>
      </form>

      <div className={styles.authFooter}>
        Don&apos;t have an account? <Link href="/register" className={styles.authLink}>Create one now</Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={dashboardStyles.dashboardTheme}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <h1 className={styles.authLogo}>RatingApp</h1>
          </div>
          <p className={styles.authSubtitle}>Welcome back! Sign in to access your dashboard</p>
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import styles from '../auth.module.css';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>Sign In</h1>
        <p className={styles.formSubtitle}>Enter your credentials to access your account.</p>
      </div>

      {justRegistered && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          🎉 Account created successfully! Please sign in below.
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>✉️</span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputWithIcon}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label htmlFor="password" className={styles.label} style={{ marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputWithIcon}
              placeholder="Enter your password"
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePasswordBtn}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className={styles.rememberRow}>
          <label className={styles.rememberLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#0066FF', cursor: 'pointer' }}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button type="submit" className={styles.blueAuthButton} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className={styles.separator}>
        <span>or quick fill demo</span>
      </div>

      <div className={styles.demoGrid}>
        <button type="button" onClick={() => fillDemoAccount('admin')} className={styles.demoBtn}>
          <span>👑</span> Admin
        </button>
        <button type="button" onClick={() => fillDemoAccount('owner')} className={styles.demoBtn}>
          <span>🏪</span> Owner
        </button>
        <button type="button" onClick={() => fillDemoAccount('user')} className={styles.demoBtn}>
          <span>👥</span> User
        </button>
      </div>

      <div className={styles.formFooter}>
        Don&apos;t have an account? <Link href="/register" className={styles.signUpLink}>Sign Up</Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.splitCard}>
        {/* Left Branding Side */}
        <div className={styles.brandSide}>
          <div className={styles.networkPattern} />
          
          <div className={styles.brandTop}>
            <Link href="/" className={styles.brandLogo}>
              <div className={styles.brandLogoIcon}>⭐</div>
              <span>RatingApp</span>
              <span className={styles.brandDot} />
            </Link>
          </div>

          <div className={styles.brandContent}>
            <h2 className={styles.brandTitle}>Welcome back to RatingApp</h2>
            <p className={styles.brandSubtitle}>
              Access your store ratings, owner dashboard, and admin tools in one unified portal.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide}>
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

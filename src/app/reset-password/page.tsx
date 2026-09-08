'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../auth.module.css';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error occurred');
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: '#64748B', marginBottom: '1rem' }}>Invalid or missing password reset token.</p>
        <Link href="/forgot-password" className={styles.blueAuthButton} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
          Request New Link
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: 800 }}>Password Updated!</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link href="/login" className={styles.blueAuthButton} style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.25rem' }}>
        Enter your new password below.
      </p>
      
      {status === 'error' && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          ⚠️ {errorMessage}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>New Password</label>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>🔒</span>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="password" 
            className={styles.inputWithIcon} 
            placeholder="8–16 chars, 1 Upper, 1 Special" 
            required
            minLength={8}
            maxLength={16}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePasswordBtn}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>🔑</span>
          <input 
            type={showConfirm ? 'text' : 'password'} 
            id="confirmPassword" 
            className={styles.inputWithIcon} 
            placeholder="Re-enter new password" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              paddingRight: '2.5rem',
              borderColor: confirmPassword ? (passwordsMatch ? '#10B981' : '#EF4444') : undefined
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className={styles.togglePasswordBtn}
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
      </div>
      
      <button type="submit" className={styles.blueAuthButton} disabled={status === 'loading'} style={{ marginTop: '1.25rem' }}>
        {status === 'loading' ? 'Updating Password...' : 'Update Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
            <h2 className={styles.brandTitle}>Reset Password</h2>
            <p className={styles.brandSubtitle}>
              Set up a secure new password for your RatingApp account.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Set New Password</h1>
            <p className={styles.formSubtitle}>Choose a strong password to protect your account.</p>
          </div>
          
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../auth.module.css';
import dashboardStyles from '../dashboard/dashboard.module.css';

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
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Invalid or missing password reset token.</p>
        <Link href="/forgot-password" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Request New Link
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 700 }}>Password Updated!</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '0.85rem' }}>
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
        Enter your new password below.
      </p>
      
      {status === 'error' && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500 }}>
          ⚠️ {errorMessage}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>New Password</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="password" 
            className={styles.input} 
            placeholder="8–16 chars, 1 Upper, 1 Special" 
            required
            minLength={8}
            maxLength={16}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showConfirm ? 'text' : 'password'} 
            id="confirmPassword" 
            className={styles.input} 
            placeholder="Re-enter new password" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              paddingRight: '2.8rem',
              borderColor: confirmPassword ? (passwordsMatch ? '#10b981' : '#ef4444') : undefined
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
            title={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
        {confirmPassword && !passwordsMatch && (
          <small style={{ color: '#ef4444', marginTop: '0.35rem', display: 'block', fontSize: '0.75rem' }}>❌ Passwords do not match</small>
        )}
        {confirmPassword && passwordsMatch && (
          <small style={{ color: '#10b981', marginTop: '0.35rem', display: 'block', fontSize: '0.75rem' }}>✅ Passwords match!</small>
        )}
      </div>
      
      <button type="submit" className={styles.authButton} disabled={status === 'loading'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
        {status === 'loading' ? 'Updating Password...' : '🔒 Update Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={dashboardStyles.dashboardTheme}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <h1 className={styles.authLogo}>RatingApp</h1>
          </div>
          <p className={styles.authSubtitle}>Set a new password</p>
          
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
          
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';
import dashboardStyles from '../dashboard/dashboard.module.css'; 

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    setLoading(true);
    
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={dashboardStyles.dashboardTheme}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <h1 className={styles.authLogo}>RatingApp</h1>
          </div>
          <p className={styles.authSubtitle}>Reset your password</p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Enter your registered email address and we&apos;ll send you a link to reset your password.
              </p>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className={styles.input} 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
              
              <button type="submit" className={styles.authButton} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {loading ? 'Sending Link...' : '✉️ Send Reset Link'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 700 }}>Check your email</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                If an account exists for that email, we&apos;ve sent password reset instructions.
              </p>
            </div>
          )}
          
          <div className={styles.authFooter}>
            Remember your password? <Link href="/login" className={styles.authLink}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

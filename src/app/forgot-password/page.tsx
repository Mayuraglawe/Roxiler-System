'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

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
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className={styles.brandTitle}>Account Recovery</h2>
            <p className={styles.brandSubtitle}>
              Recover access to your RatingApp dashboard and manage your account settings securely.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Forgot Password?</h1>
            <p className={styles.formSubtitle}>Enter your email to receive password reset instructions.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input 
                    type="email" 
                    id="email" 
                    className={styles.inputWithIcon} 
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" className={styles.blueAuthButton} disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: 800 }}>Check your email</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                If an account exists for that email, we&apos;ve sent password reset instructions.
              </p>
            </div>
          )}
          
          <div className={styles.formFooter}>
            Remember your password? <Link href="/login" className={styles.signUpLink}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

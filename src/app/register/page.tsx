'use client';

import Link from 'next/link';
import styles from '../auth.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isMinLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const getStrength = () => {
    let score = 0;
    if (isMinLength) score++;
    if (hasUppercase) score++;
    if (hasSpecial) score++;
    if (score === 1) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (score === 2) return { label: 'Medium', color: '#f59e0b', width: '66%' };
    if (score === 3) return { label: 'Strong ✨', color: '#10b981', width: '100%' };
    return { label: 'Too Weak', color: '#6b7280', width: '10%' };
  };

  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isMinLength || !hasUppercase || !hasSpecial) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, address, role }),
      });

      if (res.ok) {
        router.push('/login?registered=true');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration');
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
            <h2 className={styles.brandTitle}>Join RatingApp Today</h2>
            <p className={styles.brandSubtitle}>
              Create your account to rate stores, submit reviews, or manage your business storefront.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide} style={{ padding: '2.5rem 2.5rem' }}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Sign Up</h1>
            <p className={styles.formSubtitle}>Create your platform account below.</p>
          </div>

          {error && (
            <div style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.inputWithIcon}
                  placeholder="John Doe (min 7 chars)"
                  minLength={7}
                  maxLength={60}
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputWithIcon}
                  placeholder="8–16 chars, 1 Upper, 1 Special"
                  minLength={8}
                  maxLength={16}
                  required
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

              {password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.2rem' }}>
                    <span>Strength:</span>
                    <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔑</span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.inputWithIcon}
                  placeholder="Re-enter password"
                  required
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

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📍</span>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.inputWithIcon}
                  placeholder="123 Main St, City"
                  maxLength={400}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: role === 'USER' ? '2px solid #0066FF' : '1px solid #E2E8F0',
                    background: role === 'USER' ? '#EFF6FF' : '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.15rem'
                  }}
                >
                  <span>👥 Normal User</span>
                  <small style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 400 }}>Rate & review</small>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('STORE_OWNER')}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '10px',
                    border: role === 'STORE_OWNER' ? '2px solid #10B981' : '1px solid #E2E8F0',
                    background: role === 'STORE_OWNER' ? '#ECFDF5' : '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.15rem'
                  }}
                >
                  <span>🏪 Store Owner</span>
                  <small style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 400 }}>Manage store</small>
                </button>
              </div>
            </div>

            <button type="submit" className={styles.blueAuthButton} disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.formFooter}>
            Already have an account? <Link href="/login" className={styles.signUpLink}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

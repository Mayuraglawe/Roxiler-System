'use client';

import Link from 'next/link';
import styles from '../auth.module.css';
import dashboardStyles from '../dashboard/dashboard.module.css';

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

  // Password validation rules
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
    <div className={dashboardStyles.dashboardTheme}>
      <div className={styles.authContainer} style={{ padding: '3rem 1rem' }}>
        <div className={styles.authCard} style={{ maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <h1 className={styles.authLogo}>RatingApp</h1>
          </div>
          <p className={styles.authSubtitle}>Create your platform account</p>

          {error && (
            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Min 7 characters (e.g. John Doe)"
                minLength={7}
                maxLength={60}
                required
              />
            </div>

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
              <label htmlFor="password" className={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="8–16 chars, 1 uppercase, 1 special"
                  minLength={8}
                  maxLength={16}
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

              {password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Re-enter your password"
                  required
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

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Address</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.input}
                placeholder="123 Main St, City (max 400 chars)"
                rows={2}
                maxLength={400}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'USER' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                    background: role === 'USER' ? 'rgba(37, 99, 235, 0.1)' : '#F8FAFC',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>👥 Normal User</span>
                  <small style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>Rate & review stores</small>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('STORE_OWNER')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'STORE_OWNER' ? '2px solid #10b981' : '1px solid #CBD5E1',
                    background: role === 'STORE_OWNER' ? 'rgba(16, 185, 129, 0.1)' : '#F8FAFC',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>🏪 Store Owner</span>
                  <small style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>Manage store & ratings</small>
                </button>
              </div>
            </div>

            <button type="submit" className={styles.authButton} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              {loading ? 'Creating Account...' : '✨ Create Account'}
            </button>
          </form>

          <div className={styles.authFooter}>
            Already have an account? <Link href="/login" className={styles.authLink}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

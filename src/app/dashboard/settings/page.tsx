'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../dashboard.module.css';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  // Profile State
  const [profileName, setProfileName] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = session?.user;
    if (user) {
      import('react').then(({ startTransition }) => {
        startTransition(() => {
          setProfileName(user.name || '');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setProfileAddress((user as any).address || '');
        });
      });
    }
  }, [session]);

  // Password validation rules
  const isMinLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, address: profileAddress }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileMessage(data.message || 'Profile updated successfully!');
        if (updateSession) updateSession();
      } else {
        setProfileError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setProfileError('An error occurred while updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (!isMinLength || !hasUppercase || !hasSpecial) {
      setError('New password does not meet security requirements');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer} style={{ padding: '2rem' }}>
      <header className={styles.pageHeader} style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚙️</span> Account Settings
          </h1>
          <p className={styles.pageSubtitle}>Manage your profile information and security credentials</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Card */}
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(12px)',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(14,160,231,0.2) 0%, rgba(16,185,129,0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid var(--border-highlight)' }}>
              👤
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Profile Information</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update your account display name and address</p>
            </div>
          </div>

          {profileMessage && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
              <span>✅</span> {profileMessage}
            </div>
          )}

          {profileError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
              <span>⚠️</span> {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Full Name (2-60 chars)"
                value={profileName} 
                onChange={e => setProfileName(e.target.value)} 
                required 
                minLength={2}
                maxLength={60}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Email Address (Read-only)</label>
              <input 
                type="email" 
                className="form-input" 
                value={session?.user?.email || ''} 
                disabled
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.95rem', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Physical Address</label>
              <textarea 
                className="form-input" 
                placeholder="123 Main St, City (max 400 chars)"
                value={profileAddress} 
                onChange={e => setProfileAddress(e.target.value)} 
                rows={3}
                maxLength={400}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.95rem' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={profileLoading}
              className="btn btn-primary" 
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: profileLoading ? 0.7 : 1 }}
            >
              {profileLoading ? 'Saving Changes...' : '💾 Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(12px)',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(110,202,195,0.2) 0%, rgba(104,57,184,0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid var(--border-highlight)' }}>
              🔒
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Change Password</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enhance account security with a strong password</p>
            </div>
          </div>

          {message && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
              <span>✅</span> {message}
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showOld ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="Enter current password"
                  value={oldPassword} 
                  onChange={e => setOldPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.8rem 2.8rem 0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
                  title={showOld ? 'Hide password' : 'Show password'}
                >
                  {showOld ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showNew ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="Enter new password"
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  minLength={8} 
                  maxLength={16}
                  style={{ width: '100%', padding: '0.8rem 2.8rem 0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
                  title={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? '🙈' : '👁️'}
                </button>
              </div>

              {newPassword && (
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Strength:</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="Re-enter new password"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  style={{
                    width: '100%', padding: '0.8rem 2.8rem 0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', color: 'var(--text-main)', fontSize: '0.95rem',
                    border: confirmPassword ? (passwordsMatch ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid var(--border-color)'
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

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Updating Password...' : '🔒 Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

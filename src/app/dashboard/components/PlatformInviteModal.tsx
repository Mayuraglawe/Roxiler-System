'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ProjectOption = {
  id: string;
  name: string;
};

export default function PlatformInviteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('NovaPass123!');
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/projects')
        .then(res => res.ok ? res.json() : [])
        .then(data => setProjects(data))
        .catch(() => setProjects([]));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          projectId: selectedProjectId || undefined,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Teammate ${name} successfully invited!`);
        setName('');
        setEmail('');
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMsg('');
          router.refresh();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to invite teammate');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 700,
        }}
        title="Invite Teammate to Platform"
      >
        <span>➕</span> Invite Teammate
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'var(--surface-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem',
        width: '100%', maxWidth: '500px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Invite Teammate to Platform</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Admin control for registering platform users & assigning work</p>
          </div>
          <button onClick={() => { setIsOpen(false); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Teammate Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
              }}
              placeholder="e.g. Sarah Connor"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
              }}
              placeholder="sarah@company.com"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Platform Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'MEMBER' | 'ADMIN')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="MEMBER">👥 Team Member</option>
                <option value="ADMIN">👑 Platform Admin</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Initial Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {projects.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Initial Project Board Assignment (Optional)</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="">-- Do Not Assign Yet --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={() => { setIsOpen(false); setError(''); setSuccessMsg(''); }}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Teammate...' : 'Invite Teammate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

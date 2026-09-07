'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../dashboard.module.css';
import { exportToCsv } from '@/lib/exportCsv';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  storeRating?: number | string;
  submittedRating?: number;
}

type SortKey = 'name' | 'email' | 'role';
type SortDir = 'asc' | 'desc';

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL'); // ALL, USER, STORE_OWNER, ADMIN
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isStoreOwner = userRole === 'STORE_OWNER';

  const fetchUsers = async () => {
    try {
      const url = isStoreOwner ? '/api/users?storeOnly=true' : '/api/users';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const url = isStoreOwner ? '/api/users?storeOnly=true' : '/api/users';
        const res = await fetch(url);
        if (res.ok) setUsers(await res.json());
      } catch (err) {
        console.error(err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, [isStoreOwner]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setShowAddUser(false);
        setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
        fetchUsers();
      } else {
        const data = await res.json();
        setFormError(data.message || 'Failed to add user');
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    const csvRows = filtered.map(u => ({
      ID: u.id,
      'Full Name': u.name,
      Email: u.email,
      Address: u.address || 'N/A',
      Role: u.role,
      'Store Rating': u.storeRating !== undefined ? u.storeRating : 'N/A',
    }));
    exportToCsv(`users-report-${new Date().toISOString().slice(0, 10)}.csv`, csvRows);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  const filtered = users
    .filter(u => {
      const matchesSearch =
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.address || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      return true;
    })
    .sort((a, b) => {
      const av = (a[sortKey] || '').toLowerCase();
      const bv = (b[sortKey] || '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
      Loading users...
    </div>
  );

  return (
    <div className={styles.dashboardContainer} style={{ padding: '2rem' }}>
      <header className={styles.pageHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span> {isStoreOwner ? 'Store Raters' : 'System Users'}
          </h1>
          <p className={styles.pageSubtitle}>Manage and view registered platform accounts and role permissions</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExportCsv} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
            title="Export Users report to CSV"
          >
            <span>📥</span> Export CSV
          </button>
          {isAdmin && (
            <button 
              onClick={() => { setShowAddUser(true); setFormError(''); }} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, boxShadow: 'var(--shadow-glow)' }}
            >
              <span>➕</span> Add New User
            </button>
          )}
        </div>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Add User Glassmorphism Modal */}
      {showAddUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            width: '100%', maxWidth: '580px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👤</span> Add New User
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Create a new platform account for a User, Admin, or Store Owner
                </p>
              </div>
              <button 
                onClick={() => { setShowAddUser(false); setFormError(''); }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Min 7 characters"
                    className="form-input"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    minLength={7}
                    maxLength={60}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="user@domain.com"
                    className="form-input"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Address</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Main Street, Suite 200"
                  className="form-input"
                  value={newUser.address}
                  onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                  required
                  maxLength={400}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Initial Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8-16, Upper & Special"
                      className="form-input"
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      minLength={8}
                      maxLength={16}
                      style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>User Role</label>
                  <select
                    className="form-input"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  >
                    <option value="USER">Normal User (Rater)</option>
                    <option value="ADMIN">System Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowAddUser(false); setFormError(''); }}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Creating User...' : '✨ Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Role Filter Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search users by name, email, address, role..."
          className="form-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '260px', maxWidth: '420px', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.9rem' }}
        />

        {!isStoreOwner && (
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <option value="ALL">👥 All Roles</option>
            <option value="USER">👥 Normal Users</option>
            <option value="STORE_OWNER">🏪 Store Owners</option>
            <option value="ADMIN">👑 System Admins</option>
          </select>
        )}
      </div>

      <div className={styles.projectsCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name{sortIcon('name')}</th>
              <th>Address</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>Role{sortIcon('role')}</th>
              {isAdmin && <th>Store Avg Rating</th>}
              {isStoreOwner && <th>Rating Submitted</th>}
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  👤 No matching users found.
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td>{u.address || '—'}</td>
                  <td>
                    <span className={styles.badge} style={{
                      textTransform: 'uppercase',
                      background: u.role === 'ADMIN' ? 'rgba(245, 158, 11, 0.15)' : (u.role === 'STORE_OWNER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(14, 160, 231, 0.15)'),
                      color: u.role === 'ADMIN' ? '#f59e0b' : (u.role === 'STORE_OWNER' ? '#10b981' : '#0ea0e7'),
                      border: u.role === 'ADMIN' ? '1px solid rgba(245, 158, 11, 0.3)' : (u.role === 'STORE_OWNER' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(14, 160, 231, 0.3)')
                    }}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>{u.role === 'STORE_OWNER' && u.storeRating !== null && u.storeRating !== undefined ? `⭐ ${u.storeRating}` : '—'}</td>
                  )}
                  {isStoreOwner && (
                    <td>{u.submittedRating ? `⭐ ${u.submittedRating}` : '—'}</td>
                  )}
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        style={{
                          background: 'rgba(239,68,68,0.12)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '6px',
                          padding: '0.35rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.15s'
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

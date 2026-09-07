'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../dashboard.module.css';
import { exportToCsv } from '@/lib/exportCsv';

interface RatingItem {
  id: string;
  score: number;
  userId: string;
  createdAt: string;
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  avgRating: number;
  totalRatings: number;
  userRating?: number | null;
  ratings?: RatingItem[];
}

interface AISummaryData {
  sentimentScore: string;
  sentimentBadge: string;
  highlights: string[];
  areasToImprove: string[];
  summaryText: string;
}

interface AIRecommendData {
  query: string;
  aiReasoning: string;
  recommendedStores: Store[];
}

type SortKey = 'name' | 'avgRating';
type SortDir = 'asc' | 'desc';

export default function StoresPage() {
  const { data: session } = useSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingLoading, setRatingLoading] = useState<string | null>(null);

  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerEmail: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [aiTagline, setAiTagline] = useState('');
  const [generatingTagline, setGeneratingTagline] = useState(false);

  // Selected Store for Rating Breakdown Modal
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummaryData | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  // AI Assistant Recommendation Modal State
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiRecommendResult, setAiRecommendResult] = useState<AIRecommendData | null>(null);
  const [loadingAiRecommend, setLoadingAiRecommend] = useState(false);

  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isStoreOwner = userRole === 'STORE_OWNER';

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        setStores(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stores');
        if (res.ok) setStores(await res.json());
      } catch (err) {
        console.error(err);
        setError('Failed to load stores');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      });
      if (res.ok) {
        setShowAddStore(false);
        setNewStore({ name: '', email: '', address: '', ownerEmail: '' });
        setAiTagline('');
        fetchStores();
      } else {
        const data = await res.json();
        setFormError(data.message || 'Failed to add store');
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAiTagline = async () => {
    if (!newStore.name) return;
    setGeneratingTagline(true);
    try {
      const res = await fetch('/api/ai/tagline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStore.name, address: newStore.address }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiTagline(data.tagline);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingTagline(false);
    }
  };

  const handleRate = async (storeId: string, score: number) => {
    setRatingLoading(storeId);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, score }),
      });
      if (res.ok) {
        setStores(prev => prev.map(s => s.id === storeId ? { ...s, userRating: score } : s));
        fetchStores();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRatingLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete store "${name}"?`)) return;
    try {
      const res = await fetch(`/api/stores/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStores(prev => prev.filter(s => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete store');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchAiSummary = async (store: Store) => {
    setLoadingAiSummary(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: store.name,
          avgRating: store.avgRating,
          totalRatings: store.totalRatings,
          ratingsBreakdown: store.ratings,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  const handleAiRecommendQuery = async (queryText: string) => {
    if (!queryText) return;
    setLoadingAiRecommend(true);
    setAiQuery(queryText);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiRecommendResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiRecommend(false);
    }
  };

  const handleExportCsv = () => {
    const csvRows = filtered.map(s => ({
      ID: s.id,
      'Store Name': s.name,
      Email: s.email,
      Address: s.address,
      'Average Rating': s.totalRatings > 0 ? s.avgRating : 'No ratings',
      'Total Ratings': s.totalRatings,
    }));
    exportToCsv(`stores-report-${new Date().toISOString().slice(0, 10)}.csv`, csvRows);
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

  const filtered = stores
    .filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      const numAvg = Number(s.avgRating);
      if (ratingFilter === '4_UP') return numAvg >= 4.0 && s.totalRatings > 0;
      if (ratingFilter === '3_UP') return numAvg >= 3.0 && s.totalRatings > 0;
      if (ratingFilter === 'UNRATED') return s.totalRatings === 0;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === 'avgRating') {
        return sortDir === 'asc' ? Number(a.avgRating) - Number(b.avgRating) : Number(b.avgRating) - Number(a.avgRating);
      }
      const av = a.name.toLowerCase();
      const bv = b.name.toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const getRatingDistribution = (ratingsList: RatingItem[] = []) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingsList.forEach(r => {
      if (r.score >= 1 && r.score <= 5) counts[r.score as 1|2|3|4|5]++;
    });
    const total = ratingsList.length || 1;
    return [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars as 1|2|3|4|5],
      percent: Math.round((counts[stars as 1|2|3|4|5] / total) * 100)
    }));
  };

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
      Loading stores...
    </div>
  );

  return (
    <div className={styles.dashboardContainer} style={{ padding: '2rem' }}>
      <header className={styles.pageHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏪</span> {isStoreOwner ? 'My Store' : 'Registered Stores'}
          </h1>
          <p className={styles.pageSubtitle}>Browse, rate, and analyze store profiles with AI sentiment summaries</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setShowAiAssistant(true); setAiRecommendResult(null); }} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, background: 'linear-gradient(135deg, rgba(104,57,184,0.15) 0%, rgba(14,160,231,0.15) 100%)', border: '1px solid var(--border-highlight)' }}
            title="Ask AI Assistant for Smart Recommendations"
          >
            <span>🤖</span> AI Assistant
          </button>

          <button 
            onClick={handleExportCsv} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
            title="Export Stores report to CSV"
          >
            <span>📥</span> Export CSV
          </button>

          {isAdmin && (
            <button 
              onClick={() => { setShowAddStore(true); setFormError(''); }} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, boxShadow: 'var(--shadow-glow)' }}
            >
              <span>➕</span> Add New Store
            </button>
          )}
        </div>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* AI Smart Recommendation Assistant Modal */}
      {showAiAssistant && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            width: '100%', maxWidth: '580px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'white' }}>
                  🤖
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>AI Recommendation Assistant</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ask AI to find top-rated stores based on intent</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAiAssistant(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Try Preset Queries:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleAiRecommendQuery('Show me top-rated stores overall')}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  🌟 Best 5-Star Stores
                </button>
                <button
                  type="button"
                  onClick={() => handleAiRecommendQuery('Find bakery & cafe stores')}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  🥐 Bakery & Cafe
                </button>
                <button
                  type="button"
                  onClick={() => handleAiRecommendQuery('Superstore near Downtown')}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  🛒 Superstores
                </button>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleAiRecommendQuery(aiQuery); }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Ask AI e.g. 'Show me stores in Sector 4'..."
                className="form-input"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                disabled={loadingAiRecommend}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.25rem', opacity: loadingAiRecommend ? 0.7 : 1 }}
              >
                {loadingAiRecommend ? 'Analyzing...' : 'Ask AI'}
              </button>
            </form>

            {/* AI Results */}
            {aiRecommendResult && (
              <div style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>💡</span> {aiRecommendResult.aiReasoning}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {aiRecommendResult.recommendedStores.map(st => (
                    <div key={st.id} style={{ background: 'var(--surface-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{st.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {st.address}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.95rem' }}>
                        ⭐ {st.avgRating > 0 ? st.avgRating : 'Unrated'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Store Glassmorphism Modal */}
      {showAddStore && (
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
            width: '100%', maxWidth: '560px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🏪</span> Add New Store
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Register a store and assign an existing Store Owner
                </p>
              </div>
              <button 
                onClick={() => { setShowAddStore(false); setFormError(''); setAiTagline(''); }} 
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

            <form onSubmit={handleAddStore}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Store Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Superstore"
                    className="form-input"
                    value={newStore.name}
                    onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                    required
                    minLength={2}
                    maxLength={60}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Store Email</label>
                  <input
                    type="email"
                    placeholder="store@domain.com"
                    className="form-input"
                    value={newStore.email}
                    onChange={e => setNewStore({ ...newStore, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Physical Address</label>
                  {newStore.name && (
                    <button
                      type="button"
                      onClick={handleGenerateAiTagline}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {generatingTagline ? '✨ Generating...' : '✨ AI Tagline'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. 742 Evergreen Terrace, Sector 4, City"
                  className="form-input"
                  value={newStore.address}
                  onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                  required
                  maxLength={400}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
                {aiTagline && (
                  <div style={{ background: 'rgba(110, 202, 195, 0.12)', border: '1px solid var(--border-highlight)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    ✨ <strong>AI Suggested Bio:</strong> &quot;{aiTagline}&quot;
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Owner Email</label>
                <input
                  type="email"
                  placeholder="owner@domain.com"
                  className="form-input"
                  value={newStore.ownerEmail}
                  onChange={e => setNewStore({ ...newStore, ownerEmail: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                  ℹ️ The user must exist and have the <strong>Store Owner</strong> role.
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowAddStore(false); setFormError(''); setAiTagline(''); }}
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
                  {submitting ? 'Creating Store...' : '✨ Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Rating Breakdown & AI Sentiment Modal */}
      {selectedStore && (
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
            width: '100%', maxWidth: '560px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📊</span> {selectedStore.name} Ratings
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{selectedStore.address}</p>
              </div>
              <button 
                onClick={() => { setSelectedStore(null); setAiSummary(null); }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Overall Score Header */}
            <div style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
                  {selectedStore.totalRatings > 0 ? selectedStore.avgRating : 'N/A'} <span style={{ fontSize: '1.2rem' }}>/ 5</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Based on {selectedStore.totalRatings} customer rating{selectedStore.totalRatings !== 1 ? 's' : ''}
                </div>
              </div>

              <button
                onClick={() => handleFetchAiSummary(selectedStore)}
                className="btn btn-secondary"
                disabled={loadingAiSummary}
                style={{ background: 'linear-gradient(135deg, rgba(104,57,184,0.2) 0%, rgba(14,160,231,0.2) 100%)', border: '1px solid var(--border-highlight)', fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
              >
                {loadingAiSummary ? '🤖 Analyzing...' : '🤖 AI Sentiment Analysis'}
              </button>
            </div>

            {/* AI Summary Box */}
            {aiSummary && (
              <div style={{ background: 'rgba(104, 57, 184, 0.12)', border: '1px solid rgba(104, 57, 184, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.15rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🤖 AI Sentiment Summary
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                    {aiSummary.sentimentScore}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {aiSummary.summaryText}
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {aiSummary.highlights.map((h, i) => (
                    <span key={i} style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                      ✨ {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Breakdown Bar Chart */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Rating Distribution:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {getRatingDistribution(selectedStore.ratings).map(item => (
                <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ minWidth: '45px', fontWeight: 600, color: 'var(--text-main)' }}>{item.stars} ★</span>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.percent}%`, background: item.stars >= 4 ? '#10b981' : (item.stars === 3 ? '#f59e0b' : '#ef4444'), transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ minWidth: '60px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.count} ({item.percent}%)</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { setSelectedStore(null); setAiSummary(null); }}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontWeight: 600 }}
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search stores by name, email or address..."
          className="form-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '260px', maxWidth: '420px', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.9rem' }}
        />

        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="ALL">⭐ All Rating Levels</option>
          <option value="4_UP">🌟 4.0 ★ & Above</option>
          <option value="3_UP">⭐ 3.0 ★ & Above</option>
          <option value="UNRATED">⚪ Unrated Stores</option>
        </select>
      </div>

      <div className={styles.projectsCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Store Name{sortIcon('name')}</th>
              <th>Address</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('avgRating')}>Overall Rating{sortIcon('avgRating')}</th>
              {userRole === 'USER' && <th>Your Rating</th>}
              <th>Analytics</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  🏪 No matching stores found.
                </td>
              </tr>
            ) : (
              filtered.map(store => (
                <tr key={store.id}>
                  <td>
                    <strong>{store.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{store.email}</div>
                  </td>
                  <td>{store.address}</td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: store.totalRatings > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                      {store.totalRatings > 0 ? `⭐ ${store.avgRating}` : '—'}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''}
                    </div>
                  </td>
                  {userRole === 'USER' && (
                    <td>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            onClick={() => handleRate(store.id, num)}
                            disabled={ratingLoading === store.id}
                            title={`Rate ${num} star${num !== 1 ? 's' : ''}`}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: ratingLoading === store.id ? 'wait' : 'pointer',
                              fontSize: '1.3rem',
                              lineHeight: 1,
                              padding: '2px',
                              color: (store.userRating ?? 0) >= num ? '#f59e0b' : 'var(--text-muted)',
                              opacity: (store.userRating ?? 0) >= num ? 1 : 0.4,
                              transition: 'transform 0.15s ease, color 0.15s ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.3)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          >
                            ★
                          </button>
                        ))}
                        {store.userRating && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>
                            ({store.userRating}/5)
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  <td>
                    <button
                      onClick={() => setSelectedStore(store)}
                      style={{
                        background: 'rgba(14, 160, 231, 0.12)',
                        color: '#0ea0e7',
                        border: '1px solid rgba(14, 160, 231, 0.3)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: 'all 0.15s'
                      }}
                      title="View Rating Breakdown & AI Sentiment"
                    >
                      📊 Breakdown & AI
                    </button>
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => handleDelete(store.id, store.name)}
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

'use client';

import { useState } from 'react';

export default function HeroDemoCard() {
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(128);
  const [sumRatings, setSumRatings] = useState<number>(589);
  const [feedback, setFeedback] = useState<string>('Click stars to test interactive rating!');

  const handleRate = (stars: number) => {
    setUserRating(stars);
    setTotalRatings(prev => prev + 1);
    setSumRatings(prev => prev + stars);
    setFeedback(`🎉 You rated ${stars} Star${stars > 1 ? 's' : ''}! Live average recalculated.`);
  };

  const currentAverage = (sumRatings / totalRatings).toFixed(1);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1), 0 4px 16px rgba(15, 23, 42, 0.04)',
      width: '100%',
      maxWidth: '480px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Top Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #4F46E5 0%, #2563EB 50%, #0D9488 100%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            border: '1px solid #C7D2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
          }}>
            🏬
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Apex Tech Flagship</h3>
              <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#15803D', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px' }}>✓ Verified Store</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>📍 100 Innovation Blvd, Tech District</p>
          </div>
        </div>
      </div>

      {/* Score Overview Box */}
      <div style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
      }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
            {currentAverage} <span style={{ fontSize: '1.2rem', color: '#F59E0B' }}>★</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem', fontWeight: 500 }}>
            Based on <strong>{totalRatings}</strong> customer ratings
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '120px' }}>
          {[5, 4, 3].map((star, idx) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748B' }}>
              <span style={{ width: '22px', fontWeight: 700 }}>{star}★</span>
              <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: idx === 0 ? '78%' : idx === 1 ? '16%' : '6%',
                  background: 'linear-gradient(90deg, #F59E0B 0%, #4F46E5 100%)',
                  borderRadius: '99px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Rating Area */}
      <div style={{
        background: '#FFFFFF',
        border: '1px dashed #CBD5E1',
        borderRadius: '16px',
        padding: '1.25rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
          Rate this store (Live Interactive Demo):
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || userRating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '2.1rem',
                  color: isFilled ? '#F59E0B' : '#CBD5E1',
                  transition: 'transform 0.15s ease, color 0.15s ease',
                  transform: (hoverRating === star || (userRating === star && !hoverRating)) ? 'scale(1.25)' : 'scale(1)',
                }}
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            );
          })}
        </div>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#4F46E5',
          background: 'rgba(79, 70, 229, 0.08)',
          padding: '0.4rem 0.8rem',
          borderRadius: '99px',
          display: 'inline-block'
        }}>
          {feedback}
        </div>
      </div>

      {/* Avatar Stack & Store Owner Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
            {['👨‍💻', '👩‍💼', '👨‍🎓', '👩‍🔬'].map((emoji, i) => (
              <div key={i} style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#F1F5F9',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                marginLeft: i > 0 ? '-8px' : 0,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {emoji}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>128 Recent Reviews</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 700, background: '#CCFBF1', padding: '0.25rem 0.65rem', borderRadius: '99px' }}>
          Owner: Alex Mercer
        </span>
      </div>
    </div>
  );
}

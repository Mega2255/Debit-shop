// src/pages/Wishlist.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist } = useCart();
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 40px 80px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>My Collection</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300 }}>Wishlist</h1>
          <span style={{ fontSize: 13, color: '#999' }}>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</span>
        </div>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Your wishlist is empty</p>
            <p style={{ fontSize: 14, marginBottom: 32 }}>Save items you love while you browse.</p>
            <Link to="/" style={{ display: 'inline-block', border: '1px solid #111', padding: '13px 48px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, color: '#111', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
            >Explore Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px 20px' }}>
            {wishlist.map(item => <ProductCard key={item.id} product={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/ProductCard.js - ash-luxe style: clean white, minimal, image hover swap
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { currentUser } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const isWished = wishlist.some(i => i.id === product.id);
  const inStock = (product.stock === undefined || product.stock > 0);

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUser) { toast.error('Please login first'); return; }
    if (!inStock) { toast.error('Out of stock'); return; }
    setAdding(true);
    await addToCart(product);
    toast.success('Added to cart!');
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUser) { toast.error('Please login first'); return; }
    await toggleWishlist(product);
    toast.success(isWished ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', background: '#fff', cursor: 'pointer' }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image container */}
        <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: '#f5f5f5' }}>
          {/* Primary image */}
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=533&q=80'}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: hovered && product.image2 ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          />
          {/* Alt image on hover */}
          {product.image2 && (
            <img
              src={product.image2}
              alt={product.name + ' alt'}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {product.isNew && (
              <span style={{ background: '#ea580c', color: '#fff', padding: '3px 8px', fontSize: 10, letterSpacing: 1.5, fontWeight: 600, textTransform: 'uppercase' }}>New</span>
            )}
            {!inStock && (
              <span style={{ background: '#111', color: '#fff', padding: '3px 8px', fontSize: 10, letterSpacing: 1.5, fontWeight: 600, textTransform: 'uppercase' }}>Sold Out</span>
            )}
          </div>

          {/* Wishlist btn */}
          <button onClick={handleWishlist} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.9)', border: 'none',
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isWished ? '#ea580c' : 'none'} stroke={isWished ? '#ea580c' : '#555'} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Quick add - appears on hover */}
          {inStock && (
            <button onClick={handleAddToCart} disabled={adding} style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(17,17,17,0.88)', color: '#fff',
              border: 'none', padding: '12px', fontSize: 11,
              letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
              cursor: adding ? 'not-allowed' : 'pointer',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.25s, transform 0.25s',
            }}>
              {adding ? 'Adding...' : 'Quick Add'}
            </button>
          )}
        </div>

        {/* Info */}
        <div style={{ paddingTop: 14, paddingBottom: 4 }}>
          <p style={{
            fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
            fontWeight: 700, marginBottom: 6,
            background: 'linear-gradient(90deg, #84cc16, #eab308)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{product.category}</p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, color: '#111', fontWeight: 500,
            marginBottom: 8, lineHeight: 1.3, letterSpacing: 0.3,
          }}>{product.name}</p>

          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
            color: '#eab308',
          }}>
            ₦{Number(product.price).toLocaleString()}
            {!inStock && (
              <span style={{
                color: '#aaa', fontSize: 11, fontWeight: 400,
                marginLeft: 8, letterSpacing: 1, textTransform: 'uppercase',
              }}>Sold out</span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}

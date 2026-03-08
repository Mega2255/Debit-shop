// src/pages/Home.js - rebuilt to match ash-luxe.com layout exactly
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import ProductCard from '../components/ProductCard';

/* ─────────────── VIDEO HERO ─────────────── */
function VideoHero() {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    // Ensure video plays on mobile (some browsers need a nudge)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: 500, overflow: 'hidden', background: '#111' }}>

      {/* ── VIDEO ── fills the full hero, cropped to fit on all screen sizes */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
<<<<<<< HEAD
<<<<<<< HEAD
        poster="https://image2url.com/r2/default/images/1773220338724-aad66e41-d969-48bf-8dd6-afb412ff22cb.jpeg"
=======
        poster="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
>>>>>>> 87b0c3d (Ready for Vercel)
=======
        poster="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.85,
          /* On narrow/portrait screens objectFit cover keeps the video full */
        }}
      >
<<<<<<< HEAD
        <source src="https://image2url.com/r2/default/videos/1773764507441-9a7f9fa9-758c-4d77-a84c-69fe8c4bea16.mp4" type="video/mp4" />
=======
        <source src="https://image2url.com/r2/default/videos/1772114975196-336fcc5e-ff17-498e-bced-84053f48257d.mp4" type="video/mp4" />
>>>>>>> 87b0c3d (Ready for Vercel)
        <source src="https://cdn.coverr.co/videos/coverr-man-walking-in-a-city-5569/1080p.mp4" type="video/mp4" />
      </video>

      {/* ── DARK GRADIENT OVERLAY ── makes text readable on any video frame */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.72) 100%)',
      }} />

      {/* ── HERO CONTENT ── */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '90%',
        maxWidth: 700,
        padding: '0 16px',
        boxSizing: 'border-box',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: 'clamp(9px, 1.5vw, 11px)',
          letterSpacing: 5,
          textTransform: 'uppercase',
          fontWeight: 500,
          marginBottom: 16,
        }}>New Collection</p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(40px, 9vw, 96px)',
          color: '#fff',
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: 2,
          marginBottom: 28,
        }}>New Arrivals</h1>

        <Link
          to="/category/new-arrivals"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#111',
            padding: 'clamp(10px, 2vw, 14px) clamp(28px, 5vw, 44px)',
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontWeight: 600,
            transition: 'all 0.25s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
        >Shop Now</Link>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: 0.6,
      }}>
        <span style={{ color: '#fff', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' }}>Scroll</span>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(to bottom, #fff, transparent)',
          animation: 'scrollPulse 1.8s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
        /* On very short screens (landscape mobile) adjust bottom offset */
        @media (max-height: 500px) {
          .hero-content { bottom: 8% !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── TABBED PRODUCT SECTION ─────────────── */
// Exactly like ash-luxe: section title, sub-tabs (T-Shirts, Pants, Jackets…), product grid, View All
function TabbedSection({ title, allProducts, tabs, viewAllPath, accent = '#ea580c' }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'all');
<<<<<<< HEAD
<<<<<<< HEAD
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const tabMatches = (p, key) => {
    const cat = (p.category || '').toLowerCase();
    const k = key.toLowerCase();
=======
=======
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
>>>>>>> 65d16dd (Add front/back/side image fields to admin)

  const tabMatches = (p, key) => {
    const cat = (p.category || '').toLowerCase();
    const k = key.toLowerCase();
<<<<<<< HEAD
    // Exact subcategory match: strip gender prefix and compare the rest
    // e.g. key "belt" should match "men - belts", "women - belts"
    // e.g. key "t-shirt" should match "men - t-shirts"
>>>>>>> 87b0c3d (Ready for Vercel)
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
    const afterDash = cat.includes(' - ') ? cat.split(' - ').slice(1).join(' - ') : cat;
    return afterDash.includes(k) || cat.includes(k);
  };

  const filtered = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => tabMatches(p, activeTab));

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const display = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // Reset to page 1 when tab changes
  React.useEffect(() => { setPage(1); }, [activeTab]);

  // Build page numbers: show max 5 page buttons
  const getPageNums = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2];
  };
<<<<<<< HEAD

  return (
    <section style={{ padding: '64px 20px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16, padding: '0 20px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: 1, color: '#ea580c' }}>{title}</h2>
        <Link to={viewAllPath} style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#111', borderBottom: '1px solid #111', paddingBottom: 2 }}
=======
  const display = filtered.slice(0, 8);
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)

  return (
    <section style={{ padding: '64px 20px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Section header */}
<<<<<<< HEAD
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: 1, color: '#ea580c' }}>{title}</h2>
        <Link to={viewAllPath} style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#111', borderBottom: '1px solid #111', paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s' }}
>>>>>>> 87b0c3d (Ready for Vercel)
=======
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16, padding: '0 20px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: 1, color: '#ea580c' }}>{title}</h2>
        <Link to={viewAllPath} style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#111', borderBottom: '1px solid #111', paddingBottom: 2 }}
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
          onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#111'; }}
        >View All</Link>
      </div>

      {/* Sub-category tabs */}
      {tabs.length > 1 && (
<<<<<<< HEAD
<<<<<<< HEAD
        <div style={{ display: 'flex', gap: 0, marginBottom: 36, borderBottom: '1px solid #e8e8e8', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 20px' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 16px', background: 'none', border: 'none',
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
=======
        <div style={{ display: 'flex', gap: 0, marginBottom: 36, borderBottom: '1px solid #e8e8e8', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 20px', background: 'none', border: 'none',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
>>>>>>> 87b0c3d (Ready for Vercel)
=======
        <div style={{ display: 'flex', gap: 0, marginBottom: 36, borderBottom: '1px solid #e8e8e8', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 20px' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 16px', background: 'none', border: 'none',
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
              color: activeTab === tab.key ? accent : '#888',
              borderBottom: `2px solid ${activeTab === tab.key ? accent : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', marginBottom: -1,
            }}>{tab.label}</button>
          ))}
        </div>
      )}

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Product grid — 2 cols on mobile, 4 on desktop */}
      {display.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', background: '#fafafa', border: '1px dashed #e8e8e8', margin: '0 20px' }}>
=======
      {/* Product grid */}
      {display.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', background: '#fafafa', border: '1px dashed #e8e8e8' }}>
>>>>>>> 87b0c3d (Ready for Vercel)
=======
      {/* Product grid — 2 cols on mobile, 4 on desktop */}
      {display.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', background: '#fafafa', border: '1px dashed #e8e8e8', margin: '0 20px' }}>
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: '#ccc', marginBottom: 8 }}>
            {tabs.find(t => t.key === activeTab)?.label || 'Products'}
          </p>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#ea580c', fontWeight: 600 }}>Coming Soon!</p>
        </div>
      ) : (
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="home-product-grid">
=======
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px 20px' }}>
>>>>>>> 87b0c3d (Ready for Vercel)
=======
        <div className="home-product-grid">
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
          {display.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
      {/* Pagination — Prev, 1 2 3 …, Next */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40, flexWrap: 'wrap' }}>
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px', border: '1px solid #e8e8e8', background: '#fff',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              color: currentPage === 1 ? '#ccc' : '#111',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (currentPage !== 1) { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = accent; } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = currentPage === 1 ? '#ccc' : '#111'; e.currentTarget.style.borderColor = '#e8e8e8'; }}
          >← Prev</button>

          {/* Page numbers */}
          {getPageNums().map(n => (
            <button key={n} onClick={() => setPage(n)} style={{
              width: 36, height: 36, border: `1px solid ${currentPage === n ? accent : '#e8e8e8'}`,
              background: currentPage === n ? accent : '#fff',
              color: currentPage === n ? '#fff' : '#111',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (currentPage !== n) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; } }}
              onMouseLeave={e => { if (currentPage !== n) { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.color = '#111'; } }}
            >{n}</button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px', border: '1px solid #e8e8e8', background: '#fff',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              color: currentPage === totalPages ? '#ccc' : '#111',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (currentPage !== totalPages) { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = accent; } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = currentPage === totalPages ? '#ccc' : '#111'; e.currentTarget.style.borderColor = '#e8e8e8'; }}
          >Next →</button>
        </div>
      )}

<<<<<<< HEAD
      {/* See more / View all link */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to={viewAllPath} style={{
          display: 'inline-block', border: '1px solid #111', padding: '12px 40px',
=======
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
      {/* See more / View all link */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to={viewAllPath} style={{
<<<<<<< HEAD
          display: 'inline-block', border: '1px solid #111', padding: '13px 48px',
>>>>>>> 87b0c3d (Ready for Vercel)
=======
          display: 'inline-block', border: '1px solid #111', padding: '12px 40px',
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
          fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
          color: '#111', transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#111'; }}
        >See More</Link>
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)

      <style>{`
        .home-product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px 16px;
          padding: 0 20px;
        }
        @media (max-width: 1024px) {
          .home-product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .home-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 10px;
            padding: 0 4px;
          }
        }
      `}</style>
<<<<<<< HEAD
=======
>>>>>>> 87b0c3d (Ready for Vercel)
=======
>>>>>>> 65d16dd (Add front/back/side image fields to admin)
    </section>
  );
}

/* ─────────────── FULL-WIDTH PROMO BANNER ─────────────── */
function PromoBanner({ img, label, title, link, flip }) {
  return (
    <div style={{ position: 'relative', height: 520, overflow: 'hidden', background: '#f5f5f5' }}>
      <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 40, left: 40,
      }}>
        {label && <p style={{ color: '#faff00', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{label}</p>}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, color: '#84cc16', fontWeight: 300, marginBottom: 20, lineHeight: 1.1 }}>{title}</h3>
        <Link to={link} style={{
          display: 'inline-block', background: '#fff', color: '#111',
          padding: '12px 36px', fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', fontWeight: 600, transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
        >Shop Now</Link>
      </div>
    </div>
  );
}

/* ─────────────── DUAL BANNER ─────────────── */
function DualBanner() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 1400, margin: '0 auto', gap: 2, padding: '0 40px 64px' }} className="dual-banner">
      <PromoBanner
        img="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
        label="New Season"
        title={"Men's\nCollection"}
        link="/category/men"
      />
      <PromoBanner
        img="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
        label="New Season"
        title={"Women's\nCollection"}
        link="/category/women"
      />
    </div>
  );
}

/* ─────────────── MARQUEE TICKER ─────────────── */
function Marquee() {
<<<<<<< HEAD
  const items = ['New Arrivals', 'Premium Quality', 'Free Shipping Over ₦500,000', 'Men', 'Women', 'Collections', 'Luxury Streetwear'];
=======
  const items = ['New Arrivals', 'Premium Quality', 'Free Shipping Over ₦50,000', 'Men', 'Women', 'Collections', 'Luxury Streetwear'];
>>>>>>> 87b0c3d (Ready for Vercel)
  return (
    <div style={{ background: '#ea580c', overflow: 'hidden', padding: '12px 0', marginBottom: 0 }}>
      <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ color: '#fff', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, padding: '0 32px' }}>
            {item} <span style={{ opacity: 0.5, marginLeft: 16 }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
      `}</style>
    </div>
  );
}

/* ─────────────── LOOKBOOK GRID ─────────────── */
function LookbookGrid() {
  const imgs = [
    'https://image2url.com/r2/default/images/1771747791389-9ebdd379-7003-4659-bf79-275c820d9e3f.jpeg',
    'https://image2url.com/r2/default/images/1771747833224-4eead591-0ec2-4141-be82-ec4fe223e206.jpeg',
    'https://image2url.com/r2/default/images/1771747868528-36d1051b-7aaa-441e-9e20-f5df8f26a5d3.jpeg',
    'https://image2url.com/r2/default/images/1771747928888-5ff44007-8c59-407c-8045-bfcbef3361d9.jpeg',
    'https://image2url.com/r2/default/images/1771748007781-746730e0-316d-42f2-8cb2-21f2f96959c4.jpeg',
    'https://image2url.com/r2/default/images/1771748085028-c380d445-dd4f-40db-89bd-b84dcc60a66a.jpeg',
  ];
  return (
    <section style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: 1, color: '#111' }}>Lookbook</h2>
        <Link to="/lookbook" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#111', borderBottom: '1px solid #111', paddingBottom: 2 }}>View All</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }} className="lookbook-grid">
        {imgs.map((img, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: '130%', overflow: 'hidden', background: '#f5f5f5' }}>
            <img src={img} alt={`Look ${i+1}`} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .lookbook-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 600px) { .lookbook-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

/* ─────────────── FEATURES BAR ─────────────── */
function FeaturesBar() {
  return (
    <div style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', padding: '28px 40px', background: '#fafafa' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
        {[
<<<<<<< HEAD
          { icon: '🚚', label: 'Free Shipping', sub: 'Orders over ₦500,000' },
=======
          { icon: '🚚', label: 'Free Shipping', sub: 'Orders over ₦50,000' },
>>>>>>> 87b0c3d (Ready for Vercel)
          { icon: '🔄', label: 'Easy Returns', sub: '30-day return policy' },
          { icon: '🔒', label: 'Secure Payment', sub: 'Powered by Paystack' },
          { icon: '💬', label: 'Live Support', sub: 'WhatsApp: +234 903 434 4183' },
        ].map(f => (
          <div key={f.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</p>
            <p style={{ fontSize: 12, color: '#888' }}>{f.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── MAIN HOME ─────────────── */
export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        // Sort newest first
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProducts(arr);
      } else {
        setProducts([]);
      }
    });
    return unsub;
  }, []);

  const newArrivals = products.filter(p => p.isNew);
  const menProducts = products.filter(p => (p.category || '').toLowerCase().includes('men') && !(p.category || '').toLowerCase().includes('women'));
  const womenProducts = products.filter(p => (p.category || '').toLowerCase().includes('women'));
  const allForNew = newArrivals.length > 0 ? newArrivals : products;

  const menTabs = [
    { key: 'all', label: 'All' },
    { key: 't-shirt', label: 'T-Shirts' },
    { key: 'shirt', label: 'Shirts' },
    { key: 'pant', label: 'Pants' },
    { key: 'short', label: 'Shorts' },
    { key: 'jacket', label: 'Jackets' },
    { key: 'jersey', label: 'Jerseys' },
    { key: 'belt', label: 'Belts' },
    { key: 'glass', label: 'Glasses' },
    { key: 'headwear', label: "Headwear's" },
    { key: 'sock', label: 'Socks' },
  ];
  const womenTabs = [
    { key: 'all', label: 'All' },
    { key: 'top', label: 'Tops' },
    { key: 'dress', label: 'Dresses' },
    { key: 'bottom', label: 'Bottoms' },
    { key: 'jacket', label: 'Jackets' },
    { key: 'swimwear', label: 'Swimwear' },
    { key: 'jersey', label: 'Jerseys' },
    { key: 'belt', label: 'Belts' },
    { key: 'glass', label: 'Glasses' },
    { key: 'headwear', label: "Headwear's" },
    { key: 'sock', label: 'Socks' },
  ];

  return (
    <div style={{ background: '#fff' }}>
      {/* 1. Full-screen video/image hero */}
      <VideoHero />

      {/* 2. Marquee ticker */}
      <Marquee />

      {/* 3. New Arrivals section with tabs */}
      <TabbedSection
        title="New Arrivals"
        allProducts={allForNew}
        tabs={[{ key: 'all', label: 'New Arrivals' }]}
        viewAllPath="/category/new-arrivals"
        accent="#ea580c"
      />

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e8e8e8', maxWidth: 1400, margin: '0 auto' }} />

      {/* 4. Men's section */}
      <TabbedSection
        title="Men"
        allProducts={menProducts.length > 0 ? menProducts : products}
        tabs={menTabs}
        viewAllPath="/category/men"
        accent="#84cc16"
      />

      {/* 5. Dual promo banner */}
      <DualBanner />

      {/* 6. Women's section */}
      <TabbedSection
        title="Women"
        allProducts={womenProducts.length > 0 ? womenProducts : products}
        tabs={womenTabs}
        viewAllPath="/category/women"
        accent="#ea580c"
      />

      {/* 7. Full-width collection banner */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 64px' }}>
        <PromoBanner
          img="https://image2url.com/r2/default/images/1772108719285-5819ce0f-d8ec-4681-9ad7-4ce85935b0e8.jpeg"
          label="Exclusive Drop"
          title="Collections"
          link="/category/collections"
        />
      </div>

      {/* 8. Lookbook grid */}
      <LookbookGrid />

      {/* 9. Features bar */}
      <FeaturesBar />

      <style>{`
        @media (max-width: 700px) { .dual-banner { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

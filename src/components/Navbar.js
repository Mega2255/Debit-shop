// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const LOGO_URL = 'https://image2url.com/r2/default/images/1771744477788-d24d1011-8148-4221-8598-97f76db22f6b.png';

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const { cartCount, cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [cartPreview, setCartPreview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setUserMenu(false); }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#user-menu-wrap')) setUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openDrop = (name) => { clearTimeout(dropTimer.current); setActiveDropdown(name); };
  const closeDrop = () => { dropTimer.current = setTimeout(() => setActiveDropdown(null), 120); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ(''); setSearchOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'New Arrivals', path: '/category/new-arrivals' },
    {
      label: 'Men', path: '/category/men',
      sub: [
        { label: 'All Men', path: '/category/men' },
        { label: 'T-Shirts', path: '/category/men-tshirts' },
        { label: 'Shirts', path: '/category/men-shirts' },
        { label: 'Pants', path: '/category/men-pants' },
        { label: 'Shorts', path: '/category/men-shorts' },
        { label: 'Jackets', path: '/category/men-jackets' },
        { label: 'Jerseys', path: '/category/men-jerseys' },
        { label: 'Accessories', path: '/category/accessories' },
      ]
    },
    {
      label: 'Women', path: '/category/women',
      sub: [
        { label: 'All Women', path: '/category/women' },
        { label: 'Tops', path: '/category/women-tops' },
        { label: 'Bottoms', path: '/category/women-bottoms' },
        { label: 'Dresses', path: '/category/women-dresses' },
        { label: 'Jackets', path: '/category/women-jackets' },
        { label: 'Swimwear', path: '/category/swimwear' },
        { label: 'Jerseys', path: '/category/women-jerseys' },
        { label: 'Accessories', path: '/category/accessories' },
      ]
    },
    {
      label: 'Collections', path: '/category/collections',
      sub: [
        { label: 'Summer Capsule', path: '/category/summer-capsule' },
        { label: 'Classics', path: '/category/classics' },
        { label: 'Lookbook', path: '/lookbook' },
      ]
    },
    { label: 'Classics', path: '/category/classics' },
    { label: 'Lookbook', path: '/lookbook' },
    { label: 'Debit Citizen', path: '/debit-citizen', special: true },
  ];

  const navLinkStyle = (active) => ({
    fontFamily: "'Jost', sans-serif", fontSize: 12,
    fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase',
    color: active ? '#86efac' : '#fff',
    textDecoration: 'none', padding: '8px 0',
    borderBottom: active ? '1px solid #86efac' : '1px solid transparent',
    transition: 'color 0.2s',
    cursor: 'pointer',
  });

  /* ── Reusable avatar/login icons (shown on BOTH desktop & mobile top bar) ── */
  const UserAreaIcons = ({ isMobile }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14 }}>
      {/* Search */}
      <button onClick={() => setSearchOpen(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      {/* Cart with badge — always visible */}
      <div style={{ position: 'relative' }}
        onMouseEnter={() => !isMobile && setCartPreview(true)}
        onMouseLeave={() => !isMobile && setCartPreview(false)}
      >
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', padding: 4, position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -3, right: -5,
              background: '#ea580c', color: '#fff', borderRadius: '50%',
              width: 16, height: 16, fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount > 9 ? '9+' : cartCount}</span>
          )}
        </Link>
        {/* Cart preview — desktop only */}
        {!isMobile && cartPreview && cart.length > 0 && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 12,
            background: '#fff', border: '1px solid #e8e8e8',
            width: 300, zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            padding: '16px',
          }}>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, color: '#888' }}>Cart ({cartCount})</p>
            {cart.slice(0, 3).map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <img src={item.image || 'https://via.placeholder.com/48x58'} alt={item.name}
                  style={{ width: 44, height: 54, objectFit: 'cover', background: '#f5f5f5' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#111', marginBottom: 2 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>×{item.qty} — ₦{Number(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {cart.length > 3 && <p style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>+{cart.length - 3} more items</p>}
            <Link to="/cart" style={{ display: 'block', background: '#111', color: '#fff', textAlign: 'center', padding: '11px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginTop: 8 }}>View Cart</Link>
          </div>
        )}
      </div>

      {/* Avatar / Login — always visible on mobile too */}
      {currentUser ? (
        <div id="user-menu-wrap" style={{ position: 'relative' }}>
          <button onClick={() => setUserMenu(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ea580c, #84cc16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              {(userProfile?.name || currentUser.email)?.[0]?.toUpperCase()}
            </div>
          </button>
          {userMenu && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              background: '#fff', border: '1px solid #e8e8e8',
              minWidth: 190, zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <p style={{ padding: '12px 18px 8px', fontSize: 11, color: '#888', letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile?.name || 'My Account'}
              </p>
              {userProfile?.role === 'admin' && (
                <Link to="/admin" onClick={() => setUserMenu(false)}
                  style={{ display: 'block', padding: '11px 18px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#ea580c', fontWeight: 600, borderBottom: '1px solid #f5f5f5' }}>
                  Admin Panel
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setUserMenu(false)}
                style={{ display: 'block', padding: '11px 18px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                Dashboard
              </Link>
              <Link to="/orders" onClick={() => setUserMenu(false)}
                style={{ display: 'block', padding: '11px 18px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setUserMenu(false)}
                style={{ display: 'block', padding: '11px 18px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                Wishlist
              </Link>
              <button onClick={() => { logout(); setUserMenu(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 18px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Login icon when not logged in */
        <Link to="/login" title="Login" style={{ display: 'flex', alignItems: 'center', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>
      )}
    </div>
  );

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(22,101,52,0.98)' : 'rgba(22,101,52,0.92)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.4s ease',
      }}>
        {/* Announcement bar */}
        <div style={{
          background: '#ea580c', color: '#fff', textAlign: 'center',
          padding: '7px 16px', fontSize: 11, letterSpacing: 2,
          fontWeight: 500, textTransform: 'uppercase',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          Free shipping on orders above ₦50,000 &nbsp;|&nbsp; WhatsApp: +234 903 434 4183
        </div>

        {/* ─── MAIN NAV ROW ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64, padding: '0 20px',
          maxWidth: 1400, margin: '0 auto', position: 'relative',
        }}>

          {/* ── DESKTOP: Left nav links ── */}
          <div className="desk-only" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {navItems.slice(0, 3).map(item => (
              <div key={item.label} style={{ position: 'relative' }}
                onMouseEnter={() => item.sub && openDrop(item.label)}
                onMouseLeave={closeDrop}
              >
                <Link to={item.path} style={navLinkStyle(location.pathname === item.path)}
                  onMouseEnter={e => e.currentTarget.style.color = '#86efac'}
                  onMouseLeave={e => e.currentTarget.style.color = location.pathname === item.path ? '#86efac' : '#fff'}
                >{item.label}</Link>
                {item.sub && activeDropdown === item.label && (
                  <div onMouseEnter={() => openDrop(item.label)} onMouseLeave={closeDrop}
                    style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 16, background: '#fff', border: '1px solid #e8e8e8', minWidth: 180, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '8px 0' }}>
                    {item.sub.map(s => (
                      <Link key={s.label} to={s.path}
                        style={{ display: 'block', padding: '9px 20px', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: '#555', fontWeight: 500, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ea580c'}
                        onMouseLeave={e => e.currentTarget.style.color = '#555'}
                      >{s.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── MOBILE: Hamburger (left side) ── */}
          <button onClick={() => setMenuOpen(v => !v)} className="mob-only"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? '#86efac' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 16, height: 1.5, background: menuOpen ? '#86efac' : '#fff', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? '#86efac' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none' }} />
          </button>

          {/* ── CENTER: Logo (always centered absolutely) ── */}
          <Link to="/" style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center',
          }}>
            <img
              src={LOGO_URL}
              alt="debit"
              style={{ height: 70, width: 'auto', maxWidth: 200, objectFit: 'contain' }}
            />
          </Link>

          {/* ── DESKTOP: Right nav links + icons ── */}
          <div className="desk-only" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {navItems.slice(3).map(item => (
              <div key={item.label} style={{ position: 'relative' }}
                onMouseEnter={() => item.sub && openDrop(item.label)}
                onMouseLeave={closeDrop}
              >
                <Link to={item.path} style={{
                    ...navLinkStyle(location.pathname === item.path),
                    ...(item.special ? { color: '#86efac', borderBottom: '1px solid #86efac', fontWeight: 700 } : {}),
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ea580c'}
                  onMouseLeave={e => e.currentTarget.style.color = location.pathname === item.path || item.special ? '#ea580c' : '#111'}
                >{item.label}</Link>
                {item.sub && activeDropdown === item.label && (
                  <div onMouseEnter={() => openDrop(item.label)} onMouseLeave={closeDrop}
                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: 16, background: '#fff', border: '1px solid #e8e8e8', minWidth: 180, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '8px 0' }}>
                    {item.sub.map(s => (
                      <Link key={s.label} to={s.path}
                        style={{ display: 'block', padding: '9px 20px', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: '#555', fontWeight: 500, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ea580c'}
                        onMouseLeave={e => e.currentTarget.style.color = '#555'}
                      >{s.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Desktop icons */}
            <UserAreaIcons isMobile={false} />
          </div>

          {/* ── MOBILE: Icons always visible top-right (search + cart + avatar/login) ── */}
          <div className="mob-only" style={{ display: 'flex', alignItems: 'center' }}>
            <UserAreaIcons isMobile={true} />
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid #e8e8e8', background: '#fff', padding: '14px 20px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: 600, margin: '0 auto' }}>
              <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search for products..."
                style={{ flex: 1, border: 'none', borderBottom: '2px solid #111', padding: '10px 0', fontSize: 15, outline: 'none', background: 'transparent' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', fontSize: 18, color: '#aaa' }}>✕</button>
            </form>
          </div>
        )}

        {/* ── MOBILE: Slide-down menu ── */}
        {menuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #e8e8e8', maxHeight: '75vh', overflowY: 'auto' }}>
            {navItems.map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Link to={item.path}
                  style={{ display: 'block', padding: '14px 20px', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: item.special ? '#16a34a' : item.path === '/' ? '#16a34a' : '#111' }}>
                  {item.label}
                </Link>
                {item.sub && item.sub.map(s => (
                  <Link key={s.label} to={s.path}
                    style={{ display: 'block', padding: '9px 32px', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: '#888', borderTop: '1px solid #fafafa' }}>
                    {s.label}
                  </Link>
                ))}
              </div>
            ))}
            {/* Contact info at bottom of mobile menu */}
            <div style={{ padding: '20px', background: '#fafafa', borderTop: '2px solid #f0f0f0' }}>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>📞 +234 903 434 4183</p>
              <p style={{ fontSize: 12, color: '#888' }}>✉️ Debitbyrecent@gmail.com</p>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        /* Desktop: show desk-only, hide mob-only */
        @media (min-width: 901px) {
          .desk-only { display: flex !important; }
          .mob-only  { display: none !important; }
        }
        /* Mobile: hide desk-only, show mob-only */
        @media (max-width: 900px) {
          .desk-only { display: none !important; }
          .mob-only  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
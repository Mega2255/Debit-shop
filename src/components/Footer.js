// src/components/Footer.js - clean minimal ash-luxe style footer
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { alert('Thank you for subscribing!'); setEmail(''); }
  };

  return (
    <footer style={{ background: '#ea580c', color: '#fff', marginTop: 80 }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 40px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'block', marginBottom: 16 }}>
  <img
    src="https://image2url.com/r2/default/images/1771744477788-d24d1011-8148-4221-8598-97f76db22f6b.png"
    alt="debit"
    style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
  />
</Link>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.8, marginBottom: 24, maxWidth: 240 }}>
            The luxury destination for premium streetwear in Nigeria.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
            ].map(social => (
              <a key={social.name} href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={social.path}/></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, color: 'rgba(255,255,255,0.5)' }}>Shop</h4>
          {['New Arrivals', "Men's Collection", "Women's Collection", 'Collections', 'Classics', 'Lookbook', 'Debit Citizen'].map(link => (
            <Link key={link} to={link === 'Debit Citizen' ? '/debit-citizen' : `/category/${link.toLowerCase().replace(/[' ]/g, '-').replace(/'/g, '')}`}
              style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >{link}</Link>
          ))}
        </div>

        {/* Help */}
        <div>
          <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, color: 'rgba(255,255,255,0.5)' }}>Help</h4>
          {[
            { label: 'My Account', path: '/dashboard' },
            { label: 'Track Order', path: '/orders' },
            { label: 'Wishlist', path: '/wishlist' },
            { label: 'Contact Us', path: '/contact' },
          ].map(item => (
            <Link key={item.label} to={item.path}
              style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >{item.label}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, color: 'rgba(255,255,255,0.5)' }}>Contact</h4>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
            Lagos, Nigeria<br />
            +234 903 434 4183<br />
            Debitbyrecent@gmail.com
          </p>
          <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.5)' }}>Newsletter</h4>
          <form onSubmit={handleSubscribe} style={{ display: 'flex' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" type="email"
              style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRight: 'none', padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none' }}
            />
            <button type="submit" style={{ background: '#111', border: 'none', padding: '10px 16px', color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Join</button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)', padding: '20px 40px', maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>© 2026 debit. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Returns Policy'].map(t => (
            <a key={t} href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >{t}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

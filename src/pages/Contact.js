// src/pages/Contact.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', location: '', subject: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const msgRef = push(ref(db, 'messages'));
      await set(msgRef, { ...form, id: msgRef.key, createdAt: Date.now(), status: 'unread' });
      setSent(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error('Failed to send. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>Get In Touch</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, marginBottom: 64 }}>Contact Us</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, alignItems: 'start' }} className="contact-grid">
          {/* Info */}
          <div>
            <h3 style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>Reach Us</h3>
            {[
              { icon: '📞', label: 'Phone', value: '+234 903 434 4183' },
              { icon: '💬', label: 'WhatsApp', value: '+234 903 434 4183', link: 'https://wa.me/2349034344183' },
              { icon: '✉️', label: 'Email', value: 'Debitbyrecent@gmail.com', link: 'mailto:Debitbyrecent@gmail.com' },
              { icon: '📍', label: 'Location', value: 'Lagos, Nigeria' },
            ].map(({ icon, label, value, link }) => (
              <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 18, minWidth: 28 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#888', marginBottom: 4 }}>{label}</p>
                  {link ? <a href={link} style={{ fontSize: 14, color: '#111', borderBottom: '1px solid #e8e8e8', paddingBottom: 1, transition: 'color 0.2s, border-color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ea580c'; e.currentTarget.style.borderColor = '#ea580c'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#e8e8e8'; }}
                  >{value}</a>
                  : <p style={{ fontSize: 14, color: '#555' }}>{value}</p>}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 24, marginTop: 12 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#888', marginBottom: 12 }}>Hours</p>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>
                Mon – Fri: 9am – 6pm WAT<br />
                Saturday: 10am – 4pm WAT<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ border: '1px solid #e8e8e8', padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 12 }}>Message Sent!</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', location: '', subject: '', description: '' }); }}
                style={{ border: '1px solid #111', background: 'transparent', padding: '12px 32px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ border: '1px solid #e8e8e8', padding: 40 }}>
              <h3 style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 28 }}>Send a Message</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }} className="form-grid2">
                {[
                  { key: 'name', label: 'Full Name *', type: 'text', span: false },
                  { key: 'email', label: 'Email *', type: 'email', span: false },
                  { key: 'location', label: 'Your Location', type: 'text', span: false },
                  { key: 'subject', label: 'Subject', type: 'text', span: false },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.span ? '1 / -1' : 'span 1', marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555', marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: 14, outline: 'none', background: 'transparent', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#ea580c'}
                      onBlur={e => e.target.style.borderColor = '#ddd'}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555', marginBottom: 8 }}>Message *</label>
                <textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="How can we help you?"
                  style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: 14, outline: 'none', background: 'transparent', resize: 'none', boxSizing: 'border-box', fontFamily: "'Jost', sans-serif", transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#ea580c'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: loading ? '#888' : '#111', color: '#fff',
                border: 'none', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ea580c'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#111'; }}
              >{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .form-grid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// src/pages/ReturnPolicy.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function ReturnPolicy() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>

      {/* Hero header */}
      <div style={{ background: '#111', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: '#ea580c', fontWeight: 700, marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.1 }}>Return Policy</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16, letterSpacing: 1 }}>DebitbyRecent · Lagos, Nigeria</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 40px 0' }}>
        <p style={{ fontSize: 12, color: '#bbb' }}>
          <Link to="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</Link>
          {' '}/{' '}
          <span style={{ color: '#ea580c' }}>Return Policy</span>
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 100px' }}>

        {/* Quick summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 56 }}>
          {[
            { icon: '📅', title: '14 Days', desc: 'Return window from delivery date' },
            { icon: '🏷️', title: 'Tags On', desc: 'Unworn, unwashed with all tags attached' },
            { icon: '📦', title: 'Original Pack', desc: 'Original packaging required' },
            { icon: '💳', title: 'Refund', desc: 'Back to original payment method' },
          ].map(c => (
            <div key={c.title} style={{ border: '1px solid #e8e8e8', padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#ea580c', marginBottom: 6 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <Section title="Return Conditions">
          <p>To be eligible for a return, the following conditions must be met:</p>
          <ul>
            <li>Return must be initiated within <strong>14 days</strong> of the delivery date</li>
            <li>Item must be <strong>unworn and unwashed</strong></li>
            <li>All original tags must be attached</li>
            <li>Original packaging and proof of purchase are required</li>
          </ul>
        </Section>

        <Section title="Refund Process">
          <ul>
            <li>Approved refunds will be issued to your <strong>original payment method</strong></li>
            <li>Shipping fees are non-refundable and will be deducted from the refund amount</li>
            <li>Please allow 5–10 business days for the refund to reflect after approval</li>
          </ul>
        </Section>

        <Section title="Non-Returnable Items">
          <div style={{ background: '#fff5f5', border: '1px solid #fee2e2', borderLeft: '3px solid #ef4444', padding: '16px 20px', borderRadius: 2 }}>
            <p style={{ color: '#dc2626', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>⚠️ The following items cannot be returned:</p>
            <ul style={{ color: '#555', margin: 0 }}>
              <li>Sale items and final sale items</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Items without original tags or packaging</li>
            </ul>
          </div>
        </Section>

        <Section title="Return Shipping">
          <ul>
            <li>The customer is responsible for return shipping costs</li>
            <li>We recommend using a trackable shipping method — we are not responsible for lost return packages</li>
          </ul>
        </Section>

        <Section title="Damaged or Defective Items">
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #16a34a', padding: '16px 20px', borderRadius: 2 }}>
            <p style={{ color: '#15803d', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>✓ We've got you covered</p>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8 }}>
              If you received a damaged or defective item, please contact us immediately. We will provide a <strong>free return label</strong> and arrange a replacement or full refund at no cost to you.
            </p>
          </div>
        </Section>

        <Section title="How to Start a Return">
          <ol>
            <li>Email us at <a href="mailto:debitbyrecent@gmail.com" style={{ color: '#ea580c' }}>debitbyrecent@gmail.com</a> with your order number and reason for return</li>
            <li>Wait for our confirmation and return instructions</li>
            <li>Pack the item securely in original packaging</li>
            <li>Ship back using a trackable method</li>
            <li>Receive your refund within 5–10 business days of our receiving the item</li>
          </ol>
        </Section>

        <Section title="Contact Us">
          <p>For any questions about returns or refunds:</p>
          <ContactBox />
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #f0f0f0' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 400, color: '#ea580c', marginBottom: 20, letterSpacing: 0.5 }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#444', lineHeight: 1.9 }}>
        {children}
      </div>
    </div>
  );
}

function ContactBox() {
  return (
    <div style={{ background: '#fafafa', border: '1px solid #e8e8e8', padding: '24px 28px', marginTop: 16, borderLeft: '3px solid #ea580c' }}>
      <p style={{ fontSize: 14, color: '#333', marginBottom: 6 }}>
        📧 <a href="mailto:debitbyrecent@gmail.com" style={{ color: '#ea580c', fontWeight: 600 }}>debitbyrecent@gmail.com</a>
      </p>
      <p style={{ fontSize: 14, color: '#555' }}>📍 DebitbyRecent, Lagos, Nigeria</p>
    </div>
  );
}

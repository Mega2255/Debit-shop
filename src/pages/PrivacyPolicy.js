// src/pages/PrivacyPolicy.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>

      {/* Hero header */}
      <div style={{ background: '#111', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: '#ea580c', fontWeight: 700, marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.1 }}>Privacy Policy</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16, letterSpacing: 1 }}>DebitbyRecent · Lagos, Nigeria</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 40px 0' }}>
        <p style={{ fontSize: 12, color: '#bbb' }}>
          <Link to="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</Link>
          {' '}/{' '}
          <span style={{ color: '#ea580c' }}>Privacy Policy</span>
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 100px' }}>

        <Section title="What We Collect">
          <p>We collect the following information when you use our site or place an order:</p>
          <ul>
            <li><strong>Personal details</strong> — name, email address, phone number, delivery address</li>
            <li><strong>Payment information</strong> — processed securely via our payment processor; we do not store your card details</li>
            <li><strong>Technical data</strong> — IP address, device type, browser, and cookies</li>
          </ul>
        </Section>

        <Section title="How We Use It">
          <p>Your information is used to:</p>
          <ul>
            <li>Process and fulfil your orders</li>
            <li>Arrange shipping and delivery</li>
            <li>Communicate order updates and support</li>
            <li>Improve our site and shopping experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with applicable laws and regulations</li>
          </ul>
        </Section>

        <Section title="Who We Share With">
          <p>We may share your data with:</p>
          <ul>
            <li><strong>Payment processors</strong> — to handle transactions securely</li>
            <li><strong>Shipping companies</strong> — to deliver your orders</li>
            <li><strong>Service providers</strong> — who help us operate the site</li>
            <li><strong>Authorities</strong> — if required by law</li>
          </ul>
          <p style={{ marginTop: 12, fontWeight: 600, color: '#16a34a' }}>✓ We do not sell your personal data to any third party.</p>
        </Section>

        <Section title="Cookies">
          <p>We use cookies for site functionality, analytics, and advertising. You can manage cookie preferences through our cookie banner or your browser settings.</p>
        </Section>

        <Section title="Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of certain uses of your data</li>
          </ul>
          <p style={{ marginTop: 12 }}>To exercise any of these rights, contact us at <a href="mailto:debitbyrecent@gmail.com" style={{ color: '#ea580c' }}>debitbyrecent@gmail.com</a>.</p>
        </Section>

        <Section title="Security">
          <p>We take reasonable technical and organisational measures to protect your data. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="Children">
          <p>Our site is not intended for children under the age of 15. We do not knowingly collect personal data from anyone under 15.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance.</p>
        </Section>

        <Section title="Contact Us">
          <p>For any privacy-related questions or requests:</p>
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

// src/pages/TermsOfService.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>

      {/* Hero header */}
      <div style={{ background: '#111', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: '#ea580c', fontWeight: 700, marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.1 }}>Terms of Service</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16, letterSpacing: 1 }}>DebitbyRecent · Lagos, Nigeria</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 40px 0' }}>
        <p style={{ fontSize: 12, color: '#bbb' }}>
          <Link to="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</Link>
          {' '}/{' '}
          <span style={{ color: '#ea580c' }}>Terms of Service</span>
        </p>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 40px 0' }}>
        <div style={{ background: '#fff8f5', border: '1px solid #fde8d8', borderLeft: '3px solid #ea580c', padding: '20px 24px', borderRadius: 2 }}>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>
            By using <strong>debitbyrecent.com</strong> ("Site") or purchasing from DebitbyRecent, you agree to these Terms of Service. Please read them carefully before using our site.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 100px' }}>

        <Section number="1" title="Use of Site">
          <ul>
            <li>You must be <strong>18 years or older</strong>, or have parental or guardian consent, to use this site</li>
            <li>You agree not to use the site for any unlawful purpose</li>
            <li>You agree not to interfere with the operation or security of the site</li>
          </ul>
        </Section>

        <Section number="2" title="Orders & Payment">
          <ul>
            <li>All orders are subject to acceptance and availability</li>
            <li>Prices are listed in <strong>Nigerian Naira (NGN)</strong> and exclude taxes and shipping unless stated otherwise</li>
            <li>Payment is processed via a secure third-party payment processor</li>
            <li>We reserve the right to cancel or refund any order at our discretion</li>
          </ul>
        </Section>

        <Section number="3" title="Shipping & Delivery">
          <ul>
            <li>Shipping times provided are estimates only and are not guaranteed</li>
            <li>Risk of loss passes to you upon delivery</li>
            <li>Any customs duties, taxes, or import fees for international orders are your responsibility</li>
          </ul>
        </Section>

        <Section number="4" title="Returns & Refunds">
          <ul>
            <li>Please see our <Link to="/return-policy" style={{ color: '#ea580c', fontWeight: 600 }}>Return Policy</Link> for full details</li>
            <li>No refunds on sale or final sale items</li>
          </ul>
        </Section>

        <Section number="5" title="Intellectual Property">
          <ul>
            <li>All content, designs, logos, and materials on this site are the property of DebitbyRecent</li>
            <li>No unauthorised use, reproduction, distribution, or resale of any content is permitted</li>
          </ul>
        </Section>

        <Section number="6" title="Limitation of Liability">
          <ul>
            <li>DebitbyRecent is not liable for any indirect, consequential, or incidental damages arising from your use of the site or products</li>
            <li>Our maximum liability to you shall not exceed the value of your order</li>
          </ul>
        </Section>

        <Section number="7" title="Governing Law">
          <p>These terms are governed by the laws of the <strong>Federal Republic of Nigeria</strong>. Any disputes shall be resolved in the courts of <strong>Lagos, Nigeria</strong>.</p>
        </Section>

        <Section number="8" title="Changes to These Terms">
          <p>We may update these Terms of Service at any time. Changes will be posted on this page. Your continued use of the site after changes are posted constitutes your acceptance of the updated terms.</p>
        </Section>

        <Section number="" title="Contact Us">
          <p>For any questions about these terms:</p>
          <ContactBox />
        </Section>

      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #f0f0f0' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 400, color: '#ea580c', marginBottom: 20, letterSpacing: 0.5 }}>
        {number && <span style={{ color: '#ddd', marginRight: 10, fontSize: '0.85em' }}>{number}.</span>}{title}
      </h2>
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

// src/pages/AboutUs.js
import React from 'react';

const FOCUS_POINTS = [
  'Premium quality materials and construction',
  'Limited, carefully curated collections',
  'Timeless streetwear with a modern Nigerian identity',
  'An exclusive shopping experience',
];

export default function AboutUs() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '140px 20px 80px' }}>
      <p style={{
        fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3,
        textTransform: 'uppercase', color: '#ea580c', fontWeight: 600, marginBottom: 14,
        textAlign: 'center',
      }}>
        The Luxury Destination for Streetwear
      </p>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300,
        color: '#111', textAlign: 'center', marginBottom: 40, lineHeight: 1.15,
      }}>
        About Debit
      </h1>

      <div style={{
        fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.9,
        color: '#444', display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <p>
          Debit is the luxury destination for premium streetwear in Nigeria.
        </p>
        <p>
          Born from a vision to redefine street fashion with quality, edge, and
          exclusivity, Debit delivers elevated essentials and statement pieces
          designed for those who move differently. From Lagos, we craft clothing
          that blends bold street culture with refined luxury — clean silhouettes,
          superior fabrics, and details that stand out without trying too hard.
        </p>
        <p>
          Founded under the creative direction of OGB Recent, Debit represents more
          than apparel. It's a lifestyle brand for the new generation of Nigerian
          style — confident, authentic, and unapologetically premium. Every piece is
          made to be worn with pride, whether you're stepping out in the city or
          making a statement wherever you go.
        </p>
      </div>

      {/* Focus points */}
      <div style={{ marginTop: 48 }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2,
          textTransform: 'uppercase', fontWeight: 700, color: '#111', marginBottom: 18,
        }}>
          We Focus On
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {FOCUS_POINTS.map(point => (
            <div key={point} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '18px 20px', background: '#f7f7f5', borderLeft: '3px solid #ea580c',
            }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#444', lineHeight: 1.6 }}>
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pull quote */}
      <blockquote style={{
        marginTop: 48, padding: '28px 32px', background: '#111',
        fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic',
        color: '#fff', lineHeight: 1.6, textAlign: 'center',
      }}>
        Debit is for the ones who understand that true style isn't loud — it's intentional.
      </blockquote>

      {/* Tagline */}
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: '#166534', marginBottom: 4 }}>
          Debit.
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#888' }}>
          The luxury destination for streetwear.
        </p>
      </div>

      {/* Contact */}
      <div style={{
        marginTop: 56, padding: '32px', background: '#f7f7f5',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3,
          textTransform: 'uppercase', fontWeight: 700, color: '#111', marginBottom: 14,
        }}>
          Contact
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#444', marginBottom: 6 }}>
          Lagos, Nigeria
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#444', marginBottom: 6 }}>
          +234 903 434 4183
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#444' }}>
          debitbyrecent@gmail.com
        </p>
      </div>
    </div>
  );
}
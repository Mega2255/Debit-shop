// src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';




// ─────────────────────────────────────────────
// Detect garment/accessory type from category + name
// ─────────────────────────────────────────────
function detectGarmentType(product) {
  const text = ((product.category || '') + ' ' + (product.name || '')).toLowerCase();
  // Accessories — checked FIRST (more specific)
  if (/glass|spec|sunglass|goggle|eyewear|shade/.test(text)) return 'glasses';
  if (/hat|cap|beanie|beret|turban|headwear|headband|snapback|bucket\s*hat|fedora|helmet|bonnet|durag|headscarf/.test(text)) return 'headwear';
  if (/belt|waist\s*band/.test(text)) return 'belt';
  if (/sock|ankle\s*wear|stocking/.test(text)) return 'socks';
  if (/shoe|sneaker|boot|sandal|slipper|footwear|loafer|heel|trainer/.test(text)) return 'shoes';
  if (/bag|backpack|handbag|purse|tote|clutch|wallet/.test(text)) return 'bag';
  if (/watch|bracelet|necklace|ring|chain|jewel/.test(text)) return 'accessory';
  // Clothing
  if (/pant|trouser|jeans|denim|chino|legging|jogger/.test(text)) return 'pants';
  if (/short|nikker|knicker|boxer|brief|underwear|swim/.test(text)) return 'shorts';
  if (/dress|gown|skirt/.test(text)) return 'dress';
  if (/jacket|hoodie|coat|blazer|cardigan|sweater|sweatshirt/.test(text)) return 'jacket';
  return 'shirt';
}

// ── Virtual Try-On Modal ──
function VirtualTryOn({ product, onClose }) {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const garmentType = detectGarmentType(product);

  const startTryOn = () => {
    setPhase('scanning');
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 1.4;
      const next = Math.min(Math.round(p), 100);
      setProgress(next);
      if (next >= 100) { clearInterval(iv); setTimeout(() => setPhase('result'), 250); }
    }, 22);
  };

  const reset = () => { setPhase('idle'); setProgress(0); };
  const shown = phase === 'result';

  const garmentLabel = {
    shirt: 'Top / Shirt', jacket: 'Jacket', pants: 'Trousers / Pants',
    shorts: 'Shorts / Underwear', dress: 'Dress / Skirt',
    glasses: 'Glasses / Eyewear', headwear: 'Hat / Headwear',
    belt: 'Belt', socks: 'Socks', shoes: 'Shoes / Footwear',
    bag: 'Bag', accessory: 'Accessory',
  }[garmentType] || 'Garment';

  // ── SVG PATH CONSTANTS (viewBox 320 × 580) ──
  const SHIRT_BODY = 'M 104 178 C 88 184 74 200 70 222 L 68 338 L 252 338 L 250 222 C 246 200 232 184 216 178 C 204 168 184 161 160 159 C 136 161 116 168 104 178 Z';
  const SLV_LEFT   = 'M 104 178 C 88 184 74 200 70 222 L 40 280 C 34 298 32 318 36 332 L 72 322 C 70 308 72 290 78 274 L 98 226 L 104 178 Z';
  const SLV_RIGHT  = 'M 216 178 C 232 184 246 200 250 222 L 280 280 C 286 298 288 318 284 332 L 248 322 C 250 308 248 290 242 274 L 222 226 L 216 178 Z';
  const FULL_SHIRT = `${SHIRT_BODY} ${SLV_LEFT} ${SLV_RIGHT}`;
  const SHORTS_L   = 'M 100 330 C 96 360 94 390 95 430 L 155 430 C 155 395 156 360 157 330 Z';
  const SHORTS_R   = 'M 220 330 C 224 360 226 390 225 430 L 165 430 C 165 395 164 360 163 330 Z';
  const FULL_SHORTS = `${SHORTS_L} ${SHORTS_R}`;
  const PANTS_L    = 'M 100 330 C 96 380 92 440 90 500 C 88 520 88 534 89 548 L 152 548 C 152 534 152 520 153 500 C 155 456 157 396 158 340 Z';
  const PANTS_R    = 'M 220 330 C 224 380 228 440 230 500 C 232 520 232 534 231 548 L 168 548 C 168 534 168 520 167 500 C 165 456 163 396 162 340 Z';
  const FULL_PANTS = `${PANTS_L} ${PANTS_R}`;
  const DRESS_BODY = 'M 104 178 C 88 184 74 200 70 232 C 60 280 58 330 62 400 C 66 460 76 510 88 548 L 232 548 C 244 510 254 460 258 400 C 262 330 260 280 250 232 C 246 200 232 184 216 178 C 204 168 184 161 160 159 C 136 161 116 168 104 178 Z';

  // Belt clip: thin horizontal band across waist (y 326–352)
  const BELT_PATH  = 'M 88 326 C 88 318 120 312 160 312 C 200 312 232 318 232 326 L 232 352 C 232 360 200 366 160 366 C 120 366 88 360 88 352 Z';

  // Socks clip: both ankles/lower-legs y=490–568
  const SOCK_L     = 'M 96 490 C 94 514 93 534 94 548 C 94 556 96 564 100 568 L 150 568 C 154 564 156 556 156 548 C 157 534 157 514 155 490 Z';
  const SOCK_R     = 'M 224 490 C 226 514 227 534 226 548 C 226 556 224 564 220 568 L 170 568 C 166 564 164 556 164 548 C 163 534 163 514 165 490 Z';
  const FULL_SOCKS = `${SOCK_L} ${SOCK_R}`;

  // Shoes clip: both feet y=540–572
  const SHOE_L     = 'M 88 540 C 86 548 86 558 90 564 L 154 564 C 158 558 158 548 154 540 Z';
  const SHOE_R     = 'M 166 540 C 162 548 162 558 166 564 L 230 564 C 234 558 234 548 230 540 Z';
  const FULL_SHOES = `${SHOE_L} ${SHOE_R}`;

  // Glasses clip: across eye zone y=68–96, x=118–202
  const GLASSES_PATH = 'M 118 68 L 202 68 L 202 96 L 118 96 Z';

  // Headwear clip: top of head y=14–68
  const HEADWEAR_PATH = 'M 110 68 C 110 30 130 12 160 10 C 190 12 210 30 210 68 Z';

  const isUpper   = garmentType === 'shirt' || garmentType === 'jacket';
  const isDress   = garmentType === 'dress';
  const isPants   = garmentType === 'pants';
  const isShorts  = garmentType === 'shorts';
  const isBelt    = garmentType === 'belt';
  const isSocks   = garmentType === 'socks';
  const isShoes   = garmentType === 'shoes';
  const isGlasses = garmentType === 'glasses';
  const isHeadwear= garmentType === 'headwear';
  const isLower   = isPants || isShorts;

  // garment path & image bounds per type
  const garmentPath = isDress ? DRESS_BODY
    : isUpper ? FULL_SHIRT
    : isPants ? FULL_PANTS
    : isShorts ? FULL_SHORTS
    : isBelt ? BELT_PATH
    : isSocks ? FULL_SOCKS
    : isShoes ? FULL_SHOES
    : isGlasses ? GLASSES_PATH
    : isHeadwear ? HEADWEAR_PATH
    : FULL_SHIRT;

  const imgProps = (() => {
    if (isUpper || isDress)  return { x: 32,  y: 148, w: 256, h: 210 };
    if (isPants)             return { x: 70,  y: 300, w: 180, h: 265 };
    if (isShorts)            return { x: 80,  y: 305, w: 160, h: 148 };
    if (isBelt)              return { x: 82,  y: 308, w: 156, h: 62  };
    if (isSocks)             return { x: 86,  y: 482, w: 148, h: 92  };
    if (isShoes)             return { x: 80,  y: 532, w: 160, h: 44  };
    if (isGlasses)           return { x: 112, y: 62,  w: 96,  h: 40  };
    if (isHeadwear)          return { x: 106, y: 8,   w: 108, h: 68  };
    return { x: 32, y: 148, w: 256, h: 210 };
  })();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(6,6,9,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px 16px', overflowY: 'auto',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'fixed', top: 16, right: 18,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#888', width: 34, height: 34, borderRadius: '50%',
        fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10, transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      >✕</button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 340 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>
            Virtual Try-On · {garmentLabel}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 300, color: '#e0e0e0', lineHeight: 1.25, margin: 0 }}>
            {product.name}
          </h2>
        </div>

        {/* ── CANVAS ── */}
        <div style={{
          width: '100%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(168deg, #16161b 0%, #0e0e12 100%)',
          borderRadius: 4,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.8)',
          marginBottom: 14,
        }}>
          <svg viewBox="0 0 320 580" style={{ display: 'block', width: '100%' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Skin */}
              <linearGradient id="skBody" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#d4956a"/><stop offset="100%" stopColor="#b87040"/>
              </linearGradient>
              <linearGradient id="skFace" x1="0" y1="0" x2="0.1" y2="1">
                <stop offset="0%" stopColor="#e2a878"/><stop offset="100%" stopColor="#c47040"/>
              </linearGradient>
              {/* Trousers */}
              <linearGradient id="trL" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e2438"/><stop offset="100%" stopColor="#121624"/>
              </linearGradient>
              <linearGradient id="trR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e2438"/><stop offset="100%" stopColor="#121624"/>
              </linearGradient>
              {/* Idle garment dark fill */}
              <linearGradient id="idleFill" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#2a2a2a"/><stop offset="100%" stopColor="#1c1c1c"/>
              </linearGradient>
              {/* Scan line */}
              <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent"/>
                <stop offset="25%" stopColor="#00e5ff" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#fff"/>
                <stop offset="75%" stopColor="#00e5ff" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <linearGradient id="scanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
              </linearGradient>
              {/* Clip paths */}
              <clipPath id="gc"><path d={garmentPath} fillRule="nonzero"/></clipPath>
              <clipPath id="bodyOnly"><path d={SHIRT_BODY}/></clipPath>
              <clipPath id="lowerOnly"><path d={isShorts ? FULL_SHORTS : FULL_PANTS} fillRule="nonzero"/></clipPath>
              {/* Filters */}
              <filter id="fsh" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.55"/>
              </filter>
              <filter id="fshSm" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.4"/>
              </filter>
              <filter id="glassBlur">
                <feGaussianBlur stdDeviation="0.5"/>
              </filter>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="160" cy="574" rx="80" ry="7" fill="rgba(0,0,0,0.45)"/>

            {/* ══ SHOES (base, always drawn) ══ */}
            <path d="M 94 540 C 92 548 92 558 95 562 L 154 562 C 157 558 157 548 154 540 Z" fill="#111"/>
            <path d="M 92 556 C 92 562 96 566 102 567 L 150 567 C 156 566 157 562 155 556 Z" fill="#0a0a0a"/>
            <path d="M 92 562 Q 123 568 155 562" fill="none" stroke="#1a1a1a" strokeWidth="1.2"/>
            <path d="M 166 540 C 163 548 163 558 166 562 L 225 562 C 228 558 228 548 225 540 Z" fill="#111"/>
            <path d="M 164 556 C 164 562 168 566 174 567 L 222 567 C 228 566 229 562 227 556 Z" fill="#0a0a0a"/>
            <path d="M 164 562 Q 195 568 227 562" fill="none" stroke="#1a1a1a" strokeWidth="1.2"/>

            {/* ══ SOCKS (above shoes, always drawn as neutral) ══ */}
            <path d={SOCK_L} fill="#222" opacity="0.7"/>
            <path d={SOCK_R} fill="#222" opacity="0.7"/>

            {/* ══ LEGS / TROUSERS ══ */}
            <path d="M 112 332 C 108 382 104 440 102 496 C 100 518 100 534 101 548 L 152 548 C 152 534 152 518 153 494 C 155 454 157 396 158 344 Z" fill="url(#trL)"/>
            <path d="M 208 332 C 212 382 216 440 218 496 C 220 518 220 534 219 548 L 168 548 C 168 534 168 518 167 494 C 165 454 163 396 162 344 Z" fill="url(#trR)"/>
            <path d="M 112 332 C 130 350 160 352 208 332 L 202 344 C 178 360 142 360 118 344 Z" fill="#171b2c"/>
            <line x1="120" y1="346" x2="108" y2="546" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
            <line x1="200" y1="346" x2="212" y2="546" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>

            {/* ══ UPPER BODY idle shirt silhouette (when not shirt result) ══ */}
            {(isUpper || isDress) && !shown && (
              <path d={isDress ? DRESS_BODY : FULL_SHIRT} fill="url(#idleFill)" fillRule="nonzero"/>
            )}
            {(isShorts) && !shown && (
              <path d={FULL_SHORTS} fill="url(#idleFill)" fillRule="nonzero"/>
            )}

            {/* ══════════════════════════════════════════
                RESULT — product image as garment fabric
            ══════════════════════════════════════════ */}
            {shown && (
              <g>
                {/* ── IMAGE fills the clip region ── */}
                {product.image ? (
                  <image href={product.image} x={imgProps.x} y={imgProps.y}
                    width={imgProps.w} height={imgProps.h}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#gc)"/>
                ) : (
                  <path d={garmentPath} fill="#555" fillRule="nonzero"/>
                )}

                {/* ── UPPER garment shading & details ── */}
                {(isUpper || isDress) && <>
                  {/* Left body shadow */}
                  <path d="M 104 178 C 88 184 74 200 70 222 L 68 338 L 138 338 L 138 165 C 124 168 113 174 104 178 Z"
                    fill="rgba(0,0,0,0.24)" clipPath="url(#bodyOnly)"/>
                  {/* Right body shadow */}
                  <path d="M 216 178 C 232 184 246 200 250 222 L 252 338 L 190 338 L 190 165 C 204 168 212 174 216 178 Z"
                    fill="rgba(0,0,0,0.18)" clipPath="url(#bodyOnly)"/>
                  {/* Chest highlight */}
                  <path d="M 140 159 L 180 159 L 190 200 L 186 338 L 134 338 L 130 200 Z"
                    fill="rgba(255,255,255,0.055)" clipPath="url(#bodyOnly)"/>
                  {/* Sleeve shading */}
                  <path d={SLV_LEFT}  fill="rgba(0,0,0,0.30)"/>
                  <path d={SLV_RIGHT} fill="rgba(255,255,255,0.04)"/>
                  {/* Edge vignette */}
                  <path d={FULL_SHIRT} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="12" fillRule="nonzero"/>
                  {/* Seams & hem */}
                  <path d="M 68 332 Q 160 342 252 332" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="3"/>
                  <path d="M 70 222 C 68 270 68 308 68 338" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5"/>
                  <path d="M 250 222 C 252 270 252 308 252 338" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5"/>
                  <path d="M 34 324 Q 54 334 72 326" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5"/>
                  <path d="M 286 324 Q 266 334 248 326" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5"/>
                  {/* Collar */}
                  <path d="M 136 172 C 136 162 142 154 160 152 C 178 154 184 162 184 172 L 178 180 C 170 174 166 171 160 171 C 154 171 150 174 142 180 Z"
                    fill="#f2eeea" filter="url(#fshSm)"/>
                  <path d="M 142 180 C 132 192 120 210 118 228 L 134 223 C 136 208 144 194 152 184 Z" fill="#ece8e3"/>
                  <path d="M 178 180 C 188 192 200 210 202 228 L 186 223 C 184 208 176 194 168 184 Z" fill="#ece8e3"/>
                  <path d="M 136 181 C 145 187 155 190 160 190 C 165 190 175 187 184 181" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2"/>
                  {/* Buttons */}
                  <line x1="160" y1="194" x2="160" y2="336" stroke="rgba(0,0,0,0.13)" strokeWidth="1.5"/>
                  {[212,237,262,287,312].map((y,i) => (
                    <g key={i}>
                      <circle cx="160" cy={y} r="3.5" fill="#ddd" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8"/>
                      <line x1="158.6" y1={y} x2="161.4" y2={y} stroke="rgba(0,0,0,0.28)" strokeWidth="0.7"/>
                      <line x1="160" y1={y-1.4} x2="160" y2={y+1.4} stroke="rgba(0,0,0,0.28)" strokeWidth="0.7"/>
                    </g>
                  ))}
                </>}

                {/* ── DRESS flare ── */}
                {isDress && <>
                  <path d="M 88 340 C 72 380 68 440 72 510 L 100 510 C 96 444 98 382 104 342 Z" fill="rgba(0,0,0,0.2)"/>
                  <path d="M 232 340 C 248 380 252 440 248 510 L 220 510 C 224 444 222 382 216 342 Z" fill="rgba(0,0,0,0.2)"/>
                  <path d="M 68 542 Q 160 554 252 542" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5"/>
                  <path d={DRESS_BODY} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="10"/>
                </>}

                {/* ── LOWER garment (shorts / pants) ── */}
                {(isShorts || isPants) && <>
                  <path d={isPants ? PANTS_L : SHORTS_L} fill="rgba(0,0,0,0.22)"/>
                  <path d={isPants ? PANTS_R : SHORTS_R} fill="rgba(255,255,255,0.04)"/>
                  <path d="M 158 332 C 159 355 161 370 162 332" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5"/>
                  <path d={isPants ? FULL_PANTS : FULL_SHORTS} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="10" fillRule="nonzero"/>
                  <path d="M 100 330 Q 160 340 220 330" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2"/>
                  <line x1="130" y1="342" x2="120" y2={isPants?548:432} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2"/>
                  <line x1="190" y1="342" x2="200" y2={isPants?548:432} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2"/>
                  <path d={isPants
                    ? 'M 90 544 Q 124 552 155 548 M 165 548 Q 196 552 230 544'
                    : 'M 95 426 Q 127 434 157 430 M 163 430 Q 193 434 225 426'}
                    fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2"/>
                </>}

                {/* ══ BELT shading & buckle ══ */}
                {isBelt && <>
                  {/* Edge vignette */}
                  <path d={BELT_PATH} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="8"/>
                  {/* Left shadow */}
                  <path d="M 88 326 C 88 318 120 312 160 312 L 160 366 C 120 366 88 360 88 352 Z" fill="rgba(0,0,0,0.22)"/>
                  {/* Stitching top/bottom */}
                  <path d="M 90 330 Q 160 323 230 330" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
                  <path d="M 90 348 Q 160 355 230 348" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
                  {/* Buckle */}
                  <rect x="146" y="322" width="28" height="26" rx="3" fill="#c8a050" stroke="#a07830" strokeWidth="1.5"/>
                  <rect x="150" y="326" width="20" height="18" rx="2" fill="none" stroke="#806020" strokeWidth="1"/>
                  {/* Buckle pin */}
                  <line x1="160" y1="326" x2="160" y2="344" stroke="#806020" strokeWidth="2" strokeLinecap="round"/>
                  {/* Buckle highlight */}
                  <path d="M 148 324 L 170 324" stroke="rgba(255,220,100,0.5)" strokeWidth="1" strokeLinecap="round"/>
                  {/* Belt holes */}
                  {[178,192,206,220].map((x,i) => (
                    <ellipse key={i} cx={x} cy="339" rx="2.5" ry="3.5" fill="rgba(0,0,0,0.4)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
                  ))}
                </>}

                {/* ══ SOCKS shading & details ══ */}
                {isSocks && <>
                  {/* Left sock shading */}
                  <path d={SOCK_L} fill="rgba(0,0,0,0.28)"/>
                  <path d={SOCK_L} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="8"/>
                  {/* Sock cuff top */}
                  <path d="M 94 492 Q 124 486 155 492" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5"/>
                  {/* Sock ribbing lines left */}
                  {[502,512,522,532].map((y,i) => (
                    <path key={i} d={`M 96 ${y} Q 124 ${y-3} 154 ${y}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                  ))}
                  {/* Right sock shading */}
                  <path d={SOCK_R} fill="rgba(0,0,0,0.28)"/>
                  <path d={SOCK_R} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="8"/>
                  <path d="M 165 492 Q 195 486 226 492" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5"/>
                  {[502,512,522,532].map((y,i) => (
                    <path key={i} d={`M 166 ${y} Q 195 ${y-3} 225 ${y}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                  ))}
                </>}

                {/* ══ SHOES shading & sole details ══ */}
                {isShoes && <>
                  <path d={FULL_SHOES} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="8" fillRule="nonzero"/>
                  {/* Left shoe sole line */}
                  <path d="M 88 558 Q 122 565 156 560" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3"/>
                  {/* Right shoe sole line */}
                  <path d="M 164 558 Q 197 565 232 560" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3"/>
                  {/* Left toe cap highlight */}
                  <path d="M 92 542 Q 100 538 116 540" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M 168 542 Q 176 538 192 540" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
                </>}

                {/* ══ GLASSES — frame, lens tint, nose bridge, arms ══ */}
                {isGlasses && <>
                  {/* Lens tint (the image is the frame/lens texture) */}
                  <path d={GLASSES_PATH} fill="rgba(0,0,0,0.18)" clipPath="url(#gc)"/>
                  {/* Left lens frame */}
                  <rect x="118" y="69" width="36" height="24" rx="8"
                    fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2.5"/>
                  {/* Right lens frame */}
                  <rect x="166" y="69" width="36" height="24" rx="8"
                    fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2.5"/>
                  {/* Nose bridge */}
                  <path d="M 154 81 Q 160 78 166 81" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round"/>
                  {/* Temple arms */}
                  <path d="M 118 76 C 110 76 106 80 104 86" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M 202 76 C 210 76 214 80 216 86" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round"/>
                  {/* Lens glare highlight */}
                  <path d="M 122 72 Q 126 70 130 72" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M 170 72 Q 174 70 178 72" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                  {/* Edge vignette */}
                  <path d={GLASSES_PATH} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4"/>
                </>}

                {/* ══ HEADWEAR — brim, crown seam, shadow on forehead ══ */}
                {isHeadwear && <>
                  {/* Brim / visor shadow on forehead */}
                  <path d="M 110 68 C 118 74 142 78 160 78 C 178 78 202 74 210 68" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="6" strokeLinecap="round"/>
                  {/* Crown seam */}
                  <path d="M 160 10 L 160 68" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeDasharray="3,3"/>
                  {/* Left panel shadow */}
                  <path d="M 110 68 C 110 30 130 12 160 10 L 160 68 Z" fill="rgba(0,0,0,0.18)"/>
                  {/* Edge vignette */}
                  <path d={HEADWEAR_PATH} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="8"/>
                  {/* Forehead shadow from hat */}
                  <path d="M 116 68 Q 160 75 204 68 Q 204 80 160 82 Q 116 80 116 68 Z" fill="rgba(0,0,0,0.14)"/>
                </>}
              </g>
            )}

            {/* ══ FOREARMS & HANDS (always on top of sleeves) ══ */}
            <path d="M 36 328 C 32 344 32 362 36 376 L 60 368 C 58 354 58 338 62 324 Z" fill="url(#skBody)"/>
            <path d="M 34 374 C 32 386 34 400 40 406 C 48 414 62 410 66 402 C 70 393 68 379 62 370 Z" fill="url(#skBody)"/>
            <path d="M 36 386 Q 42 396 50 398" fill="none" stroke="rgba(140,80,40,0.3)" strokeWidth="1"/>
            <path d="M 284 328 C 288 344 288 362 284 376 L 260 368 C 262 354 262 338 258 324 Z" fill="url(#skBody)"/>
            <path d="M 286 374 C 288 386 286 400 280 406 C 272 414 258 410 254 402 C 250 393 252 379 258 370 Z" fill="url(#skBody)"/>
            <path d="M 284 386 Q 278 396 270 398" fill="none" stroke="rgba(140,80,40,0.3)" strokeWidth="1"/>

            {/* ══ NECK ══ */}
            <path d="M 146 122 C 142 122 136 128 136 138 L 136 166 C 141 173 150 177 160 177 C 170 177 179 173 184 166 L 184 138 C 184 128 178 122 174 122 Z"
              fill="url(#skFace)"/>

            {/* ══ HEAD ══ */}
            <ellipse cx="160" cy="84" rx="43" ry="50" fill="url(#skFace)" filter="url(#fsh)"/>
            {/* Hair */}
            <path d="M 117 72 C 117 38 136 20 160 19 C 184 20 203 38 203 72 C 199 50 186 34 160 33 C 134 34 121 50 117 72 Z" fill="#160c05"/>
            <path d="M 117 72 C 117 56 119 44 126 36 C 118 50 117 64 117 76 Z" fill="#100804"/>
            <path d="M 203 72 C 203 56 201 44 194 36 C 202 50 203 64 203 76 Z" fill="#100804"/>
            <path d="M 140 24 C 155 20 170 21 178 28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round"/>
            {/* Ears */}
            <path d="M 117 86 C 112 86 108 91 108 98 C 108 105 112 110 117 110 C 119 110 121 108 121 105 L 121 90 C 121 88 119 86 117 86 Z" fill="#c07848"/>
            <path d="M 114 93 C 113 96 113 100 114 103" fill="none" stroke="#a06030" strokeWidth="1" opacity="0.5"/>
            <path d="M 203 86 C 208 86 212 91 212 98 C 212 105 208 110 203 110 C 201 110 199 108 199 105 L 199 90 C 199 88 201 86 203 86 Z" fill="#c07848"/>
            {/* Eyebrows */}
            <path d="M 135 70 C 141 64 151 63 157 66" fill="none" stroke="#160c05" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 185 70 C 179 64 169 63 163 66" fill="none" stroke="#160c05" strokeWidth="3" strokeLinecap="round"/>
            {/* Eyes */}
            <ellipse cx="147" cy="80" rx="10" ry="8" fill="#fff"/>
            <ellipse cx="173" cy="80" rx="10" ry="8" fill="#fff"/>
            <ellipse cx="148" cy="80" rx="6" ry="6" fill="#3e2415"/>
            <ellipse cx="174" cy="80" rx="6" ry="6" fill="#3e2415"/>
            <ellipse cx="148" cy="80" rx="3.2" ry="3.2" fill="#090504"/>
            <ellipse cx="174" cy="80" rx="3.2" ry="3.2" fill="#090504"/>
            <circle cx="150" cy="78" r="1.8" fill="rgba(255,255,255,0.8)"/>
            <circle cx="176" cy="78" r="1.8" fill="rgba(255,255,255,0.8)"/>
            {/* Nose */}
            <path d="M 158 88 C 157 95 154 101 150 103 C 155 106 165 106 170 103 C 166 101 163 95 162 88 Z" fill="rgba(0,0,0,0.08)"/>
            <path d="M 152 103 C 155 101 165 101 168 103" fill="none" stroke="rgba(120,60,25,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Mouth */}
            <path d="M 149 113 C 155 118 165 118 171 113" fill="none" stroke="#944830" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 152 116 C 156 122 164 122 168 116" fill="rgba(175,85,50,0.2)"/>
            {/* Chin shadow */}
            <ellipse cx="160" cy="126" rx="22" ry="6" fill="rgba(0,0,0,0.09)"/>

            {/* ══ SCAN LINE ══ */}
            {phase === 'scanning' && (
              <g>
                <rect x="0" y="0" width="320" height={580 * progress / 100} fill="rgba(0,229,255,0.038)"/>
                <rect x="0" y={580 * progress / 100 - 2} width="320" height="4" fill="url(#scanGrad)"/>
                <rect x="0" y={580 * progress / 100 + 2} width="320" height="20" fill="url(#scanGlow)" opacity="0.5"/>
              </g>
            )}
          </svg>

          {/* Status bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.72) 0%, transparent 100%)',
            textAlign: 'center',
          }}>
            {phase === 'idle'     && <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.16)', letterSpacing: 3, textTransform: 'uppercase' }}>Awaiting scan</p>}
            {phase === 'scanning' && <p style={{ fontSize: 9, color: '#00e5ff', letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600 }}>Mapping {garmentLabel} — {progress}%</p>}
            {phase === 'result'   && <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase' }}>✦ Fit confirmed</p>}
          </div>
        </div>

        {/* Progress bar */}
        {phase === 'scanning' && (
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #0891b2, #00e5ff)', transition: 'width 0.03s linear', borderRadius: 2 }}/>
          </div>
        )}

        {/* Buttons */}
        {phase === 'idle' && (
          <button onClick={startTryOn} style={{
            padding: '13px 52px', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: '#fff', border: 'none', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
            fontWeight: 700, cursor: 'pointer', borderRadius: 2,
            boxShadow: '0 4px 22px rgba(234,88,12,0.4)', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(234,88,12,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 22px rgba(234,88,12,0.4)'; }}
          >✦ Start Try-On</button>
        )}
        {phase === 'scanning' && (
          <p style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: 2.5, textTransform: 'uppercase' }}>Analysing…</p>
        )}
        {phase === 'result' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button onClick={reset} style={{
              flex: 1, padding: '13px', background: 'transparent', color: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(255,255,255,0.1)', fontSize: 10, letterSpacing: 2,
              textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >Try Again</button>
            <button onClick={onClose} style={{
              flex: 1, padding: '13px', background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: '#fff', border: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              fontWeight: 700, cursor: 'pointer', borderRadius: 2, boxShadow: '0 4px 16px rgba(234,88,12,0.38)',
            }}>Looks Great!</button>
          </div>
        )}

        <p style={{ fontSize: 9, color: '#252525', marginTop: 12, textAlign: 'center', lineHeight: 1.9 }}>
          Virtual try-on is a style visualisation. Actual fit may vary.
        </p>
      </div>
    </div>
  );
}

// ── Size Chart Modal ──
function SizeChartModal({ sizes, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{ background: '#fff', padding: 36, maxWidth: 480, width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>✕</button>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 6 }}>Size Guide</h3>
        <p style={{ fontSize: 11, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>All measurements in inches</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111' }}>
              {['Size','Chest','Length'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizes.map((s, i) => (
              <tr key={s.label} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                <td style={{ padding: '12px', fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>{s.label}</td>
                <td style={{ padding: '12px', fontSize: 14, color: '#555' }}>{s.chest ? `${s.chest}"` : '—'}</td>
                <td style={{ padding: '12px', fontSize: 14, color: '#555' }}>{s.length ? `${s.length}"` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 20, padding: '14px 16px', background: '#fff8f5', border: '1px solid #f0e0d8' }}>
          <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> Measure around the fullest part of your chest and from shoulder to desired hem length for the best fit.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { currentUser } = useAuth();
  const isWished = wishlist.some(i => i.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      const snap = await get(ref(db, `products/${id}`));
      if (snap.exists()) {
        const p = { id, ...snap.val() };
        setProduct(p);
        // Pre-select first size if available
        if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0].label);
        const allSnap = await get(ref(db, 'products'));
        if (allSnap.exists()) {
          const all = Object.entries(allSnap.val()).map(([pid, v]) => ({ id: pid, ...v }));
          setRelated(all.filter(p2 => p2.category === p.category && p2.id !== id).slice(0, 4));
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!currentUser) { toast.error('Please login first'); return; }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    for (let i = 0; i < qty; i++) await addToCart({ ...product, selectedSize });
    toast.success(`Added to cart!`);
  };

  const handleBuyNow = async () => {
    if (!currentUser) { toast.error('Please login first'); return; }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    await addToCart({ ...product, selectedSize });
    window.location.href = '/checkout';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid #e8e8e8', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#888', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', paddingTop: 140, textAlign: 'center' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Product not found</h2>
      <Link to="/" style={{ color: '#ea580c', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Go Home</Link>
    </div>
  );

  const images = [product.image, product.image2, product.image3].filter(Boolean);
  const inStock = (product.stock === undefined || product.stock > 0);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasSizeChart = hasSizes && product.sizes.some(s => s.chest || s.length);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>

      {/* Modals */}
      {showTryOn && <VirtualTryOn product={product} onClose={() => setShowTryOn(false)} />}
      {showSizeChart && hasSizeChart && <SizeChartModal sizes={product.sizes} onClose={() => setShowSizeChart(false)} />}

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', marginBottom: 32 }}>
        <p style={{ fontSize: 12, color: '#999', letterSpacing: 1 }}>
          <Link to="/" style={{ color: '#999' }}>Home</Link> / <Link to={`/category/${(product.category || '').toLowerCase()}`} style={{ color: '#999' }}>{product.category}</Link> / {product.name}
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="product-grid">
        
        {/* Images */}
        <div>
          {/* Main image */}
          <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: '#f5f5f5', marginBottom: 8 }}>
            <img src={images[selectedImg] || 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80'} alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Virtual Try-On button overlay */}
            <button
              onClick={() => setShowTryOn(true)}
              style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 20px', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.borderColor = '#ea580c'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              ✦ Virtual Try-On
            </button>
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setSelectedImg(i)} style={{
                  width: 72, height: 88, overflow: 'hidden', cursor: 'pointer', background: '#f5f5f5',
                  outline: selectedImg === i ? '2px solid #ea580c' : '2px solid transparent',
                  outlineOffset: 2, transition: 'outline 0.15s',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ position: 'sticky', top: 100 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>{product.category}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: '#111', lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>
          <p style={{ fontSize: 22, fontWeight: 500, color: '#111', marginBottom: 24, letterSpacing: 0.5 }}>₦{Number(product.price).toLocaleString()}</p>

          {/* Stock */}
          <div style={{ marginBottom: 20 }}>
            {inStock ? (
              <p style={{ fontSize: 12, color: '#65a30d', letterSpacing: 1, fontWeight: 500 }}>
                ✓ In Stock{product.stock ? ` — ${product.stock} available` : ''}
              </p>
            ) : (
              <p style={{ fontSize: 12, color: '#e53e3e', letterSpacing: 1, fontWeight: 500 }}>✕ Sold Out</p>
            )}
          </div>

          {product.description && (
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8, marginBottom: 28, borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>{product.description}</p>
          )}

          {/* ── SIZE SELECTOR ── */}
          {hasSizes && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555' }}>
                  Size{selectedSize ? ` — ${selectedSize}` : ''}
                </span>
                {hasSizeChart && (
                  <button onClick={() => setShowSizeChart(true)} style={{
                    background: 'none', border: 'none', color: '#ea580c', fontSize: 11,
                    letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
                    cursor: 'pointer', textDecoration: 'underline', padding: 0,
                  }}>
                    Size Guide
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    title={s.chest ? `Chest: ${s.chest}" | Length: ${s.length}"` : s.label}
                    style={{
                      minWidth: 48, padding: '10px 14px',
                      border: `1.5px solid ${selectedSize === s.label ? '#ea580c' : '#ddd'}`,
                      background: selectedSize === s.label ? '#fff5f0' : '#fff',
                      color: selectedSize === s.label ? '#ea580c' : '#555',
                      fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (selectedSize !== s.label) { e.currentTarget.style.borderColor = '#aaa'; } }}
                    onMouseLeave={e => { if (selectedSize !== s.label) { e.currentTarget.style.borderColor = '#ddd'; } }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {/* Selected size measurements hint */}
              {selectedSize && (() => {
                const sz = product.sizes.find(s => s.label === selectedSize);
                return sz && (sz.chest || sz.length) ? (
                  <p style={{ fontSize: 11, color: '#999', marginTop: 10, letterSpacing: 0.5 }}>
                    {sz.chest ? `Chest: ${sz.chest}"` : ''}{sz.chest && sz.length ? ' · ' : ''}{sz.length ? `Length: ${sz.length}"` : ''}
                  </p>
                ) : null;
              })()}
            </div>
          )}

          {/* Virtual Try-On CTA */}
          <button onClick={() => setShowTryOn(true)} style={{
            width: '100%', padding: '12px', marginBottom: 20,
            background: 'linear-gradient(135deg, #111 0%, #333 100%)',
            color: '#fff', border: 'none', fontSize: 11, letterSpacing: 3,
            textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            ✦ Try It On Virtually
          </button>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555' }}>Qty</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#555' }}>−</button>
              <span style={{ padding: '0 20px', fontSize: 14, fontWeight: 500 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#555' }}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <button onClick={handleAddToCart} disabled={!inStock} style={{
              padding: '15px', background: inStock ? '#111' : '#ddd', color: inStock ? '#fff' : '#999',
              border: 'none', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
              fontWeight: 600, cursor: inStock ? 'pointer' : 'not-allowed', transition: 'background 0.2s',
            }}
              onMouseEnter={e => { if (inStock) e.currentTarget.style.background = '#ea580c'; }}
              onMouseLeave={e => { if (inStock) e.currentTarget.style.background = '#111'; }}
            >Add to Cart</button>
            <button onClick={handleBuyNow} disabled={!inStock} style={{
              padding: '15px', background: inStock ? '#ea580c' : '#ddd', color: '#fff',
              border: 'none', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
              fontWeight: 600, cursor: inStock ? 'pointer' : 'not-allowed',
            }}>Buy Now</button>
            <button onClick={() => {
              if (!currentUser) { toast.error('Please login first'); return; }
              toggleWishlist(product);
              toast.success(isWished ? 'Removed from wishlist' : 'Saved to wishlist');
            }} style={{
              padding: '13px', background: 'transparent',
              border: `1px solid ${isWished ? '#ea580c' : '#ddd'}`,
              color: isWished ? '#ea580c' : '#555',
              fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {isWished ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>

          {/* Info */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
            {[
              '🚚 Free shipping on orders above ₦50,000',
              '🔄 No refund and no return',
              '🔒 100% authentic — guaranteed',
            ].map(t => <p key={t} style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{t}</p>)}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 40px', borderTop: '1px solid #e8e8e8' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 32 }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px 20px' }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

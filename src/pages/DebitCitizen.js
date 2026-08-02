// src/pages/DebitCitizen.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function DebitCitizen() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'photo' | 'video'

  useEffect(() => {
    const unsub = onValue(ref(db, 'citizenPosts'), snap => {
      const data = snap.val();
      if (data) {
        const arr = Object.entries(data)
          .map(([id, v]) => ({ id, ...v }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setPosts(arr);
      } else {
        setPosts([]);
      }
    });
    return unsub;
  }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  // Close lightbox on ESC
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative', height: '70vh', minHeight: 420,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px', overflow: 'hidden',
      }}>
        {/* Decorative orange rings */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', border:'1px solid rgba(234,88,12,0.08)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', border:'1px solid rgba(234,88,12,0.12)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', border:'1px solid rgba(234,88,12,0.2)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />

        {/* Orange glow blob */}
        <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(234,88,12,0.18) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />

        <p style={{ fontSize:'clamp(9px,2vw,11px)', letterSpacing:6, textTransform:'uppercase', color:'#ea580c', fontWeight:600, marginBottom:20, position:'relative' }}>
          Community
        </p>
        <h1 style={{
          fontFamily:"'Cormorant Garamond', serif",
          fontSize:'clamp(44px, 10vw, 100px)',
          fontWeight:300, lineHeight:0.95, letterSpacing:2,
          color:'#fff', marginBottom:24, position:'relative',
        }}>
          Debit<br /><span style={{ color:'#ea580c' }}>Citizen</span>
        </h1>
        <p style={{
          fontSize:'clamp(13px,2vw,16px)', color:'rgba(255,255,255,0.5)',
          maxWidth:520, lineHeight:1.7, position:'relative', marginBottom:40,
        }}>
          Real people. Real style. See how our community wears Debit — submit your look and be featured.
        </p>

        {/* Stats row */}
        <div style={{ display:'flex', gap:'clamp(24px,5vw,60px)', position:'relative' }}>
          {[
            { n: posts.length + '+', l: 'Posts' },
            { n: posts.filter(p=>p.type==='video').length + '+', l: 'Videos' },
            { n: posts.filter(p=>p.type==='photo').length + '+', l: 'Photos' },
          ].map(s => (
            <div key={s.l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,5vw,44px)', fontWeight:300, color:'#ea580c' }}>{s.n}</div>
              <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div style={{ display:'flex', justifyContent:'center', gap:0, borderBottom:'1px solid rgba(255,255,255,0.08)', background:'#0f0f0f' }}>
        {[
          { key:'all', label:'All' },
          { key:'photo', label:'📷  Photos' },
          { key:'video', label:'🎬  Videos' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            background:'none', border:'none',
            padding:'16px clamp(16px,4vw,36px)',
            fontSize:'clamp(9px,1.5vw,11px)', letterSpacing:3, textTransform:'uppercase', fontWeight:600,
            color: filter === f.key ? '#ea580c' : 'rgba(255,255,255,0.4)',
            borderBottom: `2px solid ${filter === f.key ? '#ea580c' : 'transparent'}`,
            cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
          }}>{f.label}</button>
        ))}
      </div>

      {/* ── MASONRY-STYLE GRID ── */}
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'clamp(24px,4vw,56px) clamp(16px,4vw,40px) 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'100px 24px' }}>
            <div style={{ fontSize:64, marginBottom:20 }}>🎬</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(24px,4vw,36px)', fontWeight:300, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>
              {filter === 'video' ? 'No videos yet' : filter === 'photo' ? 'No photos yet' : 'No posts yet'}
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.2)', letterSpacing:2, textTransform:'uppercase' }}>
              Check back soon
            </p>
          </div>
        ) : (
          <div style={{
            columns: 'clamp(160px,28vw,300px)',
            columnGap:'clamp(8px,1.5vw,16px)',
          }}>
            {filtered.map((post, i) => (
              <CitizenCard key={post.id} post={post} onClick={() => setSelected(post)} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position:'fixed', inset:0, zIndex:9999,
            background:'rgba(0,0,0,0.95)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:16,
          }}
        >
          <button onClick={() => setSelected(null)} style={{
            position:'absolute', top:20, right:24,
            background:'rgba(255,255,255,0.1)', border:'none',
            color:'#fff', fontSize:24, width:44, height:44, borderRadius:'50%',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            zIndex:10,
          }}>✕</button>

          <div onClick={e => e.stopPropagation()} style={{
            maxWidth:'min(90vw, 900px)', width:'100%',
            maxHeight:'90vh', overflow:'auto',
          }}>
            {selected.type === 'video' ? (
              <video
                src={selected.mediaUrl}
                controls autoPlay
                style={{ width:'100%', maxHeight:'75vh', objectFit:'contain', display:'block', background:'#000' }}
              />
            ) : (
              <img
                src={selected.mediaUrl}
                alt={selected.caption}
                style={{ width:'100%', maxHeight:'75vh', objectFit:'contain', display:'block' }}
              />
            )}
            {(selected.caption || selected.personName) && (
              <div style={{ padding:'20px 4px 0' }}>
                {selected.personName && (
                  <p style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase', color:'#ea580c', fontWeight:600, marginBottom:8 }}>
                    — {selected.personName}
                  </p>
                )}
                {selected.caption && (
                  <p style={{ fontSize:15, color:'rgba(255,255,255,0.75)', lineHeight:1.7 }}>{selected.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Individual card ── */
function CitizenCard({ post, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = post.type === 'video';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside:'avoid',
        marginBottom:'clamp(8px,1.5vw,16px)',
        position:'relative',
        cursor:'pointer',
        borderRadius:2,
        overflow:'hidden',
        background:'#1a1a1a',
        animation:`fadeUp 0.5s ease both`,
        animationDelay:`${Math.min(index * 60, 400)}ms`,
      }}
    >
      {/* Media */}
      {isVideo ? (
        <video
          src={post.mediaUrl}
          muted playsInline
          style={{ width:'100%', display:'block', objectFit:'cover' }}
          onMouseEnter={e => e.currentTarget.play().catch(()=>{})}
          onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
        />
      ) : (
        <img
          src={post.mediaUrl}
          alt={post.caption || 'Debit Citizen'}
          style={{
            width:'100%', display:'block',
            transition:'transform 0.5s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
          loading="lazy"
        />
      )}

      {/* Hover overlay */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        opacity: hovered ? 1 : 0,
        transition:'opacity 0.3s ease',
        display:'flex', flexDirection:'column', justifyContent:'flex-end',
        padding:'clamp(10px,2vw,20px)',
      }}>
        {post.personName && (
          <p style={{ fontSize:'clamp(9px,1.5vw,11px)', letterSpacing:2, textTransform:'uppercase', color:'#ea580c', fontWeight:700, marginBottom:4 }}>
            {post.personName}
          </p>
        )}
        {post.caption && (
          <p style={{ fontSize:'clamp(11px,1.5vw,13px)', color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>
            {post.caption.length > 80 ? post.caption.slice(0, 80) + '…' : post.caption}
          </p>
        )}
      </div>

      {/* Video badge */}
      {isVideo && (
        <div style={{
          position:'absolute', top:10, left:10,
          background:'rgba(234,88,12,0.9)',
          borderRadius:2, padding:'3px 8px',
          display:'flex', alignItems:'center', gap:5,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M5 3l14 9-14 9V3z"/></svg>
          <span style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#fff', fontWeight:700 }}>Video</span>
        </div>
      )}
    </div>
  );
}

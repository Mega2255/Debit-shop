// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref as dbRef, onValue, set, push, remove, update } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATS = [
  'New Arrivals',
  // Men
  'Men - T-Shirts','Men - Shirts','Men - Pants','Men - Shorts','Men - Jackets','Men - Jerseys',
  "Men - Belts","Men - Glasses","Men - Headwear's","Men - Socks",
  // Women
  'Women - Tops','Women - Bottoms','Women - Dresses','Women - Jackets','Women - Swimwear','Women - Jerseys',
  "Women - Belts","Women - Glasses","Women - Headwear's","Women - Socks",
  // Other
  'Collections','Classics','Accessories',
];
const STATUSES = ['pending','processing','shipped','delivered','cancelled'];
const STATUS_COLORS = { pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
const SIZE_OPTIONS = ['XS','S','M','L','XL','XXL','XXXL','One Size'];

function Stat({ label, value, sub, accent = '#ea580c' }) {
  return (
    <div style={{ border: '1px solid #e8e8e8', padding: '24px 20px' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: accent, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#888', marginBottom: sub ? 4 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: accent }}>{sub}</div>}
    </div>
  );
}

// ── Size Chart Manager Component ──
function SizeChartManager({ sizes, onChange }) {
  const [newSize, setNewSize] = useState('');

  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (!s) return;
    if (sizes.find(x => x.label === s)) { toast.error('Size already added'); return; }
    onChange([...sizes, { label: s, chest: '', length: '' }]);
    setNewSize('');
  };

  const removeSize = (label) => onChange(sizes.filter(s => s.label !== label));

  const updateSize = (label, field, val) => {
    onChange(sizes.map(s => s.label === label ? { ...s, [field]: val } : s));
  };

  const inputS = {
    padding: '6px 8px', border: '1px solid #e8e8e8', fontSize: 13, outline: 'none',
    transition: 'border-color 0.2s', background: '#fff', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555' }}>
          Size Chart
        </span>
        <span style={{ fontSize: 11, color: '#bbb' }}>(add sizes with measurements)</span>
      </div>

      {/* Quick add from preset */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {SIZE_OPTIONS.map(opt => {
          const already = sizes.find(s => s.label === opt);
          return (
            <button key={opt} type="button"
              onClick={() => {
                if (already) return;
                onChange([...sizes, { label: opt, chest: '', length: '' }]);
              }}
              style={{
                padding: '4px 12px', fontSize: 11, letterSpacing: 1, fontWeight: 600,
                border: `1px solid ${already ? '#ea580c' : '#e8e8e8'}`,
                background: already ? '#fff5f0' : '#fff',
                color: already ? '#ea580c' : '#888',
                cursor: already ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}>
              {opt} {already ? '✓' : '+'}
            </button>
          );
        })}
      </div>

      {/* Custom size input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Custom size (e.g. 2XL, 32, etc.)"
          value={newSize}
          onChange={e => setNewSize(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
          style={{ ...inputS, flex: 1 }}
          onFocus={e => e.target.style.borderColor = '#ea580c'}
          onBlur={e => e.target.style.borderColor = '#e8e8e8'}
        />
        <button type="button" onClick={addSize}
          style={{ padding: '6px 18px', background: '#111', color: '#fff', border: 'none', fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: 'pointer' }}>
          Add
        </button>
      </div>

      {/* Size rows with measurements */}
      {sizes.length > 0 && (
        <div style={{ border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 36px', gap: 0, background: '#fafafa', padding: '8px 12px' }}>
            {['Size','Chest (in)','Length (in)',''].map(h => (
              <span key={h} style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700, color: '#999' }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          {sizes.map((s, i) => (
            <div key={s.label} style={{
              display: 'grid', gridTemplateColumns: '80px 1fr 1fr 36px',
              gap: 0, alignItems: 'center',
              padding: '8px 12px',
              borderTop: i > 0 ? '1px solid #f5f5f5' : 'none',
              background: '#fff',
            }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#111', letterSpacing: 1 }}>{s.label}</span>
              <div style={{ paddingRight: 8 }}>
                <input type="number" step="0.5" min="0" value={s.chest} onChange={e => updateSize(s.label, 'chest', e.target.value)}
                  placeholder="e.g. 40"
                  style={{ ...inputS }}
                  onFocus={e => e.target.style.borderColor = '#ea580c'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>
              <div style={{ paddingRight: 8 }}>
                <input type="number" step="0.5" min="0" value={s.length} onChange={e => updateSize(s.label, 'length', e.target.value)}
                  placeholder="e.g. 28"
                  style={{ ...inputS }}
                  onFocus={e => e.target.style.borderColor = '#ea580c'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>
              <button type="button" onClick={() => removeSize(s.label)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: '#fee2e2', border: 'none', color: '#ef4444', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {sizes.length === 0 && (
        <p style={{ fontSize: 12, color: '#ccc', fontStyle: 'italic', padding: '10px 0' }}>
          No sizes added yet. Click a size above or type a custom one.
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [revenue, setRevenue] = useState({});

  const EMPTY_FORM = { name:'', price:'', category:'', description:'', stock:'', isNew:true, imageUrl:'', imageUrl2:'' };
  const [pForm, setPForm] = useState(EMPTY_FORM);
  const [pSizes, setPSizes] = useState([]); // [{ label, chest, length }]
  const [editProd, setEditProd] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [imgPreview2, setImgPreview2] = useState('');
  const [imgBase64, setImgBase64] = useState('');
  const [imgBase64_2, setImgBase64_2] = useState('');
  const [saving, setSaving] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selMsg, setSelMsg] = useState(null);
  const [citizenPosts, setCitizenPosts] = useState([]);
  const [citizenForm, setCitizenForm] = useState({ personName:'', caption:'', type:'photo', mediaUrl:'' });
  const [citizenMediaB64, setCitizenMediaB64] = useState('');
  const [citizenPreview, setCitizenPreview] = useState('');
  const [citizenSaving, setCitizenSaving] = useState(false);
  const [editCitizen, setEditCitizen] = useState(null);

  if (!currentUser) return <Navigate to="/login" />;
  if (userProfile?.role !== 'admin') return (
    <div style={{ paddingTop: 140, textAlign: 'center', minHeight: '100vh' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#999' }}>Access Denied</p>
      <p style={{ fontSize: 13, color: '#aaa', marginTop: 8 }}>Admin access required.</p>
    </div>
  );

  useEffect(() => {
    const subs = [
      onValue(dbRef(db, 'products'), s => {
        const d = s.val();
        setProducts(d ? Object.entries(d).map(([id,v]) => ({id,...v})).sort((a,b) => (b.createdAt||0)-(a.createdAt||0)) : []);
      }),
      onValue(dbRef(db, 'users'), s => { const d = s.val(); setUsers(d ? Object.entries(d).map(([id,v]) => ({id,...v})) : []); }),
      onValue(dbRef(db, 'messages'), s => { const d = s.val(); setMessages(d ? Object.entries(d).map(([id,v]) => ({id,...v})).reverse() : []); }),
      onValue(dbRef(db, 'revenue'), s => setRevenue(s.val() || {})),
      onValue(dbRef(db, 'allOrders'), s => { const d = s.val(); setOrders(d ? Object.entries(d).map(([id,v]) => ({id,...v})).reverse() : []); }),
      onValue(dbRef(db, 'citizenPosts'), s => { const d = s.val(); setCitizenPosts(d ? Object.entries(d).map(([id,v]) => ({id,...v})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)) : []); }),
    ];
    return () => subs.forEach(u => u());
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const calcRev = (days) => Object.entries(revenue).reduce((sum,[date,val]) => {
    if (days === 'month') { const d = new Date(date); return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear() ? sum+val : sum; }
    if (days === 'year') { return new Date(date).getFullYear() === new Date().getFullYear() ? sum+val : sum; }
    const diff = (Date.now() - new Date(date).getTime()) / 86400000;
    return diff <= days ? sum+val : sum;
  }, 0);

  const salesMap = {};
  orders.forEach(o => o.items?.forEach(i => { salesMap[i.id] = (salesMap[i.id]||0) + i.qty; }));
  const topProducts = [...products].map(p => ({...p, sold: salesMap[p.id]||0})).sort((a,b) => b.sold-a.sold);

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handleImgFile = async (e, which) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const b64 = await fileToBase64(file);
    if (which === 1) { setImgBase64(b64); setImgPreview(b64); }
    else { setImgBase64_2(b64); setImgPreview2(b64); }
  };

  const saveProd = async (e) => {
    e.preventDefault();
    if (!pForm.name || !pForm.price || !pForm.category) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      const img1 = imgBase64 || pForm.imageUrl || editProd?.image || '';
      const img2 = imgBase64_2 || pForm.imageUrl2 || editProd?.image2 || '';
      const data = {
        ...pForm,
        price: Number(pForm.price),
        stock: pForm.stock !== '' ? Number(pForm.stock) : undefined,
        image: img1,
        image2: img2,
        // Save sizes as array; filter out empty labels
        sizes: pSizes.filter(s => s.label).map(s => ({
          label: s.label,
          chest: s.chest ? Number(s.chest) : null,
          length: s.length ? Number(s.length) : null,
        })),
        updatedAt: Date.now(),
        ...(!editProd && { createdAt: Date.now() })
      };
      delete data.imageUrl; delete data.imageUrl2;
      if (editProd) { await set(dbRef(db, `products/${editProd.id}`), data); toast.success('Product updated!'); }
      else { const nr = push(dbRef(db, 'products')); await set(nr, data); toast.success('Product added!'); }
      setPForm(EMPTY_FORM);
      setPSizes([]);
      setImgBase64(''); setImgBase64_2(''); setImgPreview(''); setImgPreview2('');
      setEditProd(null);
    } catch (err) { toast.error('Error: ' + err.message); }
    setSaving(false);
  };

  const deleteProd = async (id) => { if (window.confirm('Delete this product?')) { await remove(dbRef(db, `products/${id}`)); toast.success('Deleted'); } };

  const editProdFn = (p) => {
    setEditProd(p);
    setPForm({ name:p.name, price:p.price, category:p.category, description:p.description||'', stock:p.stock??'', isNew:p.isNew||false, imageUrl:'', imageUrl2:'' });
    setPSizes(p.sizes || []);
    setImgBase64(''); setImgBase64_2('');
    setImgPreview(p.image||''); setImgPreview2(p.image2||'');
    setTab('products'); window.scrollTo(0,0);
  };

  const updateOrderStatus = async (orderId, userId, status) => { await update(dbRef(db, `allOrders/${orderId}`), {status}); await update(dbRef(db, `orders/${userId}/${orderId}`), {status}); toast.success(`Order ${status}`); };

  const filteredUsers = users.filter(u => !userSearch || (u.name||'').toLowerCase().includes(userSearch.toLowerCase()) || (u.email||'').toLowerCase().includes(userSearch.toLowerCase()));
  const unreadMsgs = messages.filter(m => m.status === 'unread').length;

  const TABS = [
    { id:'overview', label:'Overview' },
    { id:'products', label:'Products' },
    { id:'orders', label:'Orders' },
    { id:'users', label:'Users' },
    { id:'messages', label:`Messages${unreadMsgs > 0 ? ` (${unreadMsgs})` : ''}` },
    { id:'stock', label:'Stock' },
    { id:'citizen', label:'Debit Citizen' },
  ];

  const inputStyle = { width:'100%', padding:'10px 0', border:'none', borderBottom:'1px solid #ddd', fontSize:14, outline:'none', background:'transparent', boxSizing:'border-box', transition:'border-color 0.2s' };
  const labelStyle = { display:'block', fontSize:11, letterSpacing:2, textTransform:'uppercase', fontWeight:600, color:'#555', marginBottom:8 };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: '#fff' }}>
      {/* Admin header bar */}
      <div style={{ background: '#111', color: '#fff', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3 }}>DEBIT ADMIN</span>
          <span style={{ color: '#888', fontSize: 12, marginLeft: 16 }}>Welcome, {userProfile?.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Products', products.length, '#ea580c'], ['Orders', orders.length, '#84cc16'], ['Users', users.length, '#3b82f6'], ['Messages', unreadMsgs, '#f59e0b']].map(([l,v,c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 10, color: '#888', letterSpacing: 1, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px 80px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e8e8', marginBottom: 36, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 20px', background: 'none', border: 'none',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
              color: tab === t.id ? '#ea580c' : '#888',
              borderBottom: `2px solid ${tab === t.id ? '#ea580c' : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.2s', marginBottom: -1, whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 24 }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
              <Stat label="Today's Revenue" value={`₦${Number(calcRev(1)).toLocaleString()}`} accent="#ea580c" />
              <Stat label="Weekly Revenue" value={`₦${Number(calcRev(7)).toLocaleString()}`} accent="#84cc16" />
              <Stat label="Monthly Revenue" value={`₦${Number(calcRev('month')).toLocaleString()}`} accent="#3b82f6" />
              <Stat label="Yearly Revenue" value={`₦${Number(calcRev('year')).toLocaleString()}`} accent="#8b5cf6" />
              <Stat label="Total Products" value={products.length} accent="#111" />
              <Stat label="Total Orders" value={orders.length} accent="#f59e0b" />
              <Stat label="Out of Stock" value={products.filter(p => p.stock === 0).length} accent="#ef4444" />
              <Stat label="Total Users" value={users.length} accent="#0891b2" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="ov-grid">
              <div style={{ border: '1px solid #e8e8e8', padding: 24 }}>
                <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Recent Orders</h3>
                {orders.slice(0, 6).map(o => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>#{o.id.slice(-7).toUpperCase()}</p>
                      <p style={{ fontSize: 11, color: '#999' }}>{o.shippingAddress?.name}</p>
                    </div>
                    <span style={{ background: STATUS_COLORS[o.status]+'20', color: STATUS_COLORS[o.status], padding:'3px 10px', fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>{o.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>₦{Number(o.total).toLocaleString()}</span>
                  </div>
                ))}
                {orders.length === 0 && <p style={{ color: '#999', fontSize: 13 }}>No orders yet.</p>}
              </div>

              <div style={{ border: '1px solid #e8e8e8', padding: 24 }}>
                <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Top Products</h3>
                {topProducts.slice(0, 6).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: '#ccc', minWidth: 24 }}>{i+1}</span>
                    <img src={p.image || 'https://via.placeholder.com/36x44'} alt={p.name} style={{ width: 36, height: 44, objectFit: 'cover', background: '#f5f5f5' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#999' }}>{p.category}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.sold > 0 ? '#65a30d' : '#ccc', whiteSpace: 'nowrap' }}>{p.sold} sold</span>
                  </div>
                ))}
                {products.length === 0 && <p style={{ color: '#999', fontSize: 13 }}>No products yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div>
            {/* Form */}
            <div style={{ border: '1px solid #e8e8e8', padding: 32, marginBottom: 40 }}>
              <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                {editProd ? `Editing: ${editProd.name}` : 'Add New Product'}
              </h3>
              <form onSubmit={saveProd}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 24px' }}>
                  {[{k:'name',l:'Product Name *'},{k:'price',l:'Price (₦) *',t:'number'},{k:'stock',l:'Stock Qty',t:'number'}].map(f => (
                    <div key={f.k} style={{ marginBottom: 20 }}>
                      <label style={labelStyle}>{f.l}</label>
                      <input type={f.t||'text'} value={pForm[f.k]} onChange={e => setPForm({...pForm,[f.k]:e.target.value})} required={f.k==='name'||f.k==='price'}
                        style={inputStyle} onFocus={e => e.target.style.borderColor='#ea580c'} onBlur={e => e.target.style.borderColor='#ddd'} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Category *</label>
                    <select value={pForm.category} onChange={e => setPForm({...pForm,category:e.target.value})} required
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select...</option>
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={3} value={pForm.description} onChange={e => setPForm({...pForm,description:e.target.value})}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Jost', sans-serif" }}
                    onFocus={e => e.target.style.borderColor='#ea580c'} onBlur={e => e.target.style.borderColor='#ddd'} />
                </div>

                {/* ── SIZE CHART SECTION ── */}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24, marginBottom: 8 }}>
                  <SizeChartManager sizes={pSizes} onChange={setPSizes} />
                </div>

                {/* Images */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }} className="img-grid">
                  {[
                    { l:'Main Image', urlKey:'imageUrl', which:1, preview:imgPreview },
                    { l:'Alt / Hover Image', urlKey:'imageUrl2', which:2, preview:imgPreview2 }
                  ].map((f) => (
                    <div key={f.which} style={{ marginBottom: 20 }}>
                      <label style={labelStyle}>{f.l}</label>
                      <input
                        type="url"
                        value={pForm[f.urlKey]}
                        onChange={e => {
                          setPForm({...pForm, [f.urlKey]: e.target.value});
                          if (f.which === 1) { setImgPreview(e.target.value); setImgBase64(''); }
                          else { setImgPreview2(e.target.value); setImgBase64_2(''); }
                        }}
                        placeholder="Paste image URL (https://...)"
                        style={{ ...inputStyle, marginBottom: 10 }}
                        onFocus={e => e.target.style.borderColor='#ea580c'}
                        onBlur={e => e.target.style.borderColor='#ddd'}
                      />
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                        <div style={{ flex:1, height:1, background:'#eee' }} />
                        <span style={{ fontSize:10, color:'#bbb', letterSpacing:2, textTransform:'uppercase' }}>or upload file</span>
                        <div style={{ flex:1, height:1, background:'#eee' }} />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImgFile(e, f.which)}
                        style={{ ...inputStyle, cursor:'pointer', fontSize:12 }}
                      />
                      <p style={{ fontSize:10, color:'#bbb', marginTop:4 }}>Max 2MB. Stored directly — no Storage needed.</p>
                      {f.preview && (
                        <div style={{ marginTop:10, position:'relative', display:'inline-block' }}>
                          <img src={f.preview} alt="preview" style={{ width:80, height:100, objectFit:'cover', border:'1px solid #e8e8e8', background:'#f5f5f5' }}
                            onError={e => e.target.style.display='none'} />
                          <button type="button" onClick={() => {
                            if (f.which===1) { setImgPreview(''); setImgBase64(''); setPForm(p=>({...p, imageUrl:''})); }
                            else { setImgPreview2(''); setImgBase64_2(''); setPForm(p=>({...p, imageUrl2:''})); }
                          }} style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%', background:'#ef4444', border:'none', color:'#fff', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <input type="checkbox" id="isNewChk" checked={pForm.isNew} onChange={e => setPForm({...pForm,isNew:e.target.checked})} />
                  <label htmlFor="isNewChk" style={{ fontSize: 13, cursor: 'pointer' }}>Mark as New Arrival</label>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" disabled={saving} style={{ padding:'12px 36px', background: saving ? '#888' : '#111', color:'#fff', border:'none', fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:600, cursor: saving ? 'not-allowed' : 'pointer', transition:'background 0.2s' }}
                    onMouseEnter={e => { if(!saving) e.currentTarget.style.background='#ea580c'; }}
                    onMouseLeave={e => { if(!saving) e.currentTarget.style.background='#111'; }}
                  >{saving ? 'Saving...' : editProd ? 'Update Product' : 'Add Product'}</button>
                  {editProd && <button type="button" onClick={() => { setEditProd(null); setPForm(EMPTY_FORM); setPSizes([]); }}
                    style={{ padding:'12px 24px', background:'transparent', border:'1px solid #ddd', fontSize:11, letterSpacing:2, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>Cancel</button>}
                </div>
              </form>
            </div>

            {/* Products table */}
            <div style={{ border: '1px solid #e8e8e8' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 }}>All Products ({products.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                      {['Image','Name','Category','Price','Stock','Sizes','Sold','Actions'].map(h => (
                        <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:700, color:'#888', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                        onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        <td style={{ padding:'12px 16px' }}><img src={p.image||'https://via.placeholder.com/40x50'} alt={p.name} style={{width:40,height:50,objectFit:'cover',background:'#f5f5f5'}} /></td>
                        <td style={{ padding:'12px 16px', fontSize:13, maxWidth:200 }}>
                          <div style={{color:'#111'}}>{p.name}</div>
                          {p.isNew && <span style={{background:'#ea580c',color:'#fff',padding:'1px 6px',fontSize:9,fontWeight:700,letterSpacing:1}}>NEW</span>}
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'#888', whiteSpace:'nowrap' }}>{p.category}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:500, whiteSpace:'nowrap' }}>₦{Number(p.price).toLocaleString()}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ fontSize:12, fontWeight:600, color: p.stock===0 ? '#ef4444' : p.stock<=5 ? '#f59e0b' : '#22c55e' }}>
                            {p.stock===undefined ? '∞' : p.stock===0 ? 'Out' : p.stock}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          {p.sizes && p.sizes.length > 0 ? (
                            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                              {p.sizes.map(s => (
                                <span key={s.label} style={{ fontSize:9, fontWeight:700, letterSpacing:0.5, padding:'2px 5px', background:'#f5f5f5', color:'#555', border:'1px solid #e8e8e8' }}>{s.label}</span>
                              ))}
                            </div>
                          ) : <span style={{ fontSize:11, color:'#ccc' }}>—</span>}
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color: salesMap[p.id]>0 ? '#65a30d' : '#ccc' }}>{salesMap[p.id]||0}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', gap:8 }}>
                            <button onClick={() => editProdFn(p)} style={{ padding:'6px 12px', border:'1px solid #3b82f6', background:'transparent', color:'#3b82f6', fontSize:11, cursor:'pointer', fontWeight:600 }}>Edit</button>
                            <button onClick={() => deleteProd(p.id)} style={{ padding:'6px 12px', border:'1px solid #ef4444', background:'transparent', color:'#ef4444', fontSize:11, cursor:'pointer', fontWeight:600 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p style={{ textAlign:'center', padding:40, color:'#999', fontSize:13 }}>No products yet. Add your first product above.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300 }}>All Orders ({orders.length})</h2>
            </div>
            <div style={{ border: '1px solid #e8e8e8', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                    {['Order ID','Customer','Phone','Delivery Address','Items','Total','Date','Status','Update'].map(h => (
                      <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:700, color:'#888', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={{ padding:'12px 16px', fontSize:12, fontFamily:'monospace', color:'#555' }}>#{o.id.slice(-8).toUpperCase()}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{fontSize:13,color:'#111',fontWeight:500}}>{o.shippingAddress?.name||'—'}</div>
                        <div style={{fontSize:11,color:'#999'}}>{o.shippingAddress?.email||o.userEmail}</div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#555', whiteSpace:'nowrap' }}>
                        {o.shippingAddress?.phone || o.phone || '—'}
                      </td>
                      <td style={{ padding:'12px 16px', minWidth:200 }}>
                        {o.shippingAddress ? (
                          <div>
                            {o.shippingAddress.address && <div style={{fontSize:12,color:'#555'}}>{o.shippingAddress.address}</div>}
                            {(o.shippingAddress.city || o.shippingAddress.state) && (
                              <div style={{fontSize:12,color:'#888'}}>
                                {[o.shippingAddress.city, o.shippingAddress.state].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                        ) : <span style={{fontSize:12,color:'#ccc'}}>—</span>}
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#555' }}>{o.items?.length||0} item{o.items?.length !== 1 ? 's' : ''}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, fontWeight:600 }}>₦{Number(o.total).toLocaleString()}</td>
                      <td style={{ padding:'12px 16px', fontSize:12, color:'#888', whiteSpace:'nowrap' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:STATUS_COLORS[o.status]+'20', color:STATUS_COLORS[o.status], padding:'4px 10px', fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase', whiteSpace:'nowrap' }}>{o.status}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <select value={o.status} onChange={e => updateOrderStatus(o.id, o.userId, e.target.value)}
                          style={{ border:'1px solid #ddd', background:'#fff', padding:'6px 10px', fontSize:12, cursor:'pointer', outline:'none' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p style={{ textAlign:'center', padding:40, color:'#999', fontSize:13 }}>No orders yet.</p>}
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300 }}>Users ({filteredUsers.length})</h2>
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..."
                style={{ padding:'9px 14px', border:'1px solid #e8e8e8', fontSize:13, outline:'none', minWidth:250, transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='#ea580c'}
                onBlur={e => e.target.style.borderColor='#e8e8e8'}
              />
            </div>
            <div style={{ border: '1px solid #e8e8e8', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                    {['User','Email','Role','Joined','Orders'].map(h => (
                      <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:700, color:'#888' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const uOrders = orders.filter(o => o.userId === u.id);
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#ea580c,#84cc16)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                              {(u.name||'U')[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize:13, color:'#111' }}>{u.name||'—'}</span>
                          </div>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'#555' }}>{u.email}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background: u.role==='admin' ? '#fff0e6' : '#f0f9ff', color: u.role==='admin' ? '#ea580c' : '#0369a1', padding:'3px 10px', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{u.role||'user'}</span>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'#888' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color: uOrders.length > 0 ? '#65a30d' : '#ccc' }}>{uOrders.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p style={{ textAlign:'center', padding:40, color:'#999', fontSize:13 }}>No users found.</p>}
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 24 }}>Customer Messages ({messages.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }} className="msg-grid">
              <div style={{ border: '1px solid #e8e8e8' }}>
                {messages.length === 0 && <p style={{ padding:32, textAlign:'center', color:'#999', fontSize:13 }}>No messages yet.</p>}
                {messages.map(msg => (
                  <div key={msg.id} onClick={() => { setSelMsg(msg); if(msg.status==='unread') update(dbRef(db,`messages/${msg.id}`),{status:'read'}); }}
                    style={{ padding:'16px 20px', borderBottom:'1px solid #f5f5f5', cursor:'pointer', background: selMsg?.id===msg.id ? '#fff8f5' : msg.status==='unread' ? '#fffbf5' : '#fff', transition:'background 0.15s' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight: msg.status==='unread' ? 700 : 400, color:'#111' }}>{msg.name}</span>
                      {msg.status === 'unread' && <span style={{ width:8, height:8, borderRadius:'50%', background:'#ea580c', flexShrink:0 }} />}
                    </div>
                    <p style={{ fontSize:12, color:'#888', marginBottom:4 }}>{msg.email}</p>
                    <p style={{ fontSize:12, color:'#aaa', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.description}</p>
                    <p style={{ fontSize:10, color:'#ccc', marginTop:4, letterSpacing:0.5 }}>{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              {selMsg ? (
                <div style={{ border: '1px solid #e8e8e8', padding: 32 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
                    <div>
                      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, marginBottom:4 }}>{selMsg.name}</h3>
                      <p style={{ fontSize:13, color:'#888' }}>{selMsg.email}</p>
                      {selMsg.location && <p style={{ fontSize:13, color:'#888' }}>📍 {selMsg.location}</p>}
                    </div>
                    <span style={{ fontSize:11, color:'#999' }}>{new Date(selMsg.createdAt).toLocaleString()}</span>
                  </div>
                  {selMsg.subject && <p style={{ fontSize:12, letterSpacing:1, textTransform:'uppercase', color:'#ea580c', fontWeight:600, marginBottom:16 }}>Subject: {selMsg.subject}</p>}
                  <div style={{ background:'#fafafa', border:'1px solid #f0f0f0', padding:20, marginBottom:24 }}>
                    <p style={{ fontSize:14, color:'#333', lineHeight:1.8 }}>{selMsg.description}</p>
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <a href={`mailto:${selMsg.email}?subject=Re: ${selMsg.subject||'Your message to Debit'}`} style={{ display:'inline-block', background:'#111', color:'#fff', padding:'12px 28px', fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:600, transition:'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#ea580c'}
                      onMouseLeave={e => e.currentTarget.style.background='#111'}
                    >Reply via Email</a>
                    <a href={`https://wa.me/${selMsg.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', background:'#25D366', color:'#fff', padding:'12px 28px', fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:600 }}>WhatsApp</a>
                  </div>
                </div>
              ) : (
                <div style={{ border:'1px solid #e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', minHeight:300 }}>
                  <p style={{ color:'#ccc', fontSize:13, letterSpacing:2, textTransform:'uppercase' }}>Select a message</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STOCK ── */}
        {tab === 'stock' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 32 }}>Stock Management</h2>
            <h3 style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:700, color:'#ef4444', marginBottom:16 }}>Out of Stock ({products.filter(p => p.stock===0).length})</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16, marginBottom:40 }}>
              {products.filter(p => p.stock===0).map(p => (
                <div key={p.id} style={{ border:'1px solid #fee2e2', padding:16 }}>
                  <img src={p.image||'https://via.placeholder.com/180x220'} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',background:'#f5f5f5',marginBottom:10}} />
                  <p style={{ fontSize:13, color:'#111', marginBottom:4 }}>{p.name}</p>
                  <p style={{ fontSize:11, color:'#999', marginBottom:10 }}>{p.category}</p>
                  <button onClick={() => editProdFn(p)} style={{ width:'100%', background:'transparent', border:'1px solid #ea580c', color:'#ea580c', padding:'8px', fontSize:11, letterSpacing:2, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>Restock</button>
                </div>
              ))}
              {products.filter(p => p.stock===0).length === 0 && <p style={{color:'#999',fontSize:13}}>All products are in stock ✓</p>}
            </div>
            <h3 style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:700, color:'#f59e0b', marginBottom:16 }}>Low Stock — 5 or fewer ({products.filter(p => p.stock>0 && p.stock<=5).length})</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
              {products.filter(p => p.stock>0 && p.stock<=5).map(p => (
                <div key={p.id} style={{ border:'1px solid #fef3c7', padding:16 }}>
                  <img src={p.image||'https://via.placeholder.com/180x220'} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',background:'#f5f5f5',marginBottom:10}} />
                  <p style={{ fontSize:13, color:'#111', marginBottom:4 }}>{p.name}</p>
                  <p style={{ fontSize:11, color:'#999', marginBottom:4 }}>{p.category}</p>
                  <p style={{ fontSize:14, fontWeight:700, color:'#f59e0b', marginBottom:10 }}>{p.stock} remaining</p>
                  <button onClick={() => editProdFn(p)} style={{ width:'100%', background:'transparent', border:'1px solid #f59e0b', color:'#f59e0b', padding:'8px', fontSize:11, letterSpacing:2, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>Update Stock</button>
                </div>
              ))}
              {products.filter(p => p.stock>0 && p.stock<=5).length === 0 && <p style={{color:'#999',fontSize:13}}>No low-stock items.</p>}
            </div>
          </div>
        )}
      </div>


        {/* ── DEBIT CITIZEN ── */}
        {tab === 'citizen' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 8 }}>Debit Citizen</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Upload photos and videos of people wearing Debit products. They appear on the public Debit Citizen page.</p>

            {/* ── UPLOAD FORM ── */}
            <div style={{ border: '1px solid #e8e8e8', padding: 32, marginBottom: 40 }}>
              <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>
                {editCitizen ? `Editing Post` : 'Add New Post'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 24px' }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Person's Name (optional)</label>
                  <input type="text" value={citizenForm.personName} onChange={e => setCitizenForm({...citizenForm, personName: e.target.value})}
                    placeholder="e.g. Tunde A."
                    style={inputStyle} onFocus={e => e.target.style.borderColor='#ea580c'} onBlur={e => e.target.style.borderColor='#ddd'} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Media Type *</label>
                  <select value={citizenForm.type} onChange={e => { setCitizenForm({...citizenForm, type: e.target.value, mediaUrl:''}); setCitizenPreview(''); }}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="photo">📷 Photo</option>
                    <option value="video">🎬 Video</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Caption (optional)</label>
                <textarea rows={2} value={citizenForm.caption} onChange={e => setCitizenForm({...citizenForm, caption: e.target.value})}
                  placeholder="Short description or quote..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Jost', sans-serif" }}
                  onFocus={e => e.target.style.borderColor='#ea580c'} onBlur={e => e.target.style.borderColor='#ddd'} />
              </div>

              {/* ── MEDIA URL INPUT ── */}
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>{citizenForm.type === 'video' ? 'Video' : 'Photo'} URL *</label>
                <input
                  type="url"
                  value={citizenForm.mediaUrl}
                  onChange={e => {
                    const url = e.target.value;
                    setCitizenForm({...citizenForm, mediaUrl: url});
                    setCitizenPreview(url);
                  }}
                  placeholder={citizenForm.type === 'video'
                    ? 'https://example.com/video.mp4  or  YouTube/Vimeo embed URL'
                    : 'https://example.com/photo.jpg  or  image hosting URL'}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#ea580c'}
                  onBlur={e => e.target.style.borderColor='#ddd'}
                />
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                  {citizenForm.type === 'video'
                    ? 'Paste a direct MP4 link, or a Google Drive / Cloudinary / Firebase Storage video URL.'
                    : 'Paste a direct image link from Cloudinary, Firebase Storage, or any image host.'}
                </p>
              </div>

              {/* ── LIVE PREVIEW ── */}
              {citizenPreview && (
                <div style={{ marginBottom: 24, marginTop: 16 }}>
                  <label style={labelStyle}>Preview</label>
                  {citizenForm.type === 'video' ? (
                    <video key={citizenPreview} src={citizenPreview} controls style={{ maxWidth: 320, maxHeight: 220, border: '1px solid #e8e8e8', display: 'block', background: '#f5f5f5' }}
                      onError={() => toast.error('Video URL could not be loaded — check the link')} />
                  ) : (
                    <img src={citizenPreview} alt="preview" style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover', border: '1px solid #e8e8e8', display: 'block' }}
                      onError={e => { e.target.style.display='none'; toast.error('Image URL could not be loaded — check the link'); }} />
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={async () => {
                  const mediaUrl = (citizenForm.mediaUrl || editCitizen?.mediaUrl || '').trim();
                  if (!mediaUrl) { toast.error('Please enter a photo or video URL'); return; }
                  setCitizenSaving(true);
                  try {
                    const data = { ...citizenForm, mediaUrl, updatedAt: Date.now(), ...(!editCitizen && { createdAt: Date.now() }) };
                    if (editCitizen) {
                      await set(dbRef(db, `citizenPosts/${editCitizen.id}`), data);
                      toast.success('Post updated!');
                    } else {
                      await set(push(dbRef(db, 'citizenPosts')), data);
                      toast.success('Post added!');
                    }
                    setCitizenForm({ personName:'', caption:'', type:'photo', mediaUrl:'' });
                    setCitizenPreview(''); setEditCitizen(null);
                  } catch(err) { toast.error('Error: ' + err.message); }
                  setCitizenSaving(false);
                }} disabled={citizenSaving} style={{
                  background: '#ea580c', color: '#fff', border: 'none',
                  padding: '12px 32px', fontSize: 11, letterSpacing: 3,
                  textTransform: 'uppercase', fontWeight: 700, cursor: citizenSaving ? 'not-allowed' : 'pointer',
                  opacity: citizenSaving ? 0.6 : 1,
                }}>{citizenSaving ? 'Saving...' : editCitizen ? 'Update Post' : 'Publish Post'}</button>

                {editCitizen && (
                  <button onClick={() => { setEditCitizen(null); setCitizenForm({ personName:'', caption:'', type:'photo', mediaUrl:'' }); setCitizenPreview(''); }}
                    style={{ background: 'transparent', border: '1px solid #ddd', padding: '12px 24px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', color: '#888' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* ── POSTS GRID ── */}
            <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Published Posts ({citizenPosts.length})</h3>
            {citizenPosts.length === 0 ? (
              <p style={{ color: '#999', fontSize: 13 }}>No posts yet. Upload your first one above.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {citizenPosts.map(post => (
                  <div key={post.id} style={{ border: '1px solid #e8e8e8', overflow: 'hidden', position: 'relative' }}>
                    {/* Thumbnail */}
                    {post.type === 'video' ? (
                      <video src={post.mediaUrl} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#f5f5f5' }} />
                    ) : (
                      <img src={post.mediaUrl} alt={post.caption} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#f5f5f5' }} />
                    )}
                    {/* Type badge */}
                    <span style={{ position:'absolute', top:8, left:8, background: post.type==='video'?'#ea580c':'#111', color:'#fff', padding:'2px 8px', fontSize:9, letterSpacing:1.5, textTransform:'uppercase', fontWeight:700 }}>
                      {post.type === 'video' ? '🎬 Video' : '📷 Photo'}
                    </span>
                    <div style={{ padding: '12px 14px 14px' }}>
                      {post.personName && <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>{post.personName}</p>}
                      {post.caption && <p style={{ fontSize: 12, color: '#888', marginBottom: 10, lineHeight: 1.5 }}>{post.caption.length > 60 ? post.caption.slice(0,60)+'…' : post.caption}</p>}
                      <p style={{ fontSize: 10, color: '#bbb', marginBottom: 12 }}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => {
                          setEditCitizen(post);
                          setCitizenForm({ personName: post.personName||'', caption: post.caption||'', type: post.type||'photo', mediaUrl: post.mediaUrl||'' });
                          setCitizenPreview(post.mediaUrl||'');
                          window.scrollTo(0,0);
                        }} style={{ flex:1, background:'transparent', border:'1px solid #ea580c', color:'#ea580c', padding:'7px', fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>Edit</button>
                        <button onClick={async () => {
                          if (window.confirm('Delete this post?')) {
                            await remove(dbRef(db, `citizenPosts/${post.id}`));
                            toast.success('Deleted');
                          }
                        }} style={{ flex:1, background:'transparent', border:'1px solid #fee2e2', color:'#ef4444', padding:'7px', fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      <style>{`
        @media (max-width: 900px) {
          .ov-grid { grid-template-columns: 1fr !important; }
          .msg-grid { grid-template-columns: 1fr !important; }
          .img-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
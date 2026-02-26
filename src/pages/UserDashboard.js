// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing' },
  shipped: { bg: '#ede9fe', color: '#5b21b6', label: 'Shipped' },
  delivered: { bg: '#dcfce7', color: '#166534', label: 'Delivered' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

export default function UserDashboard() {
  const { currentUser, userProfile } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');

  if (!currentUser) return <Navigate to="/login" />;

  useEffect(() => {
    const unsub = onValue(ref(db, `orders/${currentUser.uid}`), snap => {
      const data = snap.val();
      setOrders(data ? Object.entries(data).map(([id, v]) => ({ id, ...v })).reverse() : []);
    });
    return unsub;
  }, [currentUser]);

  const tabs = [
    { id: 'orders', label: 'My Orders', count: orders.length },
    { id: 'wishlist', label: 'Wishlist', count: wishlist.length },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>My Account</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300 }}>
            Hello, {userProfile?.name?.split(' ')[0] || 'there'} 👋
          </h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#ea580c' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#65a30d' },
            { label: 'In Progress', value: orders.filter(o => ['processing','shipped'].includes(o.status)).length, color: '#3b82f6' },
            { label: 'Wishlist', value: wishlist.length, color: '#a855f7' },
          ].map(s => (
            <div key={s.label} style={{ border: '1px solid #e8e8e8', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 300, color: s.color, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e8e8', marginBottom: 36 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 24px', background: 'none', border: 'none',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
              color: tab === t.id ? '#ea580c' : '#888',
              borderBottom: `2px solid ${tab === t.id ? '#ea580c' : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.2s', marginBottom: -1,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.label}
              {t.count !== undefined && <span style={{ background: tab === t.id ? '#ea580c' : '#e8e8e8', color: tab === t.id ? '#fff' : '#888', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* ORDERS tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 16 }}>No orders yet</p>
                <Link to="/" style={{ display: 'inline-block', border: '1px solid #111', padding: '12px 36px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Start Shopping</Link>
              </div>
            ) : orders.map(order => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const steps = ['pending','processing','shipped','delivered'];
              const stepIdx = steps.indexOf(order.status);
              return (
                <div key={order.id} style={{ border: '1px solid #e8e8e8', marginBottom: 16, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: '#111', marginBottom: 2 }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontSize: 12, color: '#999' }}>{new Date(order.createdAt).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' })}</p>
                    </div>
                    <span style={{ background: s.bg, color: s.color, padding: '5px 12px', fontSize: 11, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                  {/* Items */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fafafa', padding: '8px 12px', fontSize: 13 }}>
                        <img src={item.image || 'https://via.placeholder.com/36x44'} alt={item.name} style={{ width: 36, height: 44, objectFit: 'cover' }} />
                        <span style={{ color: '#555' }}>{item.name} ×{item.qty}</span>
                      </div>
                    ))}
                    {order.items?.length > 4 && <span style={{ padding: '8px 12px', color: '#999', fontSize: 12, display: 'flex', alignItems: 'center' }}>+{order.items.length - 4} more</span>}
                  </div>
                  {/* Progress */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16, alignItems: 'center' }}>
                    {steps.map((step, i) => (
                      <React.Fragment key={step}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: i <= stepIdx && order.status !== 'cancelled' ? '#ea580c' : '#e8e8e8', transition: 'background 0.3s' }} />
                          <span style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: i <= stepIdx && order.status !== 'cancelled' ? '#ea580c' : '#ccc', fontWeight: 600 }}>{step}</span>
                        </div>
                        {i < steps.length - 1 && <div style={{ height: 1, flex: 2, background: i < stepIdx && order.status !== 'cancelled' ? '#ea580c' : '#e8e8e8', marginBottom: 20, transition: 'background 0.3s' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>₦{Number(order.total).toLocaleString()}</span>
                    {order.shippingAddress && <span style={{ fontSize: 12, color: '#888' }}>→ {order.shippingAddress.city}, {order.shippingAddress.state}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WISHLIST tab */}
        {tab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 16 }}>Your wishlist is empty</p>
                <Link to="/" style={{ display: 'inline-block', border: '1px solid #111', padding: '12px 36px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Explore Products</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px 20px' }}>
                {wishlist.map(item => <ProductCard key={item.id} product={item} />)}
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT tab */}
        {tab === 'account' && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ border: '1px solid #e8e8e8', padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>Account Details</h3>
              {[
                { label: 'Name', value: userProfile?.name || '—' },
                { label: 'Email', value: currentUser.email },
                { label: 'Member Since', value: userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-NG', { year:'numeric', month:'long' }) : '—' },
                { label: 'Role', value: userProfile?.role || 'customer' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                  <span style={{ color: '#888', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</span>
                  <span style={{ color: '#111' }}>{f.value}</span>
                </div>
              ))}
            </div>
            <Link to="/contact" style={{ display: 'inline-block', border: '1px solid #111', padding: '12px 32px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Contact Support</Link>
          </div>
        )}
      </div>
    </div>
  );
}

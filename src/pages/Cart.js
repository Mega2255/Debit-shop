// src/pages/Cart.js & Checkout
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, set, push, get } from 'firebase/database';
import toast from 'react-hot-toast';

/* ─── CART ─── */
export function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, cartCount } = useCart();
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;

  const shipping = cartTotal >= 50000 ? 0 : 2500;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, marginBottom: 8 }}>Shopping Cart</h1>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 48 }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 16, color: '#999' }}>Your cart is empty</p>
            <Link to="/" style={{ display: 'inline-block', border: '1px solid #111', padding: '13px 40px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, color: '#111', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
            >Continue Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }} className="cart-layout">
            {/* Items */}
            <div>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, paddingBottom: 12, borderBottom: '1px solid #e8e8e8', marginBottom: 0 }}>
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Product</span>
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', fontWeight: 600, minWidth: 100, textAlign: 'center' }}>Qty</span>
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', fontWeight: 600, minWidth: 100, textAlign: 'right' }}>Total</span>
              </div>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, padding: '24px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image || 'https://via.placeholder.com/80x100'} alt={item.name} style={{ width: 72, height: 90, objectFit: 'cover', background: '#f5f5f5' }} />
                    </Link>
                    <div>
                      <p style={{ fontSize: 11, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{item.category}</p>
                      <Link to={`/product/${item.id}`} style={{ fontSize: 14, color: '#111', display: 'block', marginBottom: 4 }}>{item.name}</Link>
                      <p style={{ fontSize: 14, color: '#555' }}>₦{Number(item.price).toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', fontSize: 11, color: '#999', cursor: 'pointer', padding: 0, marginTop: 6, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'underline' }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', width: 100 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 32, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 32, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, textAlign: 'right', minWidth: 100 }}>₦{Number(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: '#fafafa', border: '1px solid #e8e8e8', padding: 28 }}>
              <h3 style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>Order Summary</h3>
              {[
                { label: 'Subtotal', value: `₦${Number(cartTotal).toLocaleString()}` },
                { label: 'Shipping', value: shipping === 0 ? 'Free' : `₦${Number(shipping).toLocaleString()}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: '#555' }}>{r.label}</span>
                  <span style={{ color: r.label === 'Shipping' && shipping === 0 ? '#65a30d' : '#111' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: 16, marginTop: 8, marginBottom: 24 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>₦{Number(cartTotal + shipping).toLocaleString()}</span>
              </div>
              {cartTotal < 50000 && <p style={{ fontSize: 11, color: '#ea580c', marginBottom: 16, letterSpacing: 0.5 }}>Add ₦{Number(50000 - cartTotal).toLocaleString()} more for free shipping!</p>}
              <Link to="/checkout" style={{ display: 'block', background: '#111', color: '#fff', textAlign: 'center', padding: '15px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}
              >Checkout</Link>
              <Link to="/" style={{ display: 'block', textAlign: 'center', fontSize: 11, color: '#888', letterSpacing: 1 }}>Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ─── CHECKOUT ─── */
export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: userProfile?.name || '', email: currentUser?.email || '', phone: '', address: '', city: '', state: '' });
  const [loading, setLoading] = useState(false);

  if (!currentUser) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/cart" />;

  const shipping = cartTotal >= 50000 ? 0 : 2500;
  const total = cartTotal + shipping;

  // ─────────────────────────────────────────────────────────────────
  // WHATSAPP ORDER HANDLER (temporary until Paystack key is ready)
  // To switch to Paystack later: replace this function with handlePaystack below
  // ─────────────────────────────────────────────────────────────────
  const WHATSAPP_NUMBER = '2348124931302'; // 08108745980 in international format

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);

    try {
      // 1. Save order to Firebase first (status: pending — no payment yet)
      const orderData = {
        items: cart,
        total,
        status: 'pending',
        createdAt: Date.now(),
        paymentRef: 'whatsapp-order',
        shippingAddress: form,
        userId: currentUser.uid,
        userEmail: currentUser.email,
      };
      const orderRef = push(ref(db, `orders/${currentUser.uid}`));
      await set(orderRef, orderData);
      await set(ref(db, `allOrders/${orderRef.key}`), { ...orderData, orderId: orderRef.key });

      // 2. Build the WhatsApp message
      const orderLines = cart.map((item, i) =>
        `${i + 1}. ${item.name}\n   Qty: ${item.qty}  |  ₦${Number(item.price * item.qty).toLocaleString()}`
      ).join('\n');

      const msg = [
        '🛍️ *NEW ORDER — DEBIT*',
        '─────────────────────',
        '',
        `*Customer Details*`,
        `👤 Name: ${form.name}`,
        `📧 Email: ${form.email}`,
        `📞 Phone: ${form.phone}`,
        `📍 Address: ${form.address}`,
        form.city  ? `🏙️ City: ${form.city}`   : '',
        form.state ? `🗺️ State: ${form.state}` : '',
        '',
        '─────────────────────',
        `*Order Items (${cart.length})*`,
        orderLines,
        '',
        '─────────────────────',
        `🚚 Shipping: ${shipping === 0 ? 'FREE' : '₦' + Number(shipping).toLocaleString()}`,
        `💰 *TOTAL: ₦${Number(total).toLocaleString()}*`,
        '',
        `🔖 Order ID: #${orderRef.key.slice(-8).toUpperCase()}`,
        '',
        '_Please reply to confirm and arrange payment._',
      ].filter(line => line !== null && line !== undefined && !(line === '' && false))
       .join('\n');

      // 3. Clear cart and redirect
      await clearCart();
      toast.success('Order sent! Redirecting to WhatsApp...');

      // 4. Open WhatsApp with the pre-filled message
      const encoded = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
        navigate('/dashboard');
        setLoading(false);
      }, 1200);

    } catch (err) {
      toast.error('Something went wrong: ' + err.message);
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // PAYSTACK HANDLER — uncomment and replace handlePay when key is ready
  // ─────────────────────────────────────────────────────────────────
  // const handlePay = () => {
  //   if (!form.name || !form.email || !form.phone || !form.address) { toast.error('Please fill all required fields'); return; }
  //   setLoading(true);
  //   const handler = window.PaystackPop?.setup({
  //     key: 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY',
  //     email: form.email,
  //     amount: total * 100,
  //     currency: 'NGN',
  //     ref: `DEBIT_${Date.now()}`,
  //     callback: async (response) => {
  //       const orderData = {
  //         items: cart, total, status: 'processing',
  //         createdAt: Date.now(),
  //         paymentRef: response.reference,
  //         shippingAddress: form,
  //         userId: currentUser.uid,
  //         userEmail: currentUser.email,
  //       };
  //       const orderRef = push(ref(db, `orders/${currentUser.uid}`));
  //       await set(orderRef, orderData);
  //       await set(ref(db, `allOrders/${orderRef.key}`), { ...orderData, orderId: orderRef.key });
  //       const today = new Date().toISOString().split('T')[0];
  //       const revSnap = await get(ref(db, `revenue/${today}`));
  //       await set(ref(db, `revenue/${today}`), (revSnap.val() || 0) + total);
  //       await clearCart();
  //       toast.success('Payment successful! Order placed.');
  //       navigate('/dashboard');
  //       setLoading(false);
  //     },
  //     onClose: () => { setLoading(false); toast.error('Payment cancelled'); },
  //   });
  //   if (!handler) { toast.error('Payment system not available.'); setLoading(false); return; }
  //   handler.openIframe();
  // };

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, marginBottom: 48 }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' }} className="checkout-layout">
          {/* Form */}
          <div>
            <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 28, paddingBottom: 12, borderBottom: '1px solid #e8e8e8' }}>Shipping Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }} className="form-grid">
              {[
                { key: 'name', label: 'Full Name *', type: 'text', span: false },
                { key: 'email', label: 'Email Address *', type: 'email', span: false },
                { key: 'phone', label: 'Phone Number *', type: 'tel', span: true },
                { key: 'address', label: 'Street Address *', type: 'text', span: true },
                { key: 'city', label: 'City', type: 'text', span: false },
                { key: 'state', label: 'State', type: 'text', span: false },
              ].map(field => (
                <div key={field.key} style={{ gridColumn: field.span ? '1 / -1' : 'span 1', marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: '#555', marginBottom: 8 }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: 14, outline: 'none', background: 'transparent', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#ea580c'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#fafafa', border: '1px solid #e8e8e8', padding: 28, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Your Order</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                <img src={item.image || 'https://via.placeholder.com/52x64'} alt={item.name} style={{ width: 52, height: 64, objectFit: 'cover', background: '#f0f0f0' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#111', marginBottom: 2 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>×{item.qty}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>₦{Number(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 16, marginTop: 8 }}>
              {[
                { label: 'Subtotal', val: `₦${Number(cartTotal).toLocaleString()}` },
                { label: 'Shipping', val: shipping === 0 ? 'Free' : `₦${Number(shipping).toLocaleString()}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: '#555' }}>{r.label}</span><span>{r.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 18 }}>₦{Number(total).toLocaleString()}</span>
              </div>
              <button onClick={handlePay} disabled={loading} style={{
                width: '100%', padding: '15px', background: loading ? '#888' : '#111',
                color: '#fff', border: 'none', fontSize: 11, letterSpacing: 3,
                textTransform: 'uppercase', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 10, transition: 'background 0.2s',
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ea580c'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#111'; }}
              >{loading ? 'Sending Order...' : '📲  Order via WhatsApp'}</button>
              <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>💬 You'll be taken to WhatsApp to confirm</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
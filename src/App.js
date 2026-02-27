// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Cart, Checkout } from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Category, { SearchResults } from './pages/Category';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import DebitCitizen from './pages/DebitCitizen';

function Layout({ children, noFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#111',
                color: '#fff',
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                letterSpacing: 0.5,
                borderRadius: 2,
                padding: '12px 20px',
              },
              success: { iconTheme: { primary: '#84cc16', secondary: '#000' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Layout><UserDashboard /></Layout>} />
            <Route path="/orders" element={<Layout><UserDashboard /></Layout>} />
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout noFooter><Checkout /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/category/:slug" element={<Layout><Category /></Layout>} />
            <Route path="/search" element={<Layout><SearchResults /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
            <Route path="/lookbook" element={<Layout><Category /></Layout>} />
            <Route path="/debit-citizen" element={<Layout><DebitCitizen /></Layout>} />
            <Route path="*" element={<Layout>
              <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, paddingTop: 100 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 120, fontWeight: 300, color: '#e8e8e8', lineHeight: 1 }}>404</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#111' }}>Page Not Found</h2>
                <a href="/" style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, color: '#ea580c', borderBottom: '1px solid #ea580c', paddingBottom: 2, marginTop: 8 }}>Go Home</a>
              </div>
            </Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
  );
}
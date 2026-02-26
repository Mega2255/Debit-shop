// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, remove, get } from 'firebase/database';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!currentUser) { setCart([]); setWishlist([]); return; }
    const cartRef = ref(db, `carts/${currentUser.uid}`);
    const wishRef = ref(db, `wishlists/${currentUser.uid}`);
    const unsubCart = onValue(cartRef, snap => {
      const data = snap.val();
      setCart(data ? Object.values(data) : []);
    });
    const unsubWish = onValue(wishRef, snap => {
      const data = snap.val();
      setWishlist(data ? Object.values(data) : []);
    });
    return () => { unsubCart(); unsubWish(); };
  }, [currentUser]);

  async function addToCart(product) {
    if (!currentUser) return false;
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      await set(ref(db, `carts/${currentUser.uid}/${product.id}`), {
        ...existing, qty: existing.qty + 1
      });
    } else {
      await set(ref(db, `carts/${currentUser.uid}/${product.id}`), { ...product, qty: 1 });
    }
    return true;
  }

  async function removeFromCart(productId) {
    if (!currentUser) return;
    await remove(ref(db, `carts/${currentUser.uid}/${productId}`));
  }

  async function updateQty(productId, qty) {
    if (!currentUser) return;
    if (qty <= 0) { removeFromCart(productId); return; }
    const item = cart.find(i => i.id === productId);
    if (item) await set(ref(db, `carts/${currentUser.uid}/${productId}`), { ...item, qty });
  }

  async function clearCart() {
    if (!currentUser) return;
    await remove(ref(db, `carts/${currentUser.uid}`));
  }

  async function toggleWishlist(product) {
    if (!currentUser) return false;
    const exists = wishlist.find(i => i.id === product.id);
    if (exists) {
      await remove(ref(db, `wishlists/${currentUser.uid}/${product.id}`));
    } else {
      await set(ref(db, `wishlists/${currentUser.uid}/${product.id}`), product);
    }
    return true;
  }

  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

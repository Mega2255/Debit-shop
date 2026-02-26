# LuxeStore - Premium Streetwear E-Commerce

A full-featured e-commerce platform built with React, Tailwind-inspired inline CSS, Firebase Authentication, and Firebase Realtime Database.

## 🎨 Design
- **Colors**: Orange (#f97316), Green (#84cc16), Lemon (#eab308) on dark (#0a0a0a) background
- **Fonts**: Bebas Neue (headings), Syne (UI/labels), DM Sans (body)
- **Style**: Luxury streetwear aesthetic, responsive for all screens

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd luxestore
npm install
```

### 2. Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g., "luxestore")
3. Enable **Authentication** → Sign-in methods → Enable **Email/Password**
4. Enable **Realtime Database** → Start in **test mode**
5. Enable **Storage** → Start in **test mode**
6. Go to Project Settings → Your apps → Add web app → Copy config

### 3. Configure Firebase

Edit `src/firebase.js` and replace with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Configure Paystack

1. Sign up at [paystack.com](https://paystack.com)
2. Get your **Public Key** from Dashboard → Settings → API Keys
3. In `src/pages/Cart.js`, find this line and replace:
   ```javascript
   key: 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY',
   ```
   With your actual Paystack public key.

### 5. Create Admin User

After deploying, register a user normally, then in Firebase Console:
- Go to Realtime Database
- Navigate to `users/{uid}`
- Change `"role": "user"` to `"role": "admin"`

Now that user will see the Admin Dashboard.

### 6. Firebase Database Rules (for production)

```json
{
  "rules": {
    "products": { ".read": true, ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'" },
    "orders": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "allOrders": { ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'", ".write": "auth != null" },
    "users": { "$uid": { ".read": "auth != null && auth.uid == $uid", ".write": "auth != null && auth.uid == $uid" }, ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'" },
    "carts": { "$uid": { ".read": "auth != null && auth.uid == $uid", ".write": "auth != null && auth.uid == $uid" } },
    "wishlists": { "$uid": { ".read": "auth != null && auth.uid == $uid", ".write": "auth != null && auth.uid == $uid" } },
    "messages": { ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'", ".write": true },
    "revenue": { ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'", ".write": "auth != null" }
  }
}
```

### 7. Run the App
```bash
npm start
```

---

## 📦 Features

### User Features
- Register & login with email/password
- Browse products by category (New Arrivals, Men, Women, Collections, Classics)
- Product search
- Product detail pages with related products
- Add to cart, update quantity, remove from cart
- Add/remove from wishlist
- Secure checkout with Paystack payment
- Order tracking with status updates
- User dashboard with order history & wishlist management
- Contact/support form

### Admin Features
- Dashboard overview with revenue stats (daily/weekly/monthly/yearly)
- Add, edit, delete products with image upload
- Manage product categories and stock
- View and update all orders with status management
- View all users with search/filter
- Receive and read customer messages
- Stock alerts (out of stock & low stock products)
- Sales analytics (most/least bought products)

---

## 🗂 Project Structure

```
src/
├── firebase.js           # Firebase config
├── index.js              # Entry point
├── App.js                # Routes & layout
├── context/
│   ├── AuthContext.js    # Authentication state
│   └── CartContext.js    # Cart & wishlist state
├── components/
│   ├── Navbar.js         # Navigation with dropdowns
│   ├── Footer.js         # Footer with newsletter
│   ├── ProductCard.js    # Reusable product card
│   └── WhatsAppFloat.js  # WhatsApp floating button
└── pages/
    ├── Home.js           # Homepage with hero, categories, products
    ├── Auth.js           # Login & Register
    ├── UserDashboard.js  # User orders, wishlist dashboard
    ├── AdminDashboard.js # Full admin panel
    ├── Cart.js           # Cart & Checkout with Paystack
    ├── ProductDetail.js  # Single product page
    ├── Category.js       # Category listing & search results
    ├── Contact.js        # Contact form
    └── Wishlist.js       # Wishlist page
```

---

## 🚀 Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. It auto-detects React → Deploy!

## Contact
- Phone/WhatsApp: +234 903 434 4183
- Email: Debitbyrecent@gmail.com

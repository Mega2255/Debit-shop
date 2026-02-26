// src/pages/Category.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import ProductCard from '../components/ProductCard';

const SORT = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name', label: 'Name A–Z' },
];

// Subcategory groups to show within Men/Women pages
const MEN_SUBCATS = [
  { slug: 'men-t-shirts', label: 'T-Shirts' },
  { slug: 'men-shirts', label: 'Shirts' },
  { slug: 'men-pants', label: 'Pants' },
  { slug: 'men-shorts', label: 'Shorts' },
  { slug: 'men-jackets', label: 'Jackets' },
  { slug: 'men-jerseys', label: 'Jerseys' },
  { slug: 'men-belts', label: 'Belts' },
  { slug: 'men-glasses', label: 'Glasses' },
  { slug: 'men-headwear', label: "Headwear's" },
  { slug: 'men-socks', label: 'Socks' },
];

const WOMEN_SUBCATS = [
  { slug: 'women-tops', label: 'Tops' },
  { slug: 'women-bottoms', label: 'Bottoms' },
  { slug: 'women-dresses', label: 'Dresses' },
  { slug: 'women-jackets', label: 'Jackets' },
  { slug: 'women-swimwear', label: 'Swimwear' },
  { slug: 'women-jerseys', label: 'Jerseys' },
  { slug: 'women-belts', label: 'Belts' },
  { slug: 'women-glasses', label: 'Glasses' },
  { slug: 'women-headwear', label: "Headwear's" },
  { slug: 'women-socks', label: 'Socks' },
];

// Maps a slug to the category string(s) stored in Firebase
// e.g. slug "men-belts"   → "Men - Belts"
//      slug "men-t-shirts" → "Men - T-Shirts"
function matchesSubcat(productCategory, subcatSlug) {
  const cat = (productCategory || '').toLowerCase().trim();
  const slug = subcatSlug.toLowerCase().trim();

  // Extract gender prefix and the rest of the slug
  let gender = '';
  let rest = slug;
  if (slug.startsWith('men-')) { gender = 'men'; rest = slug.slice(4); }
  else if (slug.startsWith('women-')) { gender = 'women'; rest = slug.slice(6); }

  if (gender) {
    // Build all plausible category string variants:
    // 1) "men - t-shirts"  (keep inner hyphens — matches Firebase "Men - T-Shirts")
    const withDash   = gender + ' - ' + rest;
    // 2) "men - t shirts"  (all hyphens→spaces)
    const allSpaced  = gender + ' - ' + rest.replace(/-/g, ' ');
    // 3) "men t-shirts"    (no dash separator)
    const noSep      = gender + ' ' + rest;
    // 4) "men t shirts"
    const allSpaced2 = gender + ' ' + rest.replace(/-/g, ' ');

    return [withDash, allSpaced, noSep, allSpaced2].some(v => cat === v || cat.includes(v));
  }

  // Fallback for non-gendered slugs
  const spaced = slug.replace(/-/g, ' ');
  return cat === slug || cat === spaced || cat.includes(slug) || cat.includes(spaced);
}

// ── Subcategory Section (used inside Men/Women pages) ──
function SubcatSection({ label, products }) {
  const hasProducts = products.length > 0;
  return (
    <div style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24, borderBottom: '1px solid #f0f0f0', paddingBottom: 12 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, color: '#ea580c', letterSpacing: 1 }}>{label}</h2>
        {hasProducts && <span style={{ fontSize: 12, color: '#bbb' }}>{products.length} item{products.length !== 1 ? 's' : ''}</span>}
      </div>
      {hasProducts ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '36px 20px' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', background: '#fafafa', border: '1px dashed #e8e8e8' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: '#ccc', marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#ea580c', fontWeight: 600 }}>Coming Soon!</p>
        </div>
      )}
    </div>
  );
}

export default function Category() {
  const { slug } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const isMen = slug === 'men';
  const isWomen = slug === 'women';
  const isGrouped = isMen || isWomen;

  const title = (slug || 'All').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const unsub = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setAllProducts(arr);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let r = [...allProducts];
    if (slug && slug !== 'all') {
      const s = slug.toLowerCase();
      r = r.filter(p => {
        const cat = (p.category || '').toLowerCase();
        if (s === 'new-arrivals') return !!p.isNew;
        if (s === 'men') return cat.includes('men') && !cat.includes('women');
        if (s === 'women') return cat.includes('women');
        if (s === 'collections') return cat.includes('collection') || cat.includes('classic') || cat.includes('summer') || cat.includes('manor');
        if (s === 'classics') return cat.includes('classic');
        // handle subcategory slugs like "men-t-shirts", "women-belts" etc.
        return matchesSubcat(p.category, s) || cat.includes(s) || cat === s;
      });
    }
    if (search) r = r.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') r.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') r.sort((a, b) => b.price - a.price);
    else if (sort === 'name') r.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    setFiltered(r);
    setPage(1);
  }, [allProducts, slug, sort, search]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  // For grouped (men/women) views, get products per subcategory
  const subcats = isMen ? MEN_SUBCATS : isWomen ? WOMEN_SUBCATS : [];
  const getSubcatProducts = (subcatSlug) =>
    allProducts.filter(p => matchesSubcat(p.category, subcatSlug));

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e8e8e8', padding: '40px 40px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, letterSpacing: 1, marginBottom: 8, color: '#ea580c' }}>{title}</h1>
        <p style={{ color: '#999', fontSize: 13 }}>{filtered.length} Product{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Toolbar */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 40px', display: 'flex', gap: 16, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ padding: '9px 14px', border: '1px solid #e8e8e8', fontSize: 13, outline: 'none', minWidth: 220, transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#ea580c'}
          onBlur={e => e.target.style.borderColor = '#e8e8e8'}
        />
        {!isGrouped && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #e8e8e8', fontSize: 13, outline: 'none', background: '#fff', cursor: 'pointer' }}>
              {SORT.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Grouped (Men / Women) view */}
      {isGrouped ? (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 40px 80px' }}>
          {subcats.map(sc => (
            <SubcatSection
              key={sc.slug}
              label={sc.label}
              products={getSubcatProducts(sc.slug).filter(p =>
                !search || (p.name || '').toLowerCase().includes(search.toLowerCase())
              )}
            />
          ))}
        </div>
      ) : (
        /* Flat grid for all other categories */
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 40px 80px' }}>
          {paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 12 }}>No products found</p>
              <p style={{ fontSize: 13 }}>Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px 20px' }}>
                {paginated.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 60 }}>
                  <button onClick={() => setPage(p => p + 1)} style={{
                    border: '1px solid #111', background: 'transparent', padding: '13px 48px',
                    fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                  >Load More ({filtered.length - paginated.length} remaining)</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Search results
export function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const unsub = onValue(ref(db, 'products'), snap => {
      const data = snap.val();
      if (data) {
        const q = query.toLowerCase();
        const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }))
          .filter(p => (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
        setResults(arr);
      }
    });
    return unsub;
  }, [query]);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 40px 80px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>Search Results</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, marginBottom: 8 }}>"{query}"</h1>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 48 }}>{results.length} result{results.length !== 1 ? 's' : ''} found</p>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 12 }}>No results found</p>
            <p style={{ fontSize: 13 }}>Try different keywords.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px 20px' }}>
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

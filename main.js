/* ============================================
   VATOS CUTS — main.js
   ============================================
   Índice:
   1. Configuración
   2. Productos
   3. Carrito
   4. Render Productos
   5. Filtro Categorías
   6. WhatsApp
   7. Toast
   8. Cursor
   9. Init
============================================ */


/* ── 1. CONFIGURACIÓN ─────────────────────── */

// ← REEMPLAZÁ con tu número de WhatsApp
// Formato: código de país + código de área + número
// Ejemplo Argentina: 549 + 11 + 12345678 = "5491112345678"
const WPP_NUMBER = "5491100000000";


/* ── 2. PRODUCTOS ─────────────────────────── */

// Para agregar un producto nuevo, copiá uno de estos objetos
// y completá los datos. El "id" debe ser único.
// Para agregar una imagen real, reemplazá "emoji" por
// "img": "img/productos/nombre-archivo.jpg"

const PRODUCTS = [
  // BARBER
  { id: 1, name: "Pomada Mate Premium",   cat: "barber",     price: 3500,  emoji: "🧴", tag: "new" },
  { id: 2, name: "Cera Modeladora Gold",  cat: "barber",     price: 4200,  emoji: "✨", tag: null  },
  { id: 3, name: "Shampoo Anticaída",     cat: "barber",     price: 2800,  emoji: "💧", tag: null  },
  { id: 4, name: "Aceite de Barba",       cat: "barber",     price: 3200,  emoji: "🧔", tag: "hot" },
  { id: 5, name: "Balm Hidratante",       cat: "barber",     price: 2900,  emoji: "🌿", tag: null  },
  { id: 6, name: "Peine de Sándalo",      cat: "barber",     price: 1800,  emoji: "🪮", tag: null  },
  
  // FRAGANCIA
  { id: 7, name: "Perfume Masculino",     cat: "fragancia",  price: 12000, emoji: "🫧", tag: "new" },
  { id: 8, name: "Desodorante Stick",     cat: "fragancia",  price: 2500,  emoji: "🧼", tag: null  },
  { id: 9, name: "Body Splash",           cat: "fragancia",  price: 4800,  emoji: "💨", tag: null  },

  // ACCESORIOS
  { id: 10, name: "Gorra Snapback VC",    cat: "accesorios", price: 6500,  emoji: "🧢", tag: "hot" },
  { id: 11, name: "Remera Oversize",      cat: "accesorios", price: 9800,  emoji: "👕", tag: null  },
  { id: 12, name: "Campeón Varsity",      cat: "accesorios", price: 18500, emoji: "🧥", tag: "new" },
  { id: 13, name: "Parlante Bluetooth",   cat: "accesorios", price: 22000, emoji: "🔊", tag: "hot" },
  { id: 14, name: "Auriculares TWS",      cat: "accesorios", price: 15000, emoji: "🎧", tag: null  },
  { id: 15, name: "Cargador Inalámbrico", cat: "accesorios", price: 8500,  emoji: "⚡", tag: "new" },
   ];

/* ── 3. CARRITO ───────────────────────────── */

let cart = [];
let activeFilter = 'all';

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const exists = cart.find(i => i.id === id);

  if (exists) {
    cart = cart.filter(i => i.id !== id);
    showToast(`${product.name} — Eliminado del carrito`);
  } else {
    cart.push({ ...product, qty: 1 });
    showToast(`${product.name} — Agregado ✓`);
  }

  updateCartUI();
  renderProducts(activeFilter);
}

function updateCartUI() {
  const countEl  = document.getElementById('cartCount');
  const itemsEl  = document.getElementById('cartItems');
  const totalEl  = document.getElementById('cartTotal');

  countEl.textContent = cart.length;

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  totalEl.textContent = `$${total.toLocaleString('es-AR')}`;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        CARRITO VACÍO<br><br>
        <span>// AGREGÁ PRODUCTOS</span>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">$${(i.price * i.qty).toLocaleString('es-AR')}</div>
      </div>
      <button class="cart-item-remove" onclick="addToCart(${i.id})">✕</button>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}


/* ── 4. RENDER PRODUCTOS ──────────────────── */

function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => {
    const inCart  = cart.find(i => i.id === p.id);
    const tagHTML = p.tag
      ? `<div class="product-tag tag-${p.tag}">${p.tag === 'new' ? 'Nuevo' : 'Hot'}</div>`
      : '';

    // Si el producto tiene imagen usa <img>, si no usa emoji
    const mediaHTML = p.img
      ? `<img class="product-img" src="${p.img}" alt="${p.name}">`
      : `<div class="product-placeholder">${p.emoji}</div>`;

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrap">
          ${mediaHTML}
          ${tagHTML}
          <div class="card-overlay">
            <button class="add-btn ${inCart ? 'added' : ''}" onclick="addToCart(${p.id})">
              ${inCart ? '✓ Agregado' : '+ Agregar'}
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-cat">${p.cat}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">$${p.price.toLocaleString('es-AR')}</div>
        </div>
      </div>
    `;
  }).join('');
}


/* ── 5. FILTRO CATEGORÍAS ─────────────────── */

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}


/* ── 6. WHATSAPP ──────────────────────────── */

function sendToWhatsApp() {
  if (cart.length === 0) {
    showToast('Agregá productos primero 😅');
    return;
  }

  const lines = cart.map(i =>
    `• ${i.name} — $${(i.price * i.qty).toLocaleString('es-AR')}`
  );
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const msg = [
    `🛒 *Pedido desde Vatos Cuts*`,
    ``,
    ...lines,
    ``,
    `*Total: $${total.toLocaleString('es-AR')}*`,
    ``,
    `Quiero hacer este pedido!`
  ].join('\n');

  const url = `https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}


/* ── 7. TOAST ─────────────────────────────── */

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}


/* ── 8. CURSOR ────────────────────────────── */

const cursorEl  = document.getElementById('cursor');
const ringEl    = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorEl.style.left = mx - 6 + 'px';
  cursorEl.style.top  = my - 6 + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ringEl.style.left = rx - 18 + 'px';
  ringEl.style.top  = ry - 18 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('button, a, .product-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorEl.style.transform = 'scale(2)';
    ringEl.style.transform   = 'scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursorEl.style.transform = 'scale(1)';
    ringEl.style.transform   = 'scale(1)';
  });
});


/* ── 9. INIT ──────────────────────────────── */

renderProducts();

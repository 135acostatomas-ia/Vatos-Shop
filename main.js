/* ============================================
   VATOS STUDIO — main.js
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
const WPP_NUMBER = "5491164562757";


/* ── 2. PRODUCTOS ─────────────────────────── */

// Para agregar un producto nuevo, copiá uno de estos objetos
// y completá los datos. El "id" debe ser único.
// Para agregar una imagen real, reemplazá "emoji" por
// "img": "img/productos/nombre-archivo.jpg"

const PRODUCTS = [
  // BARBER — SIR FAUSTO (en stock)
{ id: 1,  name: "Shampoo para Barba 100ml",   cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/shampoobarba.png",     tag: null },
{ id: 2,  name: "Shampoo para Cabello 100ml", cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/shampocabello.png",    tag: null },
{ id: 3,  name: "Old Wax Suave 50ml",         cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/oldwaxsuave.png",      tag: null },
{ id: 4,  name: "Old Wax Fuerte 50ml",        cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/oldwaxfuerte.png",     tag: null },
{ id: 5,  name: "Forming Paste 50ml",         cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/formingpaste.png",     tag: null },
{ id: 6,  name: "Pomada Brillante 50ml",      cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/pomadabrillante.png",  tag: null },
{ id: 7,  name: "Pomada Opaca 50ml",          cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/pomadaopaca.png",      tag: null },
{ id: 8,  name: "Óleo Esencial Barba 30ml",   cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/oleoesencialbarba.png", tag: null },
{ id: 9,  name: "Hybrid Clay Pure 50ml",      cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/hybridclay.png",       tag: null },
{ id: 10, name: "Facial Mask Pure 50ml",      cat: "barber", brand: "sirfausto", price: 0, img: "img/productos/Fragancias/sirfausto/facialmask.png",       tag: null },

  // FRAGANCIAS
{ id: 20, name: "Lattafa Khamrah",                 cat: "fragancia", price: 18000, img: "img/productos/Fragancias/LattafaKhamrah.png",       tag: null },
{ id: 21, name: "Lattafa Asad",                    cat: "fragancia", price: 19000, img: "img/productos/Fragancias/LattafaAsad.png",          tag: null },
{ id: 22, name: "Afnan 9PM Negro",                 cat: "fragancia", price: 19000, img: "img/productos/Fragancias/afnan9pm.png",        tag: null },
{ id: 23, name: "Armaf Club de Nuit Intense Man",  cat: "fragancia", price: 22000, img: "img/productos/Fragancias/armafclub.png", tag: null },
];

/* ── 3. CARRITO ───────────────────────────── */

let cart = [];
let activeFilter = 'all';

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const exists = cart.find(i => i.id === id);

  if (exists) {
    exists.qty += 1;
    showToast(`${product.name} — Cantidad: ${exists.qty}`);
  } else {
    cart.push({ ...product, qty: 1 });
    showToast(`${product.name} — Agregado ✓`);
  }

  updateCartUI();
  renderProducts(activeFilter);
}

function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += 1;
  updateCartUI();
  renderProducts(activeFilter);
}

function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    cart = cart.filter(i => i.id !== id);
    showToast(`${item.name} — Eliminado`);
  }

  updateCartUI();
  renderProducts(activeFilter);
}

function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  cart = cart.filter(i => i.id !== id);
  showToast(`${item.name} — Eliminado`);
  updateCartUI();
  renderProducts(activeFilter);
}

function updateCartUI() {
  const countEl  = document.getElementById('cartCount');
  const itemsEl  = document.getElementById('cartItems');
  const totalEl  = document.getElementById('cartTotal');
  const bnCountEl = document.getElementById('bnCount');

  // Suma total de unidades
  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
  countEl.textContent = totalQty;
  if (bnCountEl) bnCountEl.textContent = totalQty;

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
        <div class="qty-controls">
          <button class="qty-btn" onclick="decreaseQty(${i.id})">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${i.id})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button>
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

    const mediaHTML = p.img
   ? `<img class="product-img" src="${p.img}" alt="${p.name}">`
   : `<div class="product-placeholder">${p.emoji}</div>`;

    const buttonHTML = inCart
      ? `
        <div class="card-qty-controls">
          <button class="qty-btn" onclick="event.stopPropagation(); decreaseQty(${p.id})">−</button>
          <span class="qty-num">${inCart.qty}</span>
          <button class="qty-btn" onclick="event.stopPropagation(); increaseQty(${p.id})">+</button>
        </div>
      `
      : `
        <button class="add-btn" onclick="addToCart(${p.id})">
          + Agregar
        </button>
      `;

    return `
    <div class="product-card" data-id="${p.id}" ${p.img ? `onclick="openLightbox('${p.img}', '${p.name}')"` : ''}>
        <div class="product-img-wrap">
          ${mediaHTML}
          ${tagHTML}
          <div class="card-overlay">
            ${buttonHTML}
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

let activeBrand = null;

function filterProducts(cat, btn) {
  activeFilter = cat;
  activeBrand = null;

  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const subTabs = document.getElementById('subTabsBarber');
  const banner = document.getElementById('brandBanner');

  if (cat === 'barber') {
    subTabs.classList.add('active');
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    banner.classList.remove('active');
    stopCarousel();
    document.getElementById('productsGrid').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Elegí una marca</div>
        <div class="empty-state-text">// Tocá Sir Fausto, Marca 2 u Otros</div>
      </div>`;
  } else if (cat === 'fragancia') {
    subTabs.classList.remove('active');
    banner.classList.add('active');
    banner.innerHTML = `
      <div class="carousel">
        <div class="carousel-track" id="carouselTrack">
          <picture>
            <source media="(max-width: 768px)" srcset="img/brand/banners/banner1app.png">
            <img src="img/brand/banners/banner1web.png" alt="Vato Essence">
          </picture>
          <picture>
            <source media="(max-width: 768px)" srcset="img/brand/banners/banner2app.png">
            <img src="img/brand/banners/banner2web.png" alt="Atomizadores 8ml">
          </picture>
        </div>
        <div class="carousel-dots" id="carouselDots">
          <span class="dot active" onclick="goToSlide(0)"></span>
          <span class="dot" onclick="goToSlide(1)"></span>
        </div>
      </div>`;
    setTimeout(() => startCarousel(), 50);
    renderProducts(cat);
  } else {
    subTabs.classList.remove('active');
    banner.classList.remove('active');
    stopCarousel();
    renderProducts(cat);
  }
}

function filterBrand(brand, btn) {
  activeBrand = brand;
  
  // Marcar sub-tab activa
  document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  // Mostrar banner de la marca
  const banner = document.getElementById('brandBanner');
  banner.classList.add('active');
  
  if (brand === 'sirfausto') {
  banner.innerHTML = `
    <div class="carousel sf-carousel">
      <div class="carousel-track" id="carouselTrack">
        <picture>
          <source media="(max-width: 768px)" srcset="img/brand/banners/bannersirfaustoapp.png">
          <img src="img/brand/banners/bannersirfaustoweb.png" alt="Sir Fausto">
        </picture>
      </div>
    </div>
  `;
} else if (brand === 'marca2') {
  banner.innerHTML = `<div class="brand-banner-placeholder">MARCA 2</div>`;
} else {
  banner.innerHTML = `<div class="brand-banner-placeholder">OTROS PRODUCTOS</div>`;
}
  
  // Filtrar productos por marca
  const filtered = PRODUCTS.filter(p => p.cat === 'barber' && p.brand === brand);
  
  if (filtered.length === 0) {
    document.getElementById('productsGrid').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Próximamente</div>
        <div class="empty-state-text">// Productos en camino</div>
      </div>`;
    return;
  }
  
  renderProductsList(filtered);
}

function renderProductsList(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(p => {
    const inCart  = cart.find(i => i.id === p.id);
    const tagHTML = p.tag
      ? `<div class="product-tag tag-${p.tag}">${p.tag === 'new' ? 'Nuevo' : 'Hot'}</div>`
      : '';
    const mediaHTML = p.img
  ? `<img class="product-img" src="${p.img}" alt="${p.name}">`
  : `<div class="product-placeholder">${p.emoji}</div>`;
    const buttonHTML = inCart
      ? `
        <div class="card-qty-controls">
          <button class="qty-btn" onclick="event.stopPropagation(); decreaseQty(${p.id})">−</button>
          <span class="qty-num">${inCart.qty}</span>
          <button class="qty-btn" onclick="event.stopPropagation(); increaseQty(${p.id})">+</button>
        </div>`
      : `<button class="add-btn" onclick="addToCart(${p.id})">+ Agregar</button>`;
    
    return `
     <div class="product-card" data-id="${p.id}" ${p.img ? `onclick="openLightbox('${p.img}', '${p.name}')"` : ''}>
        <div class="product-img-wrap">
          ${mediaHTML}
          ${tagHTML}
          <div class="card-overlay">${buttonHTML}</div>
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


/* ── 6. WHATSAPP ──────────────────────────── */

function sendToWhatsApp() {
  if (cart.length === 0) {
    showToast('Agregá productos primero 😅');
    return;
  }

  const lines = cart.map(i =>
    `• ${i.name} x${i.qty} — $${(i.price * i.qty).toLocaleString('es-AR')}`
  );
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const msg = [
    `🛒 *Pedido desde Vatos Studio*`,
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

// Al cargar, mostrar mensaje "Elegí categoría"
document.getElementById('productsGrid').innerHTML = `
  <div class="empty-state">
    <div class="empty-state-title">Elegí una categoría</div>
    <div class="empty-state-text">// Tocá Barber, Fragancia o Accesorios</div>
  </div>`;

const BARBEROS = {
  luca:    { name: "Luca",    wpp: "5491156431982" },
  leandro: { name: "Leandro", wpp: "5491126556031" }
};

function openBarberModal() {
  document.getElementById('barberModal').classList.add('open');
  document.getElementById('barberOverlay').classList.add('active');
}

function closeBarberModal() {
  document.getElementById('barberModal').classList.remove('open');
  document.getElementById('barberOverlay').classList.remove('active');
}

function bookBarber(barberoId) {
  const b = BARBEROS[barberoId];
  if (!b) return;
  const msg = `Hola ${b.name}! Quiero coordinar un turno en Vatos Studio 💈`;
  const url = `https://wa.me/${b.wpp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeBarberModal();
}

/* ── CARRUSEL ─────────────────────────── */
let carouselIndex = 0;
let carouselInterval = null;

function startCarousel() {
  stopCarousel();
  carouselIndex = 0;
  updateCarousel();
  carouselInterval = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % 2;
    updateCarousel();
  }, 6000);
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function goToSlide(index) {
  carouselIndex = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.dot');
  if (!track) return;
  track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
}

/* ── TOUCH SWIPE CARRUSEL ─────────────────── */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      carouselIndex = Math.min(carouselIndex + 1, 1);
    } else {
      carouselIndex = Math.max(carouselIndex - 1, 0);
    }
    updateCarousel();
  }
});

/* ── LIGHTBOX ─────────────────────────── */
function openLightbox(src, alt) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-overlay" onclick="closeLightbox()"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" onclick="closeLightbox()">✕</button>
      <img src="${src}" alt="${alt}">
    </div>`;
  document.body.appendChild(lb);
  setTimeout(() => lb.classList.add('active'), 10);
}

function closeLightbox() {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  setTimeout(() => lb.remove(), 300);
}
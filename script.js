// ----- ДАННЫЕ ТОВАРОВ (замените на свои) -----
const PRODUCTS = [
  { id: 1,  name: "Кедр и дым",        note: "Тёплая древесная база, лёгкий дым можжевельника", price: 420, hue: "#5C6B4C" },
  { id: 2,  name: "Инжир и молоко",    note: "Сладкий инжир на кремовой ноте",                   price: 380, hue: "#B98B6A" },
  { id: 3,  name: "Морская соль",      note: "Солёный бриз, немного амбры",                       price: 400, hue: "#7C93A0" },
  { id: 4,  name: "Кофе и ваниль",     note: "Обжаренные зёрна с мягкой ванилью",                 price: 390, hue: "#7A5A3E" },
  { id: 5,  name: "Мокрый камень",     note: "Минеральный, почти без запаха",                     price: 360, hue: "#9B9689" },
  { id: 6,  name: "Дикая роза",        note: "Свежий цветочный аккорд без приторности",           price: 410, hue: "#B4677A" },
  { id: 7,  name: "Табак и мёд",       note: "Плотный, вечерний аромат",                          price: 450, hue: "#8C6A34" },
  { id: 8,  name: "Зелёный чай",       note: "Лёгкий, травяной, бодрящий",                        price: 370, hue: "#7E9469" },
  { id: 9,  name: "Сандал",            note: "Классика, тёплое дерево",                           price: 430, hue: "#A97C4F" },
  { id: 10, name: "Апельсин и корица", note: "Праздничный, цитрусово-пряный",                     price: 400, hue: "#C4793A" },
  { id: 11, name: "Лаванда",           note: "Успокаивающий, для вечера",                         price: 380, hue: "#8B7CA6" },
  { id: 12, name: "Кожа и амбра",      note: "Плотный, «дорогой» характер",                       price: 470, hue: "#6B5240" },
  { id: 13, name: "Белый мускус",      note: "Чистый, почти невесомый",                           price: 390, hue: "#B7B0A0" },
  { id: 14, name: "Хвоя",              note: "Зимний лес, немного смолы",                         price: 410, hue: "#4F6B52" },
  { id: 15, name: "Инжирный лист",     note: "Зелёный, слегка молочный",                          price: 400, hue: "#6E8358" },
];

// ----- СОСТОЯНИЕ КОРЗИНЫ (хранится только в памяти страницы) -----
let cart = {}; // { productId: qty }

// ----- РЕНДЕР КАТАЛОГА -----
const grid = document.getElementById('productGrid');

function renderCatalog() {
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <div class="card-media">
        <div class="mini-candle">
          <div class="mini-jar"></div>
          <div class="mini-body" style="background:${p.hue}"></div>
          <div class="mini-flame"></div>
        </div>
      </div>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-note">${p.note}</p>
      <div class="card-foot">
        <span class="card-price">${p.price} ₴</span>
        <button class="card-add" data-id="${p.id}">В корзину</button>
      </div>
    </div>
  `).join('');
}
renderCatalog();

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-add');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  btn.textContent = 'Добавлено';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'В корзину';
    btn.classList.remove('added');
  }, 900);
});

// ----- КОРЗИНА -----
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSummaryEl = document.getElementById('cartSummary');
const cartTotalEl = document.getElementById('cartTotal');
const cartSuccessEl = document.getElementById('cartSuccess');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.classList.add('cart-locked');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.classList.remove('cart-locked');
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function renderCart() {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  const totalQty = ids.reduce((sum, id) => sum + cart[id], 0);
  cartCount.textContent = totalQty;

  if (ids.length === 0) {
    cartItemsEl.innerHTML = '';
    cartEmptyEl.style.display = 'block';
    cartSummaryEl.style.display = 'none';
    return;
  }

  cartEmptyEl.style.display = 'none';
  cartSummaryEl.style.display = 'block';

  let total = 0;
  cartItemsEl.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    const qty = cart[id];
    total += p.price * qty;
    return `
      <div class="cart-item">
        <div class="cart-item-dot" style="background:${p.hue}"></div>
        <div class="cart-item-info">
          <p class="cart-item-name">${p.name}</p>
          <p class="cart-item-price">${p.price} ₴ × ${qty}</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
          <span>${qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartTotalEl.textContent = total + ' ₴';
}

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.qty-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'inc') cart[id]++;
  if (btn.dataset.action === 'dec') {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  renderCart();
});

// ----- ОФОРМЛЕНИЕ ЗАЯВКИ -----
const checkoutForm = document.getElementById('checkoutForm');
const successDetails = document.getElementById('successDetails');
const cartResetBtn = document.getElementById('cartReset');

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const comment = document.getElementById('custComment').value.trim();

  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  const lines = ids.map(id => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    return `${p.name} × ${cart[id]}`;
  });
  const total = ids.reduce((sum, id) => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    return sum + p.price * cart[id];
  }, 0);

  // ЗАМЕНИТЕ на реальную отправку: fetch на ваш сервер, Telegram-бот,
  // сервис форм (Formspree/Getform) и т.п. Сейчас заявка просто
  // показывается на экране и формируется как mailto-ссылка.
  console.log('Новая заявка:', { name, phone, comment, items: lines, total });

  successDetails.innerHTML = `
    ${name}, ${phone}<br>
    ${lines.join('<br>')}<br>
    Итого: <strong>${total} ₴</strong>
    ${comment ? `<br><em>${comment}</em>` : ''}
  `;

  checkoutForm.style.display = 'none';
  cartSummaryEl.querySelector('.cart-total-row').style.display = 'none';
  cartItemsEl.style.display = 'none';
  cartSuccessEl.style.display = 'block';
});

cartResetBtn.addEventListener('click', () => {
  cart = {};
  renderCart();
  checkoutForm.reset();
  checkoutForm.style.display = 'flex';
  cartSummaryEl.querySelector('.cart-total-row').style.display = 'flex';
  cartItemsEl.style.display = 'block';
  cartSuccessEl.style.display = 'none';
  closeCart();
});

renderCart();

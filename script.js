// ---------- ТОВАРИ (демо-дані, замініть на свої) ----------
const PRODUCTS = [
  {
    id: 1, tier: "STARTER 10%", name: "STARTER · 500 мг · 10 мл",
    price: 890, perMg: 0.89, mgTotal: 500, mlTotal: 10,
    note: "0+1 по 490-паковці · починайте з 10 мг на добу", popular: false
  },
  {
    id: 2, tier: "BALANCED 20%", name: "NHL · 1000 мг · 10 мл",
    price: 1590, perMg: 0.80, mgTotal: 1000, mlTotal: 10,
    note: "0+2 по 495-паковці · найпопулярніший рівень", popular: true
  },
  {
    id: 3, tier: "INTENSIVE 30%", name: "NHL · 2000 мг · 10 мл",
    price: 2190, perMg: 0.73, mgTotal: 2000, mlTotal: 10,
    note: "4/2 · QT · максимальна ефективність вартості за мг", popular: false
  }
];

const TESTIMONIALS = [
  { name: "Марія, 38", role: "Київ", text: "Починала з 5 мг. Тепер на 15 мг зранку. Відчуваю різницю в ясності думки." },
  { name: "Олег, 44", role: "Сімейний лікар", text: "Супроводжую за допомогою пацієнтів. Зручний протокол і прозора лабораторія." },
  { name: "Ірина, 51", role: "Харків", text: "Місяць на BALANCED 20%. Менше тривоги ввечері. Нічого зайвого." },
  { name: "Денис, 29", role: "Бігун", text: "Потрібна прозорість складу. Тут все чесно — QR до кожної партії." }
];

const FAQ = [
  { q: "Що таке CBD і чим він відрізняється від THC?", a: "CBD (канабідіол) — це нонаркотична сполука з конопель. На відміну від THC, вона не викликає ейфорії. Наша олія містить THC нижче межі лабораторного виявлення." },
  { q: "Чи легальне CBD в Україні?", a: "Так, продукція з вмістом THC нижче встановлених меж дозволена до продажу. Кожна партія супроводжується лабораторним звітом (COA)." },
  { q: "Скільки часу потрібно для ефекту?", a: "Індивідуально: від 20–40 хвилин при прийомі під язик до кількох днів для накопичувального ефекту. Протокол 14 днів допомагає підібрати комфортну дозу." },
  { q: "Чи може CBD взаємодіяти з ліками?", a: "Так, можлива взаємодія, зокрема з препаратами, що метаболізуються печінкою. Проконсультуйтеся з лікарем, якщо приймаєте інші препарати." }
];

// ---------- РЕНДЕР КАТАЛОГУ ----------
const grid = document.getElementById('productGrid');
function renderProducts() {
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card ${p.popular ? 'popular' : ''}" data-tier="${p.tier}">
      ${p.popular ? '<span class="popular-badge">Популярний</span>' : ''}
      <p class="card-tier">${p.tier}</p>
      <h3 class="card-title">${p.name}</h3>
      <div class="card-media"><div class="mini-bottle"></div></div>
      <div class="card-price-row">
        <span class="price-main">${p.price} ₴</span>
        <span class="price-sub">${p.perMg.toFixed(2)} ₴/мг</span>
      </div>
      <div class="card-dose-row"><span>Доза</span><span>${p.mgTotal}/${p.mlTotal} · QT</span></div>
      <p class="card-note">${p.note}</p>
      <button class="btn btn-primary card-add" data-id="${p.id}">Додати в кошик</button>
    </div>
  `).join('');
}
renderProducts();

// ---------- ВІДГУКИ ----------
document.getElementById('testimonialGrid').innerHTML = TESTIMONIALS.map(t => `
  <div class="testimonial">
    <div class="avatar">${t.name.charAt(0)}</div>
    <div class="testimonial-body">
      <p class="t-name">${t.name}</p>
      <p class="t-role">${t.role}</p>
      <p class="t-text">${t.text}</p>
    </div>
  </div>
`).join('');

// ---------- FAQ ----------
const faqList = document.getElementById('faqList');
faqList.innerHTML = FAQ.map((f, i) => `
  <div class="faq-item" data-i="${i}">
    <button class="faq-q">${f.q} <span class="icon">+</span></button>
    <div class="faq-a"><p>${f.a}</p></div>
  </div>
`).join('');
faqList.addEventListener('click', (e) => {
  const q = e.target.closest('.faq-q');
  if (!q) return;
  const item = q.closest('.faq-item');
  const a = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  faqList.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-a').style.maxHeight = null;
  });
  if (!isOpen) {
    item.classList.add('open');
    a.style.maxHeight = a.scrollHeight + 'px';
  }
});

// ---------- КАЛЬКУЛЯТОР ДОЗУВАННЯ ----------
// Орієнтовна wellness-формула, НЕ медичне дозування.
const EXP_FACTOR = { new: 0.15, some: 0.30, regular: 0.50 }; // мг на кг ваги
const GOAL_FACTOR = { anxiety: 1.0, sleep: 1.1, pain: 1.15, general: 0.9 };

function calcDose(weight, age, goal, exp) {
  if (age < 18) {
    return { warning: "Продукція не рекомендована особам до 18 років. Зверніться до педіатра щодо альтернатив." };
  }
  let mg = weight * EXP_FACTOR[exp] * GOAL_FACTOR[goal];
  if (age >= 65) mg *= 0.7;
  mg = Math.max(5, Math.round(mg / 5) * 5);

  let tier, tierProduct;
  if (mg <= 15) { tier = "STARTER 10%"; tierProduct = PRODUCTS[0]; }
  else if (mg <= 40) { tier = "BALANCED 20%"; tierProduct = PRODUCTS[1]; }
  else { tier = "INTENSIVE 30%"; tierProduct = PRODUCTS[2]; }

  const mgPerMl = tierProduct.mgTotal / tierProduct.mlTotal;
  const mgPerDrop = mgPerMl / 20; // ~20 крапель на мл
  const drops = Math.max(1, Math.round(mg / mgPerDrop));

  return { mg, tier, tierProduct, drops };
}

document.getElementById('calcSubmit').addEventListener('click', () => {
  const weight = Number(document.getElementById('calcWeight').value) || 70;
  const age = Number(document.getElementById('calcAge').value) || 30;
  const goal = document.getElementById('calcGoal').value;
  const exp = document.getElementById('calcExp').value;

  const result = calcDose(weight, age, goal, exp);
  const resultEmpty = document.getElementById('resultEmpty');
  const resultBody = document.getElementById('resultBody');

  if (result.warning) {
    resultEmpty.style.display = 'block';
    resultEmpty.innerHTML = `<p>${result.warning}</p>`;
    resultBody.style.display = 'none';
    return;
  }

  resultEmpty.style.display = 'none';
  resultBody.style.display = 'flex';

  document.getElementById('resultMg').textContent = result.mg + ' мг/добу';
  document.getElementById('resultFormat').textContent = result.tier;

  document.getElementById('protocolSteps').innerHTML = `
    <div class="protocol-step">
      <span class="day">День 1-7</span>
      <p>Стартуйте з ${Math.round(result.mg * 0.6)} мг (≈${Math.max(1, Math.round(result.drops * 0.6))} кр.) вранці. Ведіть щоденник відчуттів.</p>
    </div>
    <div class="protocol-step">
      <span class="day">День 8</span>
      <p>За потреби збільште до ${result.mg} мг (≈${result.drops} кр.), розділивши на 2 прийоми.</p>
    </div>
    <div class="protocol-step">
      <span class="day">День 14</span>
      <p>Оцініть ефект і зафіксуйте комфортний рівень для подальшого щоденного застосування.</p>
    </div>
  `;
});

// ---------- КОШИК ----------
let cart = {};
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSummaryEl = document.getElementById('cartSummary');
const cartTotalEl = document.getElementById('cartTotal');
const cartSuccessEl = document.getElementById('cartSuccess');

function openCart(){ cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart(){ cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }
document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-add');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
});

function renderCart() {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  cartCount.textContent = ids.reduce((s, id) => s + cart[id], 0);
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
    total += p.price * cart[id];
    return `<div class="cart-item"><span>${p.name} × ${cart[id]}</span><span>${p.price * cart[id]} ₴</span></div>`;
  }).join('');
  cartTotalEl.textContent = total + ' ₴';
}

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  document.getElementById('successDetails').textContent = `${name}, ${phone} — ми зв'яжемось для підтвердження.`;
  document.getElementById('checkoutForm').style.display = 'none';
  cartItemsEl.style.display = 'none';
  cartSummaryEl.querySelector('.cart-total-row').style.display = 'none';
  cartSuccessEl.style.display = 'block';
});

document.getElementById('cartReset').addEventListener('click', () => {
  cart = {};
  renderCart();
  document.getElementById('checkoutForm').reset();
  document.getElementById('checkoutForm').style.display = 'flex';
  cartItemsEl.style.display = 'block';
  cartSummaryEl.querySelector('.cart-total-row').style.display = 'flex';
  cartSuccessEl.style.display = 'none';
  closeCart();
});

// ---------- ПІДПИСКА (демо, без реальної відправки) ----------
document.getElementById('subscribeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.querySelector('input').value = '';
  alert('Дякуємо! Це демо-форма — підключіть сервіс розсилок для реальної роботи.');
});

renderCart();

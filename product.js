const fa = new Intl.NumberFormat("fa-IR");
const CART_KEY = "fitland-checkout-items";

const PRODUCTS = [
  {
    id: "shoe-kdiy",
    title: "KDIY",
    crumb: "کفش نایک مدل KDIY",
    color: "مشکی",
    size: "۴۰",
    price: 2490000,
    off: 15,
    image: "./assests/Images/cart/03.png",
    images: [
      "./assests/Images/cart/03.png",
      "./assests/Images/cart/01.png",
      "./assests/Images/cart/02.png",
      "./assests/Images/cart/04.png",
    ],
    brand: "نایک",
    material: "چرم",
    group: "مردانه",
    kind: "کفش مردانه",
    swatches: [["مشکی", "#1a1a1a"], ["کرم", "#d7c4a3"], ["سفید", "#f7f7f7"], ["طوسی", "#b9b9b9"]],
    about: "کفش نایک مدل KDIY با رویه چرم ساخته شده و برای پیاده‌روی، باشگاه و استفاده روزمره آماده است. این کفش سبک است، هوا را از رویه عبور می‌دهد و فشار را روی کف پا پخش می‌کند. زیره از ترموپلاستیک پلی‌اورتان (TPU) ساخته شده، منعطف است، قابلیت آب‌بندی دارد و در برابر سایش مقاوم می‌ماند. کفی داخل کفش طبی است و می‌توان آن را تعویض کرد.",
  },
  { id: "shoe-white", title: "کفش سفید اسپرت", color: "سفید", size: "۴۲", price: 980000, image: "./assests/Images/cart/01.png", brand: "نایک", material: "پارچه و چرم مصنوعی", group: "مردانه", kind: "کفش مردانه", swatches: [["سفید", "#f4f4f4"], ["مشکی", "#1c1c1c"], ["کرم", "#d7c4a3"]] },
  { id: "shoe-leather", title: "کفش چرم سفید", color: "سفید", size: "۴۱", price: 1100000, image: "./assests/Images/cart/02.png", brand: "نایک", material: "چرم طبیعی", group: "مردانه", kind: "کفش مردانه", swatches: [["سفید", "#f7f7f7"], ["طوسی", "#b9b9b9"], ["مشکی", "#222"]] },
  { id: "shoe-dunk", title: "کفش نایک دانک", color: "سبزآبی", size: "۴۲", price: 1450000, image: "./assests/Images/cart/03.png", brand: "نایک", material: "چرم مصنوعی", group: "مردانه", kind: "کفش مردانه", swatches: [["سبزآبی", "#1f7a72"], ["سفید", "#f3f3f3"], ["مشکی", "#1a1a1a"]] },
  { id: "shoe-reebok", title: "کفش ریباک سرمه‌ای", color: "سرمه‌ای", size: "۴۲", price: 1250000, image: "./assests/Images/cart/04.png", brand: "ریباک", material: "پارچه", group: "مردانه", kind: "کفش مردانه", swatches: [["سرمه‌ای", "#1c2c4c"], ["سبز", "#b6d23a"], ["سفید", "#f5f5f5"]] },
  { id: "shoe-slip", title: "کفش اسلیپ‌آن سرمه‌ای", color: "سرمه‌ای", size: "۴۰", price: 890000, image: "./assests/Images/cart/05.png", brand: "فیتلند", material: "پارچه", group: "مردانه", kind: "کفش مردانه", swatches: [["سرمه‌ای", "#243456"], ["سفید", "#f4f4f4"], ["قهوه‌ای", "#8a5a32"]] },
  { id: "shoe-knit", title: "کفش بافتی طوسی", color: "طوسی", size: "۴۱", price: 750000, image: "./assests/Images/cart/06.png", brand: "فیتلند", material: "بافت کشباف", group: "مردانه", kind: "کفش مردانه", swatches: [["طوسی", "#9a9a9a"], ["مشکی", "#222"], ["سفید", "#f3f3f3"]] },
  { id: "shoe-kids", title: "کفش بچگانه سرمه‌ای", color: "سرمه‌ای", size: "۳۲", price: 690000, image: "./assests/Images/cart/07.png", brand: "ریباک", material: "پارچه", group: "بچگانه", kind: "کفش بچگانه", swatches: [["سرمه‌ای", "#1b2a4a"], ["زرد", "#e2b000"], ["قرمز", "#c4392f"]] },
  { id: "shoe-blue", title: "کفش پنج‌انگشتی آبی", color: "آبی", size: "۴۲", price: 820000, image: "./assests/Images/cart/08.png", brand: "فیتلند", material: "لاستیک نرم", group: "مردانه", kind: "کفش مردانه", swatches: [["آبی", "#2f6fbe"], ["مشکی", "#222"], ["طوسی", "#c8c8c8"]] },
  { id: "shoe-gray", title: "کفش پنج‌انگشتی طوسی", color: "طوسی", size: "۴۲", price: 820000, image: "./assests/Images/cart/09.png", brand: "فیتلند", material: "لاستیک نرم", group: "مردانه", kind: "کفش مردانه", swatches: [["طوسی", "#8e8e8e"], ["مشکی", "#1c1c1c"], ["آبی", "#6ea0d4"]] },
  { id: "shoe-aqua", title: "کفش پنج‌انگشتی مشکی", color: "مشکی", size: "۴۱", price: 860000, image: "./assests/Images/cart/10.png", brand: "فیتلند", material: "لاستیک نرم", group: "مردانه", kind: "کفش مردانه", swatches: [["مشکی", "#1a1a1a"], ["آبی", "#2f6fd0"], ["طوسی", "#d0d0d0"]] },
  { id: "shoe-sole", title: "کفش پنج‌انگشتی طرح‌دار", color: "مشکی", size: "۴۲", price: 790000, image: "./assests/Images/cart/11.png", brand: "فیتلند", material: "لاستیک", group: "مردانه", kind: "کفش مردانه", swatches: [["مشکی", "#222"], ["سفید", "#f2f2f2"], ["آبی", "#3d7ad4"]] },
];

const SIZES = ["۳۶", "۳۷", "۳۸", "۳۹", "۴۰", "۴۱", "۴۲", "۴۳", "۴۴", "۴۵"];
const RELATED = [
  { id: "shoe-reebok", title: "کفش نایک مدل S-2000", price: 2490000, image: "./assests/Images/cart/04.png", stars: 4, swatches: [["سرمه‌ای", "#1c2c4c"], ["سبز", "#b6d23a"]] },
  { id: "shoe-white", title: "کفش نایک مدل S-2000", price: 2000000, image: "./assests/Images/cart/01.png", stars: 4, swatches: [["سفید", "#f4f4f4"], ["مشکی", "#1c1c1c"]] },
  { id: "shoe-leather", title: "کفش نایک مدل S-2000", price: 2490000, image: "./assests/Images/cart/02.png", stars: 5, swatches: [["سفید", "#f7f7f7"], ["طوسی", "#b9b9b9"]] },
  { id: "shoe-dunk", title: "کفش نایک مدل S-2000", price: 2490000, image: "./assests/Images/cart/03.png", stars: 4, swatches: [["سبزآبی", "#1f7a72"], ["سفید", "#f3f3f3"]] },
];
const REVIEWS = [
  { name: "سینا", stars: 4, text: "کفش سبکیه و برای پیاده‌روی روزانه راحته. رویه هم هوا رو خوب رد می‌کنه." },
  { name: "مهسا", stars: 5, text: "خیلی راحت روی پام نشست. سایزش دقیق بود و برای باشگاه هم استفاده می‌کنم." },
  { name: "زهرا", stars: 4, text: "زیره نرمه و فشار رو از کف پا برمی‌داره. برای استفاده هرروز پیشنهادش می‌کنم." },
];

const params = new URLSearchParams(location.search);
const product = PRODUCTS.find((item) => item.id === params.get("id")) || PRODUCTS[0];
let chosenSize = product.size;
let chosenColor = product.color;
let qty = 1;
let score = 4;

function money(value) {
  return `${fa.format(value)} تومان`;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function stars(count) {
  return Array.from({ length: 5 }, (_, index) =>
    `<i class="bi ${index < count ? "bi-star-fill" : "bi-star"}" aria-hidden="true"></i>`
  ).join("");
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch {
    /* start a fresh basket */
  }
  return [];
}

function paintCount() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = readCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  badge.textContent = fa.format(count);
}

function galleryOf(item) {
  if (item.images) return item.images;
  const pool = PRODUCTS.map((entry) => entry.image);
  const start = Math.max(0, pool.indexOf(item.image));
  return Array.from({ length: 4 }, (_, index) => pool[(start + index) % pool.length]);
}

function renderHero() {
  document.title = `فیتلند | ${product.crumb || product.title}`;
  document.getElementById("pdp-crumb").innerHTML = `
    <a href="./home.html">${product.group}</a>
    <i class="bi bi-chevron-left" aria-hidden="true"></i>
    <a href="./home.html#sport-shoes">${product.kind}</a>
    <i class="bi bi-chevron-left" aria-hidden="true"></i>
    <strong>${product.crumb || product.title}</strong>`;
  document.getElementById("pdp-title").textContent = product.title;
  document.getElementById("pdp-price").textContent = money(product.price);
  const off = document.querySelector(".pdp-off");
  off.hidden = !product.off;
  if (product.off) off.textContent = `${fa.format(product.off)}٪`;
  const photo = document.getElementById("pdp-photo");
  const gallery = galleryOf(product);
  photo.src = gallery[0];
  photo.alt = product.title;

  const sizes = product.size === "۳۲" ? ["۳۲", ...SIZES] : SIZES;
  document.getElementById("pdp-sizes").innerHTML = sizes
    .map((size) => `<button type="button" data-size="${size}" class="${size === chosenSize ? "is-selected" : ""}">${size}</button>`)
    .join("");

  document.getElementById("pdp-colors").innerHTML = product.swatches
    .map(([name, hex]) => `
      <button type="button" data-color="${name}" class="${name === chosenColor ? "is-selected" : ""}" style="--swatch:${hex}" aria-label="${name}"></button>`)
    .join("");

  document.getElementById("pdp-thumbs").innerHTML = gallery
    .map((src, index) => `
    <button type="button" class="${index === 0 ? "is-selected" : ""}" aria-label="تصویر ${fa.format(index + 1)}">
      <img src="${src}" alt="" />
    </button>`).join("");

  document.getElementById("pdp-specs").innerHTML = `
    <tr><th>جنس</th><td>${product.material}</td></tr>
    <tr><th>برند محصول</th><td>${product.brand}</td></tr>
    <tr><th>جنس زیره</th><td>ترموپلاستیک پلی اورتان (TPU)</td></tr>
    <tr><th>ویژگی های زیره</th><td><ul><li>انعطاف پذیر</li><li>قابلیت آب بندی</li><li>کاهش فشار پا</li><li>مقاوم در برابر سایش</li></ul></td></tr>
    <tr><th>ویژگی های کفی</th><td>طبی، قابل تعویض</td></tr>`;

  document.getElementById("pdp-about").textContent = product.about ||
    `${product.title} برای پیاده‌روی، باشگاه و استفاده هرروز آماده شده است. رویه ${product.material} هوا را عبور می‌دهد و فشار را روی کف پا پخش می‌کند. زیره از ترموپلاستیک پلی‌اورتان ساخته شده، منعطف است و در برابر سایش مقاوم می‌ماند. کفی داخل کفش طبی است و می‌شود آن را عوض کرد.`;

  document.getElementById("pdp-reviews").innerHTML = REVIEWS
    .map((review) => reviewCard(review))
    .join("");

  const related = product.id === "shoe-kdiy" ? RELATED : (() => {
    const list = [];
    const start = PRODUCTS.findIndex((item) => item.id === product.id);
    for (let step = 1; list.length < 4; step += 1) list.push(PRODUCTS[(start + step) % PRODUCTS.length]);
    return list;
  })();
  document.getElementById("pdp-related").innerHTML = related
    .map((item, index) => {
      const rating = item.stars || (index % 2 ? 4 : 5);
      return `
      <article class="rel-card">
        <a href="./product.html?id=${encodeURIComponent(item.id)}">
          <img src="${item.image}" alt="${item.title}" />
          <div class="rel-stars" aria-label="${fa.format(rating)} از ۵">${stars(rating)}</div>
          <h3>${item.title}</h3>
          <strong>${money(item.price)}</strong>
          <span class="rel-dots" aria-hidden="true"><i style="--swatch:${item.swatches[0][1]}"></i><i style="--swatch:${item.swatches[1][1]}"></i></span>
        </a>
      </article>`;
    })
    .join("");
}

function reviewCard(review) {
  return `
    <article class="pdp-review">
      <span class="pdp-avatar" aria-hidden="true"><i class="bi bi-person"></i></span>
      <div>
        <div class="pdp-review__top">
          <strong>${esc(review.name)}</strong>
          <span class="pdp-stars">${stars(review.stars)}</span>
        </div>
        <p>${esc(review.text)}</p>
      </div>
    </article>`;
}

function paintQty() {
  document.getElementById("pdp-qty").textContent = String(qty);
}

function addToCart() {
  const items = readCart();
  const found = items.find((item) => item.id === product.id);
  if (found) {
    found.qty = (Number(found.qty) || 1) + qty;
    found.size = chosenSize;
    found.color = chosenColor;
  } else {
    items.push({
      id: product.id,
      title: product.title,
      color: chosenColor,
      size: chosenSize,
      price: product.price,
      qty,
      image: product.image,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  paintCount();
  const status = document.getElementById("pdp-status");
  status.textContent = "به سبد خرید اضافه شد";
}

renderHero();
paintQty();
paintCount();

document.getElementById("pdp-sizes").addEventListener("click", (event) => {
  const button = event.target.closest("[data-size]");
  if (!button) return;
  chosenSize = button.dataset.size;
  document.querySelectorAll("[data-size]").forEach((item) => item.classList.toggle("is-selected", item === button));
});

document.getElementById("pdp-colors").addEventListener("click", (event) => {
  const button = event.target.closest("[data-color]");
  if (!button) return;
  chosenColor = button.dataset.color;
  document.querySelectorAll("[data-color]").forEach((item) => item.classList.toggle("is-selected", item === button));
});

document.getElementById("pdp-thumbs").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  document.querySelectorAll("#pdp-thumbs button").forEach((item) => item.classList.toggle("is-selected", item === button));
  const thumb = button.querySelector("img");
  if (!thumb) return;
  const photo = document.getElementById("pdp-photo");
  photo.src = thumb.getAttribute("src");
});

document.querySelector(".pdp-buy").addEventListener("click", (event) => {
  const action = event.target.closest("[data-qty]");
  if (!action) return;
  qty = Math.max(1, qty + (action.dataset.qty === "plus" ? 1 : -1));
  paintQty();
});

document.getElementById("pdp-add").addEventListener("click", addToCart);

document.getElementById("pdp-fav").addEventListener("click", () => {
  const button = document.getElementById("pdp-fav");
  const on = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", on ? "true" : "false");
  button.classList.toggle("is-on", on);
  button.querySelector("i").className = on ? "bi bi-heart-fill" : "bi bi-heart";
});

document.getElementById("pdp-share").addEventListener("click", async () => {
  const status = document.getElementById("pdp-status");
  try {
    await navigator.clipboard.writeText(location.href);
    status.textContent = "لینک محصول کپی شد";
  } catch {
    status.textContent = location.href;
  }
});

document.querySelector(".pdp-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (!tab) return;
  document.querySelectorAll("[data-tab]").forEach((item) => {
    const on = item === tab;
    item.classList.toggle("is-active", on);
    item.setAttribute("aria-selected", on ? "true" : "false");
  });
  const target = document.getElementById(tab.dataset.tab === "about" ? "pdp-about" : `pdp-block-${tab.dataset.tab}`);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("pdp-score").innerHTML = Array.from({ length: 5 }, (_, index) =>
  `<button type="button" data-score="${index + 1}" aria-label="${fa.format(index + 1)} ستاره"><i class="bi ${index < score ? "bi-star-fill" : "bi-star"}" aria-hidden="true"></i></button>`
).join("");

function paintScore() {
  document.querySelectorAll("[data-score] i").forEach((icon, index) => {
    icon.className = index < score ? "bi bi-star-fill" : "bi bi-star";
  });
}

document.getElementById("pdp-score").addEventListener("click", (event) => {
  const button = event.target.closest("[data-score]");
  if (!button) return;
  score = Number(button.dataset.score);
  paintScore();
});

document.getElementById("pdp-review-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("review-name").value.trim() || "کاربر فیتلند";
  const text = document.getElementById("review-text").value.trim();
  if (!text) return;
  document.getElementById("pdp-reviews").insertAdjacentHTML("afterbegin", reviewCard({ name, stars: score, text }));
  event.target.reset();
  document.querySelector('[data-tab="reviews"]').click();
});

document.getElementById("search-form").addEventListener("submit", (event) => event.preventDefault());
const newsletter = document.getElementById("newsletter");
if (newsletter) newsletter.addEventListener("submit", (event) => event.preventDefault());

const mobileQuery = window.matchMedia("(max-width: 767.98px)");

function syncFooter() {
  document.querySelectorAll(".footer-group").forEach((group) => {
    const button = group.querySelector(".footer-toggle");
    const expanded = !mobileQuery.matches || group.classList.contains("is-open");
    button.setAttribute("aria-expanded", String(expanded));
    button.disabled = !mobileQuery.matches;
  });
}

document.querySelectorAll(".footer-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (!mobileQuery.matches) return;
    button.closest(".footer-group").classList.toggle("is-open");
    syncFooter();
  });
});

mobileQuery.addEventListener("change", syncFooter);
syncFooter();

const aboutButton = document.querySelector(".about-more");
if (aboutButton) {
  aboutButton.addEventListener("click", () => {
    const about = document.querySelector(".footer-about");
    const expanded = about.classList.toggle("is-expanded");
    aboutButton.setAttribute("aria-expanded", String(expanded));
    aboutButton.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر...";
  });
}

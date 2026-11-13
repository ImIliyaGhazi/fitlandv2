"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const fa = new Intl.NumberFormat("fa-IR");
const money = (value) => `${fa.format(value)} تومان`;

const desktopScreenshot =
  "https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6ab445abaa6afae3dab77fc1/6ab4463cc527e0924d385c7b/3c70136c-Desktop_-_78.png";

const mobileScreenshot =
  "https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6ab445abaa6afae3dab77fc1/6ab4463cc527e0924d385c7b/89b3a53a-Frame_1430104209.png";

/*
  این دادهها نمایشی هستند.
  مختصات x و y ناحیه عکس محصول در تصویر دسکتاپ است.
  مختصات mx و my ناحیه عکس محصول در تصویر موبایل است.
  در نسخه واقعی میتوانید برای هر محصول imageUrl تعریف کنید.
*/

const colors = [
  { id: "pink", name: "صورتی", hex: "#ff2183" },
  { id: "orange", name: "نارنجی", hex: "#ff5124" },
  { id: "purple", name: "بنفش", hex: "#483aff" },
  { id: "red", name: "قرمز", hex: "#ff3e48" },
  { id: "yellow", name: "زرد", hex: "#fff135" },
  { id: "green", name: "سبز", hex: "#38ca87" },
  { id: "navy", name: "سرمهای", hex: "#042744" },
  { id: "black", name: "مشکی", hex: "#030a0e" },
  { id: "gray", name: "خاکستری", hex: "#c5c8c9" },
];

const brands = ["nike", "Under Armour", "The North Face", "adidas", "Fila"];
const sizes = ["S", "M", "L", "XL", "XXL"];

/*
  id, code, price, oldPrice, rating, brand, colors,
  x, y, mobileY, موجودی
*/
const rows = [
  [
    1,
    1737,
    200000,
    250000,
    3,
    "nike",
    ["navy", "green", "black"],
    732,
    365,
    205,
    true,
  ],

  [
    2,
    1727,
    190000,
    0,
    2,
    "Under Armour",
    ["pink", "gray", "black"],
    420,
    365,
    355,
    true,
  ],

  [
    3,
    1717,
    200000,
    250000,
    4,
    "The North Face",
    ["navy", "red", "black"],
    108,
    365,
    505,
    true,
  ],

  [
    4,
    1757,
    240000,
    300000,
    2,
    "adidas",
    ["pink", "red", "gray"],
    732,
    819,
    655,
    true,
  ],

  [
    5,
    1767,
    190000,
    0,
    4,
    "Fila",
    ["pink", "gray", "black"],
    420,
    819,
    805,
    true,
  ],

  [
    6,
    1747,
    240000,
    300000,
    2,
    "nike",
    ["green", "yellow", "gray"],
    108,
    819,
    955,
    true,
  ],

  [
    7,
    1797,
    320000,
    400000,
    3,
    "Under Armour",
    ["navy", "gray", "pink"],
    732,
    1273,
    1105,
    true,
  ],

  [
    8,
    1778,
    160000,
    200000,
    2,
    "adidas",
    ["red", "green", "black"],
    420,
    1273,
    1255,
    true,
  ],

  [
    9,
    1777,
    150000,
    0,
    4,
    "Fila",
    ["purple", "gray", "navy"],
    108,
    1273,
    1405,
    true,
  ],

  [
    1,
    1737,
    200000,
    250000,
    3,
    "nike",
    ["navy", "green", "black"],
    732,
    365,
    205,
    true,
  ],

  [
    11,
    1817,
    210000,
    0,
    4,
    "The North Face",
    ["green", "gray", "purple"],
    420,
    1727,
    355,
    true,
  ],

  [
    12,
    1807,
    240000,
    300000,
    3,
    "adidas",
    ["green", "orange", "gray"],
    108,
    1727,
    1405,
    false,
  ],
];

const products = rows.map((row, index) => ({
  id: row[0],
  code: row[1],
  name: `تیشرت زنانه کد ${fa.format(row[1]).replaceAll("٬", "")}`,
  price: row[2],
  oldPrice: row[3],
  rating: row[4],
  brand: row[5],
  colors: row[6],
  x: row[7],
  y: row[8],
  mx: 233,
  my: row[9],
  stock: row[10],
  category: "زنانه",
  sizes: index % 3 === 0 ? ["M", "L", "XL"] : ["S", "M", "L", "XL", "XXL"],
  views: 1000 - index * 35,
  sales: (index * 37 + 82) % 230,
  added: index,
  imageUrl: `./assests/Images/women/${index + 1}.png`,
}));

const state = {
  query: "",
  category: "",
  stock: false,
  discount: false,
  min: 0,
  max: 500000,
  colors: new Set(),
  sizes: new Set(),
  brands: new Set(),
  sort: "views",
  page: 1,
};

const mobileQuery = matchMedia("(max-width: 991.98px)");
const pageSize = () => (mobileQuery.matches ? 9 : 12);

let cart = readCart();
let currentProduct = null;
let selectedSize = "";
let selectedColor = "";

const productModal = new bootstrap.Modal($("#productModal"));
const infoModal = new bootstrap.Modal($("#infoModal"));
const toast = new bootstrap.Toast($("#appToast"), { delay: 3200 });

function showCartPop(product, colorId) {
  const color = getColor(colorId);
  $("#cartPopTitle").textContent = product.name;
  $("#cartPopColor").textContent = color.name;
  $("#cartPopSwatch").style.background = color.hex;
  $("#cartPopPhoto").innerHTML = imageMarkup(product);
  $("#cartPop").hidden = false;
}

function hideCartPop() {
  $("#cartPop").hidden = true;
}

$("#cartPopClose").addEventListener("click", hideCartPop);
$("#cartPop").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) hideCartPop();
});
$("#cartPopGo").addEventListener("click", () => {
  hideCartPop();
  bootstrap.Offcanvas.getOrCreateInstance($("#cartPanel")).show();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideCartPop();
});

function notify(message) {
  $("#toastText").textContent = message;
  toast.show();
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function numberFromInput(value) {
  const normalized = String(value)
    .replace(/[۰-۹]/g, (n) => "۰۱۲۳۴۵۶۷۸۹".indexOf(n))
    .replace(/[٠-٩]/g, (n) => "٠١٢٣٤٥٦٧٨٩".indexOf(n))
    .replace(/[,\s٬]/g, "");

  if (!/^\d+$/.test(normalized)) return NaN;
  return Number(normalized);
}

function getColor(id) {
  return colors.find((color) => color.id === id);
}

function imageMarkup(product) {
  if (product.imageUrl) {
    return `
      <img
        src="${escapeHTML(product.imageUrl)}"
        alt="${escapeHTML(product.name)}"
        class="real-product-image"
        loading="lazy"
      >
    `;
  }

  return `
    <span class="sprite-photo"
      style="--x:${product.x};--y:${product.y};
             --mx:${product.mx};--my:${product.my}">
      <img class="desktop-sprite"
           src="${desktopScreenshot}"
           alt="${escapeHTML(product.name)}"
           decoding="async">
      <img class="mobile-sprite"
           src="${mobileScreenshot}"
           alt="${escapeHTML(product.name)}"
           decoding="async">
    </span>
  `;
}

function discountPercentage(product) {
  if (!product.oldPrice) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function starsMarkup(rating) {
  return `
    <span class="stars" role="img"
          aria-label="${fa.format(rating)} از ۵ ستاره">
      ${Array.from(
        { length: 5 },
        (_, index) => `
        <i class="bi bi-star-fill ${index < rating ? "filled" : ""}"
           aria-hidden="true"></i>
      `,
      ).join("")}
    </span>
  `;
}

function productMarkup(product) {
  const discount = discountPercentage(product);

  return `
    <article class="product-card">
      <div class="product-media">
        <button class="product-open" type="button"
                data-open="${product.id}"
                aria-label="جزئیات ${escapeHTML(product.name)}">
          ${imageMarkup(product)}
        </button>

${
  discount
    ? `
          <span class="discount-badge">${fa.format(discount)}٪</span>
        `
    : ""
}

<div class="quick-sizes" aria-label="انتخاب سریع سایز">
          ${product.sizes
            .map(
              (size) => `
            <button type="button"
                    class="size-tag"
                    data-open="${product.id}"
                    data-size="${size}"
                    aria-label="انتخاب سایز ${size}">
              ${size}
            </button>
          `,
            )
            .join("")}
        </div>
      </div>

<div class="product-content">
        <div class="product-top">
          <h2 class="product-title">
            <button type="button" data-open="${product.id}">
              ${escapeHTML(product.name)}
            </button>
          </h2>
          ${starsMarkup(product.rating)}
        </div>

<p class="product-size">
          از سایز <bdi>${product.sizes[0]}</bdi>
          تا <bdi>${product.sizes.at(-1)}</bdi>
        </p>

<div class="product-prices">
          <span>${money(product.price)}</span>
          ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}
        </div>

<div class="product-swatches">
          ${product.colors
            .map((id) => {
              const color = getColor(id);
              return `
              <button type="button"
                      data-open="${product.id}"
                      data-color="${id}"
                      style="--swatch:${color.hex}"
                      aria-label="انتخاب رنگ ${color.name}"
                      title="${color.name}">
              </button>
            `;
            })
            .join("")}
        </div>

${!product.stock ? '<div class="out-of-stock">ناموجود</div>' : ""}
      </div>
    </article>
  `;
}

function filteredProducts() {
  const query = state.query.trim().toLowerCase();

  const result = products.filter((product) => {
    const searchable =
      `${product.name} ${product.code} ${product.brand}`.toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!state.category || product.category === state.category) &&
      (!state.stock || product.stock) &&
      (!state.discount || product.oldPrice > product.price) &&
      product.price >= state.min &&
      product.price <= state.max &&
      (!state.colors.size ||
        product.colors.some((color) => state.colors.has(color))) &&
      (!state.sizes.size ||
        product.sizes.some((size) => state.sizes.has(size))) &&
      (!state.brands.size || state.brands.has(product.brand))
    );
  });

  const comparators = {
    views: (a, b) => b.views - a.views,
    newest: (a, b) => b.added - a.added,
    sales: (a, b) => b.sales - a.sales,
    expensive: (a, b) => b.price - a.price,
    cheap: (a, b) => a.price - b.price,
  };

  return result.sort(comparators[state.sort]);
}

function renderProducts() {
  const result = filteredProducts();
  const pages = Math.ceil(result.length / pageSize());

  state.page = Math.max(1, Math.min(state.page, pages || 1));

  const start = (state.page - 1) * pageSize();
  const visible = result.slice(start, start + pageSize());

  $("#productGrid").innerHTML = visible.map(productMarkup).join("");
  $("#emptyState").hidden = result.length !== 0;
  $("#resultCount").textContent = `${fa.format(result.length)} کالا`;

  $$("[data-sort]").forEach((button) => {
    const active = button.dataset.sort === state.sort;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderPagination(pages);
  renderActiveFilters();
}

function renderPagination(pages) {
  if (pages <= 1) {
    $("#pagination").innerHTML = "";
    return;
  }

  $("#pagination").innerHTML = `
    <button type="button" data-page="${state.page - 1}"
            ${state.page === 1 ? "disabled" : ""}
            aria-label="صفحه قبل">
      <i class="bi bi-chevron-right"></i>
    </button>

${Array.from({ length: pages }, (_, index) => {
  const page = index + 1;
  return `
        <button type="button"
                data-page="${page}"
                class="${page === state.page ? "active" : ""}"
                ${page === state.page ? 'aria-current="page"' : ""}
                aria-label="صفحه ${fa.format(page)}">
          ${fa.format(page)}
        </button>
      `;
}).join("")}

<button type="button" data-page="${state.page + 1}"
            ${state.page === pages ? "disabled" : ""}
            aria-label="صفحه بعد">
      <i class="bi bi-chevron-left"></i>
    </button>
  `;
}

function renderActiveFilters() {
  const chips = [];

  if (state.category) chips.push(["category", "", state.category]);
  if (state.stock) chips.push(["stock", "", "فقط موجود"]);
  if (state.discount) chips.push(["discount", "", "تخفیفدار"]);

  if (state.min > 0 || state.max < 500000) {
    chips.push(["price", "", `${money(state.min)} تا ${money(state.max)}`]);
  }

  state.colors.forEach((id) => chips.push(["colors", id, getColor(id).name]));
  state.sizes.forEach((size) => chips.push(["sizes", size, size]));
  state.brands.forEach((brand) => chips.push(["brands", brand, brand]));

  $("#activeFilters").innerHTML = chips
    .map(
      ([type, value, label]) => `
    <button type="button"
            data-remove-filter="${type}"
            data-value="${escapeHTML(value)}"
            aria-label="حذف فیلتر ${escapeHTML(label)}">
      ${escapeHTML(label)} ×
    </button>
  `,
    )
    .join("");

  $("#filterCount").hidden = chips.length === 0;
  $("#filterCount").textContent = fa.format(chips.length);
}

function renderFilterOptions() {
  $("#colorFilters").innerHTML = colors
    .slice(0, 7)
    .map(
      (color) => `
    <button type="button"
            class="color-option ${state.colors.has(color.id) ? "selected" : ""}"
            style="--swatch:${color.hex}"
            data-filter-type="colors"
            data-value="${color.id}"
            aria-label="${color.name}"
            aria-pressed="${state.colors.has(color.id)}"
            title="${color.name}">
    </button>
  `,
    )
    .join("");

  $("#sizeFilters").innerHTML = sizes
    .map(
      (size) => `
    <button type="button"
            class="choice-button ${state.sizes.has(size) ? "selected" : ""}"
            data-filter-type="sizes"
            data-value="${size}"
            aria-pressed="${state.sizes.has(size)}">
      ${size}
    </button>
  `,
    )
    .join("");

  renderBrandOptions();
}

function renderBrandOptions() {
  const query = $("#brandSearch").value.trim().toLowerCase();

  $("#brandFilters").innerHTML = brands
    .filter((brand) => brand.toLowerCase().includes(query))
    .map(
      (brand) => `
      <button type="button"
              class="choice-button ${state.brands.has(brand) ? "selected" : ""}"
              data-filter-type="brands"
              data-value="${escapeHTML(brand)}"
              aria-pressed="${state.brands.has(brand)}">
        ${escapeHTML(brand)}
      </button>
    `,
    )
    .join("");
}

function updateRangeTrack() {
  const minPercent = (state.min / 500000) * 100;
  const maxPercent = (state.max / 500000) * 100;

  $("#rangeTrack").style.background = `
    linear-gradient(to right,
      #ccc 0%, #ccc ${minPercent}%,
      #062745 ${minPercent}%, #062745 ${maxPercent}%,
      #ccc ${maxPercent}%, #ccc 100%)
  `;
}

function syncFilterInputs() {
  $("#stockFilter").checked = state.stock;
  $("#discountFilter").checked = state.discount;

  $("#minRange").value = state.min;
  $("#maxRange").value = state.max;

  $("#minPrice").value = state.min ? fa.format(state.min) : "";
  $("#maxPrice").value = state.max < 500000 ? fa.format(state.max) : "";

  updateRangeTrack();
  renderFilterOptions();
}

function changed() {
  state.page = 1;
  renderProducts();
}

function resetFilters(clearQuery = false) {
  state.category = "";
  state.stock = false;
  state.discount = false;
  state.min = 0;
  state.max = 500000;
  state.colors.clear();
  state.sizes.clear();
  state.brands.clear();

  $("#brandSearch").value = "";

  if (clearQuery) {
    state.query = "";
    $("#productSearch").value = "";
  }

  syncFilterInputs();
  changed();
}

function setSort(sort) {
  state.sort = sort;
  changed();

  bootstrap.Offcanvas.getInstance($("#sortPanel"))?.hide();
}

function openProduct(id, preferredSize = "", preferredColor = "") {
  currentProduct = products.find((product) => product.id === Number(id));
  if (!currentProduct) return;

  selectedSize = currentProduct.sizes.includes(preferredSize)
    ? preferredSize
    : currentProduct.sizes[0];

  selectedColor = currentProduct.colors.includes(preferredColor)
    ? preferredColor
    : currentProduct.colors[0];

  $("#productModalTitle").textContent = currentProduct.name;
  $("#modalPhoto").innerHTML = imageMarkup(currentProduct);
  $("#modalPrice").textContent = money(currentProduct.price);
  $("#modalBrand").textContent = `برند: ${currentProduct.brand}`;
  $("#modalQuantity").value = 1;

  $("#addToCart").disabled = !currentProduct.stock;
  $("#addToCart").textContent = currentProduct.stock
    ? "افزودن به سبد خرید"
    : "این محصول موجود نیست";

  renderModalChoices();
  productModal.show();
}

function renderModalChoices() {
  $("#modalSizes").innerHTML = currentProduct.sizes
    .map(
      (size) => `
    <button type="button"
            class="size-tag ${size === selectedSize ? "selected" : ""}"
            data-modal-size="${size}"
            aria-pressed="${size === selectedSize}">
      ${size}
    </button>
  `,
    )
    .join("");

  $("#modalColors").innerHTML = currentProduct.colors
    .map((id) => {
      const color = getColor(id);

      return `
      <button type="button"
              class="color-option ${id === selectedColor ? "selected" : ""}"
              style="--swatch:${color.hex}"
              data-modal-color="${id}"
              aria-label="${color.name}"
              aria-pressed="${id === selectedColor}">
      </button>
    `;
    })
    .join("");
}

/* Local cart */

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("fitland-cart-v1") || "[]");
    if (!Array.isArray(saved)) return [];

    return saved
      .filter((item) => {
        const product = products.find((product) => product.id === item.id);

        return (
          product &&
          product.stock &&
          product.sizes.includes(item.size) &&
          product.colors.includes(item.color) &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1 &&
          item.quantity <= 10
        );
      })
      .map((item) => ({
        id: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("fitland-cart-v1", JSON.stringify(cart));
    localStorage.setItem(
      "fitland-checkout-items",
      JSON.stringify(cart.map(toCheckoutItem).filter(Boolean)),
    );
  } catch {
    notify("ذخیرهسازی مرورگر در دسترس نیست؛ سبد فقط در این نشست حفظ میشود.");
  }

  renderCart();
}

function toCheckoutItem(item) {
  const product = products.find((entry) => entry.id === item.id);
  if (!product) return null;
  const color = getColor(item.color);

  return {
    id: item.id,
    title: product.name,
    color: color?.name || item.color,
    colorId: item.color,
    size: item.size,
    price: product.price,
    qty: item.quantity,
    image: product.imageUrl,
  };
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  $("#cartCount").textContent = fa.format(count);
  $("#cartCount").classList.toggle("is-empty", count === 0);

  if (!cart.length) {
    $("#cartItems").innerHTML = `
      <p class="text-secondary text-center py-5">سبد خرید شما خالی است.</p>
    `;
  } else {
    $("#cartItems").innerHTML = cart
      .map((item, index) => {
        const product = products.find((product) => product.id === item.id);
        const color = getColor(item.color);

        return `
        <article class="cart-row">
          <h3>${escapeHTML(product.name)}</h3>
          <p>سایز ${item.size} · رنگ ${color.name}</p>
          <p>${money(product.price * item.quantity)}</p>

<div class="cart-row-controls">
            <button type="button" data-cart-action="plus"
                    data-index="${index}"
                    ${item.quantity >= 10 ? "disabled" : ""}
                    aria-label="افزایش تعداد">+</button>

<span>${fa.format(item.quantity)}</span>

<button type="button" data-cart-action="minus"
                    data-index="${index}"
                    ${item.quantity <= 1 ? "disabled" : ""}
                    aria-label="کاهش تعداد">−</button>

<button type="button" class="remove-cart"
                    data-cart-action="remove" data-index="${index}"
                    aria-label="حذف محصول">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </article>
      `;
      })
      .join("");
  }

  const total = cart.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  $("#cartTotal").textContent = money(total);
}

$("#addToCart").addEventListener("click", () => {
  if (!currentProduct?.stock) return;

  const quantity = Number($("#modalQuantity").value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    notify("تعداد باید یک عدد صحیح بین ۱ تا ۱۰ باشد.");
    return;
  }

  const existing = cart.find(
    (item) =>
      item.id === currentProduct.id &&
      item.size === selectedSize &&
      item.color === selectedColor,
  );

  if (existing && existing.quantity + quantity > 10) {
    notify("حداکثر تعداد مجاز از هر ترکیب سایز و رنگ، ۱۰ عدد است.");
    return;
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: currentProduct.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  }

  saveCart();
  productModal.hide();
  showCartPop(currentProduct, selectedColor);
});

/* Shared click handling */

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    openProduct(
      openButton.dataset.open,
      openButton.dataset.size,
      openButton.dataset.color,
    );
    return;
  }

  const sortButton = event.target.closest("[data-sort]");
  if (sortButton) {
    setSort(sortButton.dataset.sort);
    return;
  }

  const shortcut = event.target.closest("[data-sort-shortcut]");
  if (shortcut) {
    setSort(shortcut.dataset.sortShortcut);
    return;
  }

  const filterButton = event.target.closest("[data-filter-type]");
  if (filterButton) {
    const set = state[filterButton.dataset.filterType];
    const value = filterButton.dataset.value;

    set.has(value) ? set.delete(value) : set.add(value);

    renderFilterOptions();
    changed();
    return;
  }

  const removeFilter = event.target.closest("[data-remove-filter]");
  if (removeFilter) {
    const type = removeFilter.dataset.removeFilter;

    if (["colors", "sizes", "brands"].includes(type)) {
      state[type].delete(removeFilter.dataset.value);
    } else if (type === "price") {
      state.min = 0;
      state.max = 500000;
    } else if (type === "category") {
      state.category = "";
    } else {
      state[type] = false;
    }

    syncFilterInputs();
    changed();
    return;
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton && !pageButton.disabled) {
    state.page = Number(pageButton.dataset.page);
    renderProducts();

    $(".catalog-toolbar").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    return;
  }

  const sizeButton = event.target.closest("[data-modal-size]");
  if (sizeButton) {
    selectedSize = sizeButton.dataset.modalSize;
    renderModalChoices();
    return;
  }

  const colorButton = event.target.closest("[data-modal-color]");
  if (colorButton) {
    selectedColor = colorButton.dataset.modalColor;
    renderModalChoices();
    return;
  }

  const cartButton = event.target.closest("[data-cart-action]");
  if (cartButton && !cartButton.disabled) {
    const index = Number(cartButton.dataset.index);
    const item = cart[index];
    if (!item) return;

    const action = cartButton.dataset.cartAction;

    if (action === "remove") cart.splice(index, 1);
    if (action === "plus") item.quantity = Math.min(10, item.quantity + 1);
    if (action === "minus") item.quantity = Math.max(1, item.quantity - 1);

    saveCart();
    return;
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    resetFilters(true);
    state.category = categoryButton.dataset.category;
    changed();

    bootstrap.Offcanvas.getInstance($("#navigation"))?.hide();
    $(".catalog-toolbar").scrollIntoView({ block: "start" });

    if (state.category !== "زنانه") {
      notify("دادههای این نمونه فقط شامل پوشاک زنانه است.");
    }
    return;
  }

  const infoButton = event.target.closest("[data-info]");
  if (infoButton) {
    showInfo(infoButton.dataset.info, infoButton.textContent.trim());
  }
});

/* Search */

let searchTimer;

$("#productSearch").addEventListener("input", (event) => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    state.query = event.target.value;
    changed();
  }, 180);
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(searchTimer);
  state.query = $("#productSearch").value;
  changed();
});

/* Filter controls */

$("#stockFilter").addEventListener("change", (event) => {
  state.stock = event.target.checked;
  changed();
});

$("#discountFilter").addEventListener("change", (event) => {
  state.discount = event.target.checked;
  changed();
});

$("#discountShortcut").addEventListener("click", () => {
  state.discount = !state.discount;
  syncFilterInputs();
  changed();
});

$("#brandSearch").addEventListener("input", renderBrandOptions);

$("#resetFilters").addEventListener("click", () => resetFilters());
$("#emptyReset").addEventListener("click", () => resetFilters(true));

$("#minRange").addEventListener("input", (event) => {
  state.min = Math.min(Number(event.target.value), state.max);
  syncFilterInputs();
  changed();
});

$("#maxRange").addEventListener("input", (event) => {
  state.max = Math.max(Number(event.target.value), state.min);
  syncFilterInputs();
  changed();
});

function applyPriceInput(type) {
  const input = type === "min" ? $("#minPrice") : $("#maxPrice");
  const emptyValue = type === "min" ? 0 : 500000;

  const value = input.value.trim() ? numberFromInput(input.value) : emptyValue;

  if (!Number.isFinite(value) || value < 0 || value > 500000) {
    notify("قیمت را بین صفر تا ۵۰۰٬۰۰۰ تومان وارد کنید.");
    syncFilterInputs();
    return;
  }

  if (
    (type === "min" && value > state.max) ||
    (type === "max" && value < state.min)
  ) {
    notify("کمترین قیمت نباید از بیشترین قیمت بزرگتر باشد.");
    syncFilterInputs();
    return;
  }

  state[type] = value;
  syncFilterInputs();
  changed();
}

$("#minPrice").addEventListener("change", () => applyPriceInput("min"));
$("#maxPrice").addEventListener("change", () => applyPriceInput("max"));

/* Footer and demo information */

const infoTexts = {
  order:
    "برای ثبت سفارش، محصول را باز کنید، سایز و رنگ را انتخاب کنید و آن را به سبد خرید اضافه کنید. ثبت نهایی سفارش به اتصال بکاند نیاز دارد.",
  payment: "این نسخه به درگاه پرداخت متصل نیست و هیچ مبلغی دریافت نمیکند.",
  shipping:
    "روش ارسال، هزینه و زمان تحویل باید از تنظیمات واقعی فروشگاه دریافت شوند.",
  tracking:
    "در این نسخه سفارش واقعی ثبت نمیشود. پیگیری سفارش پس از اتصال سامانه سفارشها قابل فعالسازی است.",
  faq: "برای خرید، روی محصول بزنید و سایز و رنگ را انتخاب کنید. فیلترها و جستوجو به پیدا کردن محصول کمک میکنند. پرداخت در این نسخه فعال نیست.",
  privacy:
    "سبد خرید در localStorage همین مرورگر ذخیره میشود. فرم خبرنامه در این نمونه ایمیل را ذخیره یا ارسال نمیکند. منابع تصویری و کتابخانهها از سرویسهای خارجی بارگذاری میشوند.",
  report:
    "برای گزارش ایراد در نسخه نهایی، این بخش باید به فرم پشتیبانی یا نشانی تماس واقعی فروشگاه متصل شود.",
  returns:
    "متن ضمانت بازگشت از طرح نمایشی گرفته شده است. شرایط و اعتبار آن باید قبل از انتشار توسط صاحب فروشگاه مشخص شود.",
  account:
    "ورود و ثبتنام واقعی به بکاند و سرویس احراز هویت نیاز دارند. این نسخه هیچ اطلاعات ورود یا رمز عبوری دریافت نمیکند.",
};

function showInfo(key, title) {
  $("#infoTitle").textContent = title;
  $("#infoBody").textContent =
    infoTexts[key] || "اطلاعات این بخش هنوز تکمیل نشده است.";
  infoModal.show();
}

$("#newsletter").addEventListener("submit", (event) => {
  event.preventDefault();

  event.currentTarget.querySelector(".newsletter__status").textContent =
    "این فرم نمایشی است؛ برای ثبت ایمیل باید به سرویس خبرنامه متصل شود.";
});

const aboutButton = $(".about-more");

aboutButton.addEventListener("click", () => {
  const about = $(".footer-about");
  const expanded = about.classList.toggle("is-expanded");

  aboutButton.setAttribute("aria-expanded", String(expanded));
  aboutButton.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر...";
});

const footerMobileQuery = window.matchMedia("(max-width: 767.98px)");

function syncFooter() {
  $$(".footer-group").forEach((group) => {
    const button = group.querySelector(".footer-toggle");
    const expanded =
      !footerMobileQuery.matches || group.classList.contains("is-open");

    button.setAttribute("aria-expanded", String(expanded));
    button.disabled = !footerMobileQuery.matches;
  });
}

$$(".footer-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (!footerMobileQuery.matches) return;

    button.closest(".footer-group").classList.toggle("is-open");
    syncFooter();
  });
});

footerMobileQuery.addEventListener("change", syncFooter);

function syncResponsiveLayout() {
  syncFooter();

  if (!mobileQuery.matches) {
    bootstrap.Offcanvas.getInstance($("#filtersPanel"))?.hide();
    bootstrap.Offcanvas.getInstance($("#sortPanel"))?.hide();
    bootstrap.Offcanvas.getInstance($("#navigation"))?.hide();
  }

  state.page = 1;
  renderProducts();
}

mobileQuery.addEventListener("change", syncResponsiveLayout);

/* Initialize */

syncFilterInputs();
renderCart();
if (cart.length) {
  localStorage.setItem(
    "fitland-checkout-items",
    JSON.stringify(cart.map(toCheckoutItem).filter(Boolean)),
  );
}
syncResponsiveLayout();

const fa = new Intl.NumberFormat("fa-IR");
const CART_KEY = "fitland-checkout-items";
const ADDRESS_KEY = "fitland-addresses-v1";
const ORDER_KEY = "fitland-orders-v1";
const STEPS = ["cart", "address", "ship", "pay", "success", "failed"];
const CITIES = window.IRAN_CITIES;
const SHIP = { normal: 60000, fast: 120000 };
const CART_VERSION = "cart-design-v1";
const DEMO_ITEMS = [
  { id: "nike-small", title: "کفش نایک مدل ۲۰۲۴ Small", kind: "کفش بسکتبال", color: "مشکی", size: "۴۲", price: 600000, oldPrice: 1200000, off: 65, qty: 1, image: "./assests/Images/cart/01.png" },
  { id: "adidas-2023", title: "کفش آدیداس مدل ۲۰۲۳", kind: "کفش بسکتبال", color: "مشکی", size: "۴۲", price: 600000, oldPrice: 1200000, off: 65, qty: 1, image: "./assests/Images/cart/04.png" },
  { id: "nike-2024", title: "کفش نایک مدل ۲۰۲۴", kind: "کفش بسکتبال", color: "مشکی", size: "۴۲", price: 600000, oldPrice: 1200000, off: 65, qty: 1, image: "./assests/Images/cart/03.png" },
];
const DEMO_ADDRESSES = [
  {
    title: "آدرس ۱",
    line: "بجنورد، میدان شهید، بین شهید و ۱۷ شهریور، کوچه عزیز مصر، پلاک ۱۳",
    province: "خراسان شمالی",
    city: "بجنورد",
    unit: "",
    plaque: "۱۳",
    postal: "۱۰۱۷۱۳۱۱",
    phone: "۰۹۰۱۴۸۹۲۰۲۳",
    name: "مهسا شیرین زبان",
    lat: "31.9015",
    lng: "54.3672",
  },
  {
    title: "آدرس ۲",
    line: "بجنورد، میدان شهید، بین شهید و ۱۷ شهریور، کوچه عزیز مصر، پلاک ۱۳",
    province: "خراسان شمالی",
    city: "بجنورد",
    unit: "",
    plaque: "۱۳",
    postal: "۱۰۱۷۱۳۱۱",
    phone: "۰۹۰۱۴۸۹۲۰۲۳",
    name: "مهسا شیرین زبان",
    lat: "31.8974",
    lng: "54.3569",
  },
];

function setGoogleMap(el, lat, lng) {
  if (!el) return;
  const src = `https://maps.google.com/maps?q=${Number(lat)},${Number(lng)}&hl=fa&z=15&output=embed`;
  let frame = el.querySelector("iframe");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.title = "گوگل مپس";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.setAttribute("allowfullscreen", "");
    el.append(frame);
  }
  if (frame.getAttribute("src") !== src) frame.src = src;
}

let items = loadCart();
let addresses = loadAddresses();
let selectedIndex = 0;
let shipMethod = "normal";
let payMethod = "";
let lastOrder = null;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "null");
    if (localStorage.getItem(CART_KEY + "-version") === CART_VERSION && Array.isArray(saved)) return saved;
  } catch {
    /* keep the design basket */
  }
  const seeded = DEMO_ITEMS.map((item) => ({ ...item }));
  localStorage.setItem(CART_KEY, JSON.stringify(seeded));
  localStorage.setItem(CART_KEY + "-version", CART_VERSION);
  return seeded;
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  paintCount();
}

function loadAddresses() {
  try {
    const saved = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch {
    /* use the profile defaults */
  }
  const seeded = DEMO_ADDRESSES.map((item) => ({ ...item }));
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveAddresses() {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
}

function money(value) {
  return `${fa.format(value)} تومان`;
}

function totals() {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = items.reduce((sum, item) => sum + Math.max(0, (item.oldPrice || item.price) - item.price) * item.qty, 0);
  const shipping = items.length ? SHIP[shipMethod] : 0;
  return { subtotal, discount, shipping, payable: subtotal + shipping };
}

function paintCount() {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = fa.format(count);
}

function summaryMarkup() {
  const bill = totals();
  return `
    <div><dt>قیمت کالا ها</dt><dd>${money(bill.subtotal)}</dd></div>
    <div class="is-save"><dt>سود شما از خرید</dt><dd>${money(bill.discount)}</dd></div>
    <div><dt>هزینه ارسال</dt><dd>${items.length ? money(bill.shipping) : "—"}</dd></div>
    <div class="is-total"><dt>مبلغ قابل پرداخت</dt><dd>${money(bill.payable)}</dd></div>`;
}

function renderCart() {
  const list = document.getElementById("bag-list");
  const empty = document.getElementById("bag-empty");
  empty.hidden = items.length > 0;
  list.hidden = items.length === 0;
  list.innerHTML = items
    .map(
      (item, index) => `
      <article class="bag-card">
        <button class="bag-remove" type="button" data-remove data-index="${index}" aria-label="حذف از سبد خرید"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        ${item.off ? `<span class="bag-off">٪${fa.format(item.off)}</span>` : ""}
        <a class="bag-photo" href="./product.html?id=${encodeURIComponent(item.id)}">
          <img src="${item.image}" alt="" />
        </a>
        <div class="bag-body">
          <h2><a href="./product.html?id=${encodeURIComponent(item.id)}">${item.title}</a></h2>
          <p class="bag-kind">${item.kind || "کفش بسکتبال"}</p>
          <p class="bag-price"><strong>${money(item.price)}</strong>${item.oldPrice ? `<s>${fa.format(item.oldPrice)}</s>` : ""}</p>
          <p class="bag-meta"><i class="bi bi-bag" aria-hidden="true"></i>سایز ${item.size}</p>
          <p class="bag-meta"><span class="bag-swatches" aria-hidden="true"><i></i><i></i></span>${item.color}</p>
          <div class="qty-controls">
            <button type="button" data-qty="minus" data-index="${index}" aria-label="کاهش تعداد"><i class="qty-minus" aria-hidden="true"></i></button>
            <span>${item.qty}</span>
            <button type="button" data-qty="plus" data-index="${index}" aria-label="افزایش تعداد"><i class="qty-plus" aria-hidden="true"></i></button>
          </div>
        </div>
      </article>`
    )
    .join("");
  document.getElementById("cart-summary").innerHTML = summaryMarkup();
  const paySummary = document.getElementById("pay-summary");
  if (paySummary) paySummary.innerHTML = summaryMarkup();
  paintCount();
}

function fillSelect(select, names, selected) {
  select.replaceChildren(
    ...names.map((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      return option;
    })
  );
  if (names.includes(selected)) select.value = selected;
}

function fillProvinces(selected) {
  fillSelect(document.getElementById("ship-province"), Object.keys(CITIES), selected);
}

function fillCities(province, city) {
  fillSelect(document.getElementById("ship-city"), CITIES[province] || [], city);
}

function selectedAddress() {
  return addresses[selectedIndex] || null;
}

function renderAddresses() {
  const box = document.getElementById("address-choice");
  box.innerHTML = addresses
    .map(
      (address, index) => `
      <label>
        <input type="radio" name="address" value="${index}" ${index === selectedIndex ? "checked" : ""} />
        <span><strong>${address.title}</strong><small>${address.line}</small></span>
      </label>`
    )
    .join("");
  writeAddressForm();
}

function writeAddressForm() {
  const address = selectedAddress();
  if (!address) return;
  const province = CITIES[address.province] ? address.province : "خراسان شمالی";
  fillProvinces(province);
  fillCities(province, address.city);
  document.getElementById("ship-plaque").value = address.plaque || "";
  document.getElementById("ship-unit").value = address.unit || "";
  document.getElementById("ship-postal").value = address.postal || "";
  document.getElementById("ship-phone").value = address.phone || "";
  document.getElementById("ship-name").value = address.name || "";
  const line = document.getElementById("ship-address-line");
  if (line) {
    line.textContent = `${address.name} · ${address.phone} · ${address.line} · ${address.province} / ${address.city}`;
  }
}

function readAddressForm() {
  const address = selectedAddress();
  if (!address) return;
  address.province = document.getElementById("ship-province").value;
  address.city = document.getElementById("ship-city").value;
  address.plaque = document.getElementById("ship-plaque").value.trim();
  address.unit = document.getElementById("ship-unit").value.trim();
  address.postal = document.getElementById("ship-postal").value.trim();
  address.phone = document.getElementById("ship-phone").value.trim();
  address.name = document.getElementById("ship-name").value.trim();
  saveAddresses();
}

function showMap(id) {
  const address = selectedAddress();
  if (!address) return;
  setGoogleMap(document.getElementById(id), address.lat, address.lng);
}

function showStep(name) {
  if (!STEPS.includes(name)) name = "cart";
  document.body.dataset.checkout = name;
  document.querySelectorAll(".checkout-step").forEach((section) => {
    section.hidden = section.dataset.step !== name;
  });
  document.querySelectorAll(".checkout-steps [data-go]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.go === name);
  });
  const progressName = name === "ship" ? "address" : name;
  document.querySelectorAll(".cart-progress [data-go]").forEach((button) => {
    const on = button.dataset.go === progressName;
    button.classList.toggle("is-active", on);
    button.closest("li")?.classList.toggle("is-active", on);
  });
  if (location.hash !== `#${name}`) history.replaceState(null, "", `#${name}`);
  if (name === "address") requestAnimationFrame(() => showMap("address-map"));
  if (name === "ship") {
    writeAddressForm();
    requestAnimationFrame(() => showMap("ship-map"));
  }
  if (name === "pay") renderCart();
  if (name === "success") paintSuccess();
  if (name === "failed") paintFailed();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let failedCode = "";

function paintFailed() {
  const code = document.getElementById("failed-code");
  if (!code) return;
  if (!failedCode) {
    failedCode = fa.format(Math.floor(10000000 + Math.random() * 90000000)).replaceAll("٬", "");
  }
  code.textContent = failedCode;
}

function paintSuccess() {
  const code = document.getElementById("success-code");
  if (!code) return;
  if (lastOrder?.code) {
    code.textContent = lastOrder.code;
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    code.textContent = saved.at?.(-1)?.code || saved[saved.length - 1]?.code || "۱۳۸۱۸۰۳۳۴۳";
  } catch {
    code.textContent = "۱۳۸۱۸۰۳۳۴۳";
  }
}

function placeOrder() {
  const bill = totals();
  const address = selectedAddress();
  const order = {
    date: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    code: fa.format(Math.floor(100000000 + Math.random() * 900000000)).replaceAll("٬", ""),
    paid: money(bill.payable),
    discount: money(bill.discount),
    images: items.map((item) => item.image),
    address: address?.line || "",
  };
  const saved = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
  saved.push(order);
  localStorage.setItem(ORDER_KEY, JSON.stringify(saved));
  items = [];
  saveCart();
  renderCart();
  lastOrder = order;
}

document.getElementById("bag-list").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    items.splice(Number(remove.dataset.index), 1);
    saveCart();
    renderCart();
    return;
  }
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  const index = Number(button.dataset.index);
  const item = items[index];
  if (!item) return;
  if (button.dataset.qty === "plus" && item.qty < 10) item.qty += 1;
  if (button.dataset.qty === "minus") item.qty = Math.max(1, item.qty - 1);
  saveCart();
  renderCart();
});

document.getElementById("coupon-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("cart-note");
  const code = document.getElementById("coupon-code").value.trim();
  note.textContent = code ? "کد تخفیف ثبت شد." : "کد تخفیف را وارد کنید.";
});

document.getElementById("address-choice").addEventListener("change", (event) => {
  if (event.target.name !== "address") return;
  readAddressForm();
  selectedIndex = Number(event.target.value);
  writeAddressForm();
  showMap("address-map");
});

document.getElementById("ship-province").addEventListener("change", (event) => {
  fillCities(event.target.value);
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.next;
    if (next === "address" && !items.length) {
      document.getElementById("cart-note").textContent = "برای ادامه، حداقل یک کالا در سبد بگذارید.";
      return;
    }
    if (next === "ship") {
      const address = selectedAddress();
      if (!address || !document.getElementById("ship-name").value.trim() || !document.getElementById("ship-phone").value.trim()) {
        document.getElementById("address-note").textContent = "نام و شماره تماس گیرنده را کامل کنید.";
        return;
      }
      readAddressForm();
      document.getElementById("address-note").textContent = "";
    }
    document.getElementById("cart-note").textContent = "";
    showStep(next);
  });
});

document.querySelectorAll('input[name="ship"]').forEach((input) => {
  input.addEventListener("change", () => {
    shipMethod = input.value;
    renderCart();
  });
});

document.querySelectorAll('input[name="pay"]').forEach((input) => {
  input.addEventListener("change", () => {
    payMethod = input.value;
    document.getElementById("pay-note").textContent = "";
  });
});

document.getElementById("pay-submit").addEventListener("click", () => {
  if (!items.length) {
    showStep("cart");
    document.getElementById("cart-note").textContent = "سبد خرید خالی است.";
    return;
  }
  if (!payMethod) {
    document.getElementById("pay-note").textContent = "یک شیوه پرداخت را انتخاب کنید.";
    return;
  }
  placeOrder();
  showStep("success");
});

document.getElementById("show-failed").addEventListener("click", () => showStep("failed"));

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showStep(button.dataset.go));
});

document.getElementById("search-form").addEventListener("submit", (event) => event.preventDefault());
document.getElementById("newsletter").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".newsletter__status").textContent = "این فرم نمایشی است و ایمیلی ذخیره نمی‌شود.";
});

const mobileQuery = window.matchMedia("(max-width: 767.98px)");
function syncFooter() {
  document.querySelectorAll(".footer-group").forEach((group) => {
    const button = group.querySelector(".footer-toggle");
    button.setAttribute("aria-expanded", String(!mobileQuery.matches || group.classList.contains("is-open")));
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

document.querySelector(".about-more").addEventListener("click", () => {
  const about = document.querySelector(".footer-about");
  const expanded = about.classList.toggle("is-expanded");
  const button = document.querySelector(".about-more");
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر...";
});

window.addEventListener("hashchange", () => showStep(location.hash.replace("#", "")));

renderAddresses();
renderCart();
showStep(location.hash.replace("#", "") || "cart");

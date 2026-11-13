const MOBILE = window.matchMedia("(max-width: 767.98px)");
const PANELS = ["account", "orders", "favorites", "addresses", "reviews", "detail"];
const TITLES = {
  account: "حساب کاربری",
  orders: "تاریخچه سفارشات",
  favorites: "علاقه مندی",
  addresses: "آدرس ها",
  reviews: "دیدگاه‌ها و نظرات",
  detail: "اطلاعات سفارش",
};
const CITIES = window.IRAN_CITIES;
const YAZD = { lat: 31.9015, lng: 54.3672 };

const backLink = document.getElementById("profile-back");
const backLabel = document.getElementById("profile-back-label");
const provinceSelect = document.getElementById("address-province");
const citySelect = document.getElementById("address-city");
const addressForm = document.getElementById("address-form");
const addressModalEl = document.getElementById("address-modal");
const mapModalEl = document.getElementById("location-modal");
const addressModal = new bootstrap.Modal(addressModalEl);
const mapModal = new bootstrap.Modal(mapModalEl);

let editingCard = null;
let mapTarget = null;
let reopenAddress = false;
let picked = null;
let commitRequested = false;
let searchController;

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

document.getElementById("search-form")?.addEventListener("submit", (event) => event.preventDefault());
document.querySelectorAll(".sidebar-search, .panel-search").forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
});

function currentPanel() {
  const hash = location.hash.replace("#", "");
  if (hash === "menu") return MOBILE.matches ? "menu" : "account";
  if (PANELS.includes(hash)) return hash;
  return MOBILE.matches ? "menu" : "account";
}

function showPanel(name) {
  const sectionOpen = name !== "menu";
  document.body.classList.toggle("profile-section-open", sectionOpen && MOBILE.matches);
  document.querySelectorAll(".profile-panel").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== name;
  });
  document.querySelectorAll(".profile-nav a").forEach((link) => {
    const active = link.dataset.panel === name || (name === "detail" && link.dataset.panel === "orders");
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (backLink) backLink.hidden = !(MOBILE.matches && sectionOpen);
  if (backLabel) backLabel.textContent = TITLES[name] || "";
  if (name === "addresses") requestAnimationFrame(mountVisibleMaps);
  if (name === "detail" && MOBILE.matches) backLabel.textContent = TITLES.detail;
}

window.addEventListener("hashchange", () => showPanel(currentPanel()));
backLink?.addEventListener("click", (event) => {
  if (location.hash === "#detail") {
    event.preventDefault();
    location.hash = "orders";
    return;
  }
  if (MOBILE.matches) {
    event.preventDefault();
    location.hash = "menu";
  }
});
MOBILE.addEventListener("change", () => {
  if (!MOBILE.matches && (location.hash === "#menu" || location.hash === "")) showPanel("account");
  else showPanel(currentPanel());
});

document.getElementById("detail-back")?.addEventListener("click", () => {
  location.hash = "orders";
});
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function renderIncomingOrders() {
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("fitland-orders-v1") || "[]");
  } catch {
    orders = [];
  }
  if (!Array.isArray(orders) || !orders.length) return;
  const list = document.querySelector('[data-orders="current"]');
  if (!list) return;
  orders.forEach((order) => {
    const article = document.createElement("article");
    article.className = "order-card";
    const images = (Array.isArray(order.images) ? order.images : [])
      .filter((src) => String(src).startsWith("./assests/"))
      .map((src) => `<img src="${esc(src)}" alt="" />`)
      .join("");
    article.innerHTML = `
      <div class="order-card__meta">
        <span>${esc(order.date)}</span>
        <span>کد سفارش : ${esc(order.code)}</span>
        <span>مبلغ پرداخت شده : ${esc(order.paid)}</span>
        <span>تخفیف : ${esc(order.discount)}</span>
        <button type="button" data-order-detail>مشاهده سفارش</button>
      </div>
      <div class="order-card__products">${images}</div>`;
    list.prepend(article);
  });
  const tab = document.querySelector('[data-order-tab="current"] span');
  if (tab) tab.textContent = new Intl.NumberFormat("fa-IR").format(list.querySelectorAll(".order-card").length);
}

renderIncomingOrders();

document.querySelectorAll("[data-order-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    location.hash = "detail";
  });
});

document.querySelectorAll("[data-order-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-order-tab]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll("[data-orders]").forEach((list) => {
      list.hidden = list.dataset.orders !== tab.dataset.orderTab;
    });
    filterOrders();
  });
});

function filterOrders() {
  const query = document.getElementById("order-search")?.value.trim() || "";
  document.querySelectorAll("[data-orders] .order-card").forEach((card) => {
    card.hidden = Boolean(query) && !card.textContent.includes(query);
  });
}
document.getElementById("order-search")?.addEventListener("input", filterOrders);

document.getElementById("favorite-search")?.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  const cards = document.querySelectorAll("#favorites-grid .favorite-card");
  cards.forEach((card) => {
    card.hidden = Boolean(query) && !card.textContent.includes(query);
  });
  const empty = document.getElementById("favorites-empty");
  const visible = [...cards].some((card) => !card.hidden);
  if (empty) empty.hidden = visible;
});

document.querySelectorAll("[data-review-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-review-tab]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll("[data-reviews]").forEach((list) => {
      list.hidden = list.dataset.reviews !== tab.dataset.reviewTab;
    });
  });
});

const accountView = document.getElementById("account-view");
const accountEdit = document.getElementById("account-edit");
document.getElementById("start-edit")?.addEventListener("click", () => {
  accountView.hidden = true;
  accountEdit.hidden = false;
});
accountEdit?.addEventListener("submit", (event) => {
  event.preventDefault();
  ["name", "phone", "national", "gender", "email"].forEach((key) => {
    document.getElementById(`view-${key}`).textContent = document.getElementById(`edit-${key}`).value.trim();
  });
  accountEdit.hidden = true;
  accountView.hidden = false;
});

document.getElementById("avatar-input")?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const image = document.getElementById("avatar-image");
  const fallback = document.getElementById("avatar-fallback");
  image.src = URL.createObjectURL(file);
  image.hidden = false;
  fallback.hidden = true;
});

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

function fillCities(province, selected) {
  fillSelect(citySelect, CITIES[province] || [], selected);
}

fillSelect(provinceSelect, Object.keys(CITIES), "خراسان شمالی");
provinceSelect?.addEventListener("change", () => fillCities(provinceSelect.value));
fillCities(provinceSelect.value, "بجنورد");

function readCard(card) {
  return {
    title: card.dataset.title || "",
    line: card.dataset.line || "",
    province: card.dataset.province || "خراسان شمالی",
    city: card.dataset.city || "",
    unit: card.dataset.unit || "",
    plaque: card.dataset.plaque || "",
    postal: card.dataset.postal || "",
    phone: card.dataset.phone || "",
    name: card.dataset.name || "",
    lat: card.dataset.lat || String(YAZD.lat),
    lng: card.dataset.lng || String(YAZD.lng),
  };
}

function writeCard(card, data) {
  Object.entries(data).forEach(([key, value]) => {
    card.dataset[key] = value;
  });
  card.querySelector("h2").textContent = data.title;
  card.querySelector('[data-role="line"]').textContent = data.line;
  card.querySelector('[data-role="region"]').textContent = `${data.province} - ${data.city}`;
  card.querySelector('[data-role="postal"]').textContent = data.postal;
  card.querySelector('[data-role="phone"]').textContent = data.phone;
  card.querySelector('[data-role="name"]').textContent = data.name;
  const mapEl = card.querySelector(".address-card__map");
  mapEl.dataset.lat = data.lat;
  mapEl.dataset.lng = data.lng;
  if (mapEl.querySelector("iframe")) setGoogleMap(mapEl, data.lat, data.lng);
}

function openAddressForm(card) {
  editingCard = card;
  const data = card
    ? readCard(card)
    : {
        line: "",
        province: "خراسان شمالی",
        city: "بجنورد",
        unit: "",
        plaque: "",
        postal: "",
        phone: "",
        name: "",
        lat: String(YAZD.lat),
        lng: String(YAZD.lng),
      };
  document.getElementById("address-preview").textContent = data.line || "موقعیت را روی نقشه انتخاب کنید.";
  const province = CITIES[data.province] ? data.province : "خراسان شمالی";
  provinceSelect.value = province;
  fillCities(province, data.city);
  document.getElementById("address-unit").value = data.unit;
  document.getElementById("address-plaque").value = data.plaque;
  document.getElementById("address-postal").value = data.postal;
  document.getElementById("address-phone").value = data.phone;
  document.getElementById("address-name").value = data.name;
  document.getElementById("address-lat").value = data.lat;
  document.getElementById("address-lng").value = data.lng;
  addressModal.show();
}

document.getElementById("add-address")?.addEventListener("click", () => openAddressForm(null));
document.getElementById("address-list")?.addEventListener("click", (event) => {
  const remove = event.target.closest(".address-card__remove");
  const card = event.target.closest(".address-card");
  if (!card) return;
  if (remove) {
    card.remove();
    saveAddresses();
    return;
  }
  if (event.target.closest(".address-card__map")) return;
  openAddressForm(card);
});

addressForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    line: document.getElementById("address-preview").textContent.trim(),
    province: provinceSelect.value,
    city: citySelect.value,
    unit: document.getElementById("address-unit").value.trim(),
    plaque: document.getElementById("address-plaque").value.trim(),
    postal: document.getElementById("address-postal").value.trim(),
    phone: document.getElementById("address-phone").value.trim(),
    name: document.getElementById("address-name").value.trim(),
    lat: document.getElementById("address-lat").value,
    lng: document.getElementById("address-lng").value,
  };
  if (editingCard) {
    data.title = editingCard.dataset.title;
    writeCard(editingCard, data);
  } else {
    const list = document.getElementById("address-list");
    const card = document.getElementById("address-template").content.firstElementChild.cloneNode(true);
    data.title = `آدرس ${list.children.length + 1}`;
    list.append(card);
    writeCard(card, data);
    mountMiniMap(card.querySelector(".address-card__map"));
  }
  saveAddresses();
  addressModal.hide();
});

document.getElementById("change-location")?.addEventListener("click", () => {
  mapTarget = "form";
  reopenAddress = true;
  addressModal.hide();
});
addressModalEl.addEventListener("hidden.bs.modal", () => {
  if (!reopenAddress) return;
  reopenAddress = false;
  mapModal.show();
});

function mountMiniMap(el) {
  if (!el || el.dataset.googleMap) return;
  el.dataset.googleMap = "1";
  setGoogleMap(el, el.dataset.lat, el.dataset.lng);
  el.addEventListener("click", () => {
    mapTarget = el.closest(".address-card");
    picked = { lat: Number(el.dataset.lat), lng: Number(el.dataset.lng) };
    mapModal.show();
  });
}

function mountVisibleMaps() {
  document.querySelectorAll(".address-card__map").forEach((el) => {
    mountMiniMap(el);
  });
}

mapModalEl.addEventListener("shown.bs.modal", () => {
  const lat = Number(document.getElementById("address-lat").value) || YAZD.lat;
  const lng = Number(document.getElementById("address-lng").value) || YAZD.lng;
  picked = mapTarget instanceof HTMLElement
    ? { lat: Number(mapTarget.dataset.lat), lng: Number(mapTarget.dataset.lng) }
    : { lat, lng };
  setGoogleMap(document.getElementById("location-map"), picked.lat, picked.lng);
});
mapModalEl.addEventListener("hide.bs.modal", () => {
  closeResults();
  commitRequested = false;
});
mapModalEl.addEventListener("hidden.bs.modal", () => {
  if (!reopenAddress) return;
  reopenAddress = false;
  addressModal.show();
});

const resultsList = document.getElementById("location-results");
const searchForm = document.getElementById("location-search");
const searchInput = document.getElementById("place-search");

function closeResults() {
  if (!resultsList) return;
  resultsList.hidden = true;
  resultsList.innerHTML = "";
}

function showResults(items) {
  resultsList.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "نتیجه‌ای پیدا نشد";
    resultsList.append(empty);
  } else {
    items.forEach((item) => {
      const option = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `${item.title}${item.detail ? `<small>${item.detail}</small>` : ""}`;
      button.addEventListener("click", () => {
        picked = { lat: item.lat, lng: item.lng };
        setGoogleMap(document.getElementById("location-map"), picked.lat, picked.lng);
        searchInput.value = item.title;
        closeResults();
      });
      option.append(button);
      resultsList.append(option);
    });
  }
  resultsList.hidden = false;
}

async function searchPlaces(query) {
  searchController?.abort();
  searchController = new AbortController();
  const { signal } = searchController;
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "5");
    url.searchParams.set("accept-language", "fa");
    url.searchParams.set("countrycodes", "ir");
    const response = await fetch(url, { signal, headers: { "Accept-Language": "fa" } });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        return data.map((place) => {
          const [title, ...rest] = String(place.display_name || "").split(",");
          return { title: title.trim() || "موقعیت", detail: rest.join("،").trim(), lat: Number(place.lat), lng: Number(place.lon) };
        });
      }
    }
  } catch (error) {
    if (error.name === "AbortError") throw error;
  }
  const photonUrl = new URL("https://photon.komoot.io/api/");
  photonUrl.searchParams.set("q", query);
  photonUrl.searchParams.set("lang", "fa");
  photonUrl.searchParams.set("limit", "5");
  const photonResponse = await fetch(photonUrl, { signal });
  if (!photonResponse.ok) throw new Error("search failed");
  const photonData = await photonResponse.json();
  return (photonData.features || []).map((feature) => {
    const properties = feature.properties || {};
    const [lng, lat] = feature.geometry.coordinates;
    const detail = [properties.city, properties.state, properties.country].filter(Boolean).join("، ");
    return { title: properties.name || detail || "موقعیت", detail, lat, lng };
  });
}

searchForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query.length < 2) {
    closeResults();
    return;
  }
  resultsList.innerHTML = "<li>در حال جستجو…</li>";
  resultsList.hidden = false;
  try {
    showResults(await searchPlaces(query));
  } catch (error) {
    if (error.name === "AbortError") return;
    resultsList.innerHTML = "<li>جستجو انجام نشد. موقعیت را روی نقشه انتخاب کنید.</li>";
    resultsList.hidden = false;
  }
});
document.addEventListener("click", (event) => {
  if (searchForm && !searchForm.contains(event.target)) closeResults();
});

function formatAddress(data) {
  const address = data.address || {};
  const parts = [address.road, address.neighbourhood, address.suburb, address.city || address.town || address.village, address.state].filter(Boolean);
  return [...new Set(parts)].join("، ") || data.display_name || "";
}

document.getElementById("confirm-location")?.addEventListener("click", async () => {
  if (!picked) return;
  commitRequested = true;
  const latlng = picked;
  let text = "";
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latlng.lat));
    url.searchParams.set("lon", String(latlng.lng));
    url.searchParams.set("accept-language", "fa");
    const response = await fetch(url, { headers: { "Accept-Language": "fa" } });
    if (response.ok) text = formatAddress(await response.json());
  } catch {
    text = "";
  }
  const line = text || document.getElementById("address-preview").textContent;
  document.getElementById("address-lat").value = String(latlng.lat);
  document.getElementById("address-lng").value = String(latlng.lng);
  if (mapTarget === "form") {
    document.getElementById("address-preview").textContent = line;
    reopenAddress = true;
  } else if (mapTarget instanceof HTMLElement) {
    const data = readCard(mapTarget);
    data.line = line;
    data.lat = String(latlng.lat);
    data.lng = String(latlng.lng);
    writeCard(mapTarget, data);
    saveAddresses();
  }
  mapModal.hide();
});

function saveAddresses() {
  const cards = [...document.querySelectorAll("#address-list .address-card")].map(readCard);
  localStorage.setItem("fitland-addresses-v1", JSON.stringify(cards));
}

function loadAddresses() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem("fitland-addresses-v1") || "null");
  } catch {
    saved = null;
  }
  const list = document.getElementById("address-list");
  if (!list) return;
  if (!Array.isArray(saved)) {
    saveAddresses();
    return;
  }
  list.innerHTML = "";
  saved.forEach((data) => {
    const card = document.getElementById("address-template").content.firstElementChild.cloneNode(true);
    list.append(card);
    writeCard(card, data);
  });
}

function paintBagCount() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  try {
    const saved = JSON.parse(localStorage.getItem("fitland-checkout-items") || "[]");
    const count = Array.isArray(saved) ? saved.reduce((sum, item) => sum + Number(item.qty || 0), 0) : 0;
    badge.textContent = new Intl.NumberFormat("fa-IR").format(count);
  } catch {
    badge.textContent = "۰";
  }
}

loadAddresses();
paintBagCount();
showPanel(currentPanel());

const footerMobileQuery = window.matchMedia("(max-width: 767.98px)");

function syncFooter() {
  document.querySelectorAll(".footer-group").forEach((group) => {
    const button = group.querySelector(".footer-toggle");
    if (!button) return;
    const expanded = !footerMobileQuery.matches || group.classList.contains("is-open");
    button.setAttribute("aria-expanded", String(expanded));
    button.disabled = !footerMobileQuery.matches;
  });
}

document.querySelectorAll(".footer-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (!footerMobileQuery.matches) return;
    button.closest(".footer-group").classList.toggle("is-open");
    syncFooter();
  });
});

footerMobileQuery.addEventListener("change", syncFooter);
syncFooter();

document.querySelector(".about-more")?.addEventListener("click", () => {
  const about = document.querySelector(".footer-about");
  const expanded = about.classList.toggle("is-expanded");
  const button = document.querySelector(".about-more");
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر...";
});

document.getElementById("newsletter")?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".newsletter__status").textContent =
    "این فرم نمایشی است؛ برای ثبت ایمیل باید به سرویس خبرنامه متصل شود.";
});

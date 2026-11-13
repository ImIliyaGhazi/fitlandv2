const imageRoot = "./assests/Images/";

const products = {
  special: [
    {
      title: "سویشرت نایک مدل AO-۱۴",
      image: "8.png",
      alt: "سویشرت کلاهدار زیتونی زنانه",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      badges: [{ text: "VIP", type: "vip" }],
    },
    {
      title: "ست نایک مدل S-۲۰۰۰",
      image: "10.png",
      alt: "ست ورزشی طوسی زنانه",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      badges: [{ text: "٪۲۴", type: "blue" }],
    },
    {
      title: "کفش نایک مدل S-۲۰۰۰",
      image: "1.png",
      alt: "کفش ورزشی نایک سبز",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      shoe: true,
      badges: [{ text: "٪۲۴", type: "blue" }],
    },
  ],

  shoes: [
    {
      title: "نایک مدل AO-۱۴",
      image: "2.png",
      alt: "کفش ورزشی نایک قهوهای",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      shoe: true,
      badges: [
        { text: "٪۲۴", type: "navy" },
        { text: "VIP", type: "vip" },
      ],
    },
    {
      title: "کفش نایک ۲۰۲۴",
      image: "1.png",
      alt: "کفش نایک سبز با زیره قهوهای",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      shoe: true,
      badges: [],
    },
    {
      title: "کفش نایک مدل S-۲۰۰۰",
      image: "3.jpg",
      alt: "کفش نایک سفید و سرمهای",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      shoe: true,
      badges: [{ text: "٪۲۴", type: "navy" }],
    },
  ],

  cycling: [
    {
      title: "اسکوتر مدل A-۱۵۵",
      image: "12.jpg",
      alt: "اسکوتر برقی مشکی در فضای شهری",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      badges: [{ text: "٪۲۴", type: "yellow" }],
    },
    {
      title: "دوچرخه مدل S-۲۰۰۰",
      image: "14.jpg",
      alt: "دوچرخه با پسزمینه بنفش",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۳۶ تا ۴۳",
      badges: [],
    },
    {
      title: "دوچرخه مدل AO-۱۴",
      image: "13.jpg",
      alt: "دوچرخه شهری با چرخهای نارنجی",
      price: "۲۰۰۰۰۰",
      sizes: "از سایز ۱۰ تا ۱۴",
      badges: [],
    },
  ],
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function renderProduct(product) {
  const badgeMarkup = product.badges
    .map(
      (badge) => `
        <span class="product-badge product-badge--${escapeHTML(badge.type)}">
          ${escapeHTML(badge.text)}
        </span>
      `,
    )
    .join("");

  return `
    <article
      class="product-card"
      data-product-title="${escapeHTML(product.title)}"
    >
      <div class="product-card__media ${
        product.shoe ? "product-card__media--shoe" : ""
      }">
        <img
          src="${imageRoot}${escapeHTML(product.image)}"
          alt="${escapeHTML(product.alt)}"
          loading="lazy"
          width="368"
          height="280"
        />

<div class="product-card__badges">
          ${badgeMarkup}
        </div>
      </div>

<div class="product-card__body">
        <h3 class="product-card__title">
          ${escapeHTML(product.title)}
        </h3>

<p class="product-card__price">
          ${escapeHTML(product.price)} تومان
        </p>

<p class="product-card__sizes">
          ${escapeHTML(product.sizes)}
        </p>

<div
          class="product-colors"
          role="img"
          aria-label="رنگهای موجود: مشکی، طوسی و سرمهای"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </article>
  `;
}

document.querySelectorAll("[data-products]").forEach((track) => {
  const group = products[track.dataset.products] || [];
  track.innerHTML = group.map(renderProduct).join("");
});

document.querySelectorAll(".product-slider").forEach((slider) => {
  const track = slider.querySelector(".product-track");

  function move(direction) {
    const cards = [...track.querySelectorAll(".product-card")].filter(
      (card) => !card.hidden,
    );

    if (!cards.length) return;

    const trackRight = track.getBoundingClientRect().right;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(
        card.getBoundingClientRect().right - trackRight,
      );

      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });

    const nextIndex = Math.max(
      0,
      Math.min(cards.length - 1, nearestIndex + direction),
    );

    const target = cards[nextIndex];
    const offset = target.getBoundingClientRect().right - trackRight;

    track.scrollBy({
      left: offset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  slider
    .querySelector('[data-slide="previous"]')
    ?.addEventListener("click", () => move(-1));

  slider
    .querySelector('[data-slide="next"]')
    ?.addEventListener("click", () => move(1));

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(-1);
    }
  });
});

const mobileQuery = window.matchMedia("(max-width: 767.98px)");

function syncFooter() {
  document.querySelectorAll(".footer-group").forEach((group) => {
    const button = group.querySelector(".footer-toggle");
    const expanded =
      !mobileQuery.matches || group.classList.contains("is-open");

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

aboutButton.addEventListener("click", () => {
  const about = document.querySelector(".footer-about");
  const expanded = about.classList.toggle("is-expanded");

  aboutButton.setAttribute("aria-expanded", String(expanded));
  aboutButton.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر...";
});

document.querySelectorAll(".mobile-navigation a").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mobile-menu");
    bootstrap.Offcanvas.getInstance(menu)?.hide();
  });
});

function normalizeSearch(value) {
  return value
    .normalize("NFKC")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .toLowerCase()
    .trim();
}

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("site-search");
const searchStatus = document.getElementById("search-status");

function filterProducts() {
  const query = normalizeSearch(searchInput.value);
  let matchCount = 0;
  let firstMatch = null;

  document.querySelectorAll(".product-card").forEach((card) => {
    const title = normalizeSearch(card.dataset.productTitle);
    const matches = !query || title.includes(query);

    card.hidden = !matches;

    if (matches) {
      matchCount += 1;
      firstMatch ||= card;
    }
  });

  searchStatus.textContent = query
    ? `${matchCount.toLocaleString("fa-IR")} محصول پیدا شد.`
    : "";

  return firstMatch;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstMatch = filterProducts();

  if (firstMatch) {
    firstMatch.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  } else {
    searchInput.setCustomValidity("محصولی با این نام پیدا نشد.");
    searchInput.reportValidity();
  }
});

searchInput.addEventListener("input", () => {
  searchInput.setCustomValidity("");

  if (!searchInput.value.trim()) {
    filterProducts();
  }
});

document.getElementById("newsletter").addEventListener("submit", (event) => {
  event.preventDefault();

  const status = event.currentTarget.querySelector(".newsletter__status");

  status.textContent =
    "این فرم نمایشی است؛ برای ثبت ایمیل باید به سرویس خبرنامه متصل شود.";
});

const categoryMenus = [...document.querySelectorAll(".nav-drop")];
const categoryNav = document.querySelector(".desktop-navigation");

if (categoryMenus.length && categoryNav) {
  let closeMenuTimer;

  const closeCategoryMenus = () => {
    clearTimeout(closeMenuTimer);
    categoryMenus.forEach((drop) => {
      drop.classList.remove("is-open");
      drop.querySelector("a")?.setAttribute("aria-expanded", "false");
    });
  };

  const openCategoryMenu = (drop) => {
    clearTimeout(closeMenuTimer);
    categoryMenus.forEach((item) => {
      const open = item === drop;
      item.classList.toggle("is-open", open);
      item.querySelector("a")?.setAttribute("aria-expanded", open ? "true" : "false");
    });
  };

  const scheduleClose = () => {
    clearTimeout(closeMenuTimer);
    closeMenuTimer = setTimeout(closeCategoryMenus, 160);
  };

  categoryMenus.forEach((drop) => {
    drop.addEventListener("mouseenter", () => openCategoryMenu(drop));
    drop.addEventListener("mouseleave", scheduleClose);
    drop.addEventListener("focusin", () => openCategoryMenu(drop));
    drop.addEventListener("focusout", (event) => {
      if (!drop.contains(event.relatedTarget)) scheduleClose();
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".nav-drop")) closeCategoryMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCategoryMenus();
  });
}

document.querySelectorAll(".news-open").forEach((button) => {
  button.addEventListener("click", () => {
    const article = button.closest(".news-card");

    document.getElementById("news-modal-title").textContent =
      article.querySelector("h3").textContent;

    document.getElementById("news-modal-body").textContent =
      article.querySelector(".news-card__body p").textContent;
  });
});

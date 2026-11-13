(function () {
  const SELECTS = "#ship-province, #ship-city, #address-province, #address-city";

  function placeMenu(face, menu) {
    const rect = face.getBoundingClientRect();
    const gap = 6;
    const preferred = 280;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
    const spaceAbove = rect.top - gap - 12;
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
    const room = openUp ? spaceAbove : spaceBelow;
    const limit = Math.max(140, Math.min(preferred, room));
    menu.style.position = "fixed";
    menu.style.left = `${Math.round(rect.left)}px`;
    menu.style.width = `${Math.round(rect.width)}px`;
    menu.style.right = "auto";
    menu.style.zIndex = "2000";
    menu.style.maxHeight = `${Math.round(limit)}px`;
    menu.style.top = openUp
      ? `${Math.round(Math.max(8, rect.top - gap - limit))}px`
      : `${Math.round(rect.bottom + gap)}px`;
  }

  function clearMenu(menu) {
    ["position", "left", "width", "right", "top", "zIndex", "maxHeight"].forEach((prop) => {
      menu.style[prop] = "";
    });
  }

  function closeAll(except) {
    document.querySelectorAll(".fit-select.is-open").forEach((wrap) => {
      if (wrap === except) return;
      wrap.classList.remove("is-open");
      const menu = document.querySelector(`.fit-select__menu[data-for="${wrap.dataset.selectId}"]`) || wrap.querySelector(".fit-select__menu");
      const face = wrap.querySelector(".fit-select__face");
      if (menu) {
        menu.hidden = true;
        clearMenu(menu);
        if (menu.parentElement !== wrap) wrap.append(menu);
      }
      if (face) face.setAttribute("aria-expanded", "false");
    });
  }

  function repositionOpen() {
    const wrap = document.querySelector(".fit-select.is-open");
    if (!wrap) return;
    const face = wrap.querySelector(".fit-select__face");
    const menu = document.querySelector(`.fit-select__menu[data-for="${wrap.dataset.selectId}"]`);
    if (!face || !menu || menu.hidden) return;
    placeMenu(face, menu);
  }

  function enhance(select) {
    if (select.closest(".fit-select")) return;

    const wrap = document.createElement("span");
    wrap.className = "fit-select";
    wrap.dataset.selectId = select.id || `fit-select-${Math.random().toString(36).slice(2)}`;
    select.before(wrap);
    wrap.append(select);
    select.classList.add("fit-select__native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    const face = document.createElement("button");
    face.type = "button";
    face.className = "fit-select__face";
    face.setAttribute("aria-haspopup", "listbox");
    face.setAttribute("aria-expanded", "false");
    const caption = select.closest("label")?.querySelector(":scope > span")?.textContent?.trim();
    if (caption) face.setAttribute("aria-label", caption);

    const menu = document.createElement("div");
    menu.className = "fit-select__menu";
    menu.hidden = true;
    menu.dataset.for = wrap.dataset.selectId;
    menu.setAttribute("role", "listbox");

    wrap.prepend(face);
    wrap.append(menu);

    function paint() {
      const current = select.value;
      const selected = select.selectedOptions[0];
      face.textContent = selected ? selected.textContent : "";
      menu.replaceChildren(
        ...[...select.options].map((option) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "fit-select__option";
          item.setAttribute("role", "option");
          item.dataset.value = option.value;
          item.textContent = option.textContent;
          const active = option.value === current;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-selected", String(active));
          return item;
        })
      );
    }

    function open() {
      closeAll(wrap);
      document.body.append(menu);
      placeMenu(face, menu);
      menu.hidden = false;
      wrap.classList.add("is-open");
      face.setAttribute("aria-expanded", "true");
      const chosen = menu.querySelector(".is-selected");
      if (chosen) menu.scrollTop = Math.max(0, chosen.offsetTop - (menu.clientHeight - chosen.offsetHeight) / 2);
    }

    function close() {
      menu.hidden = true;
      wrap.classList.remove("is-open");
      face.setAttribute("aria-expanded", "false");
      clearMenu(menu);
      if (menu.parentElement !== wrap) wrap.append(menu);
    }

    face.addEventListener("click", () => {
      if (menu.hidden) open();
      else close();
    });

    menu.addEventListener("click", (event) => {
      const item = event.target.closest(".fit-select__option");
      if (!item) return;
      select.value = item.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      paint();
      close();
    });

    const valueProp = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
    Object.defineProperty(select, "value", {
      configurable: true,
      enumerable: true,
      get() {
        return valueProp.get.call(this);
      },
      set(next) {
        valueProp.set.call(this, next);
        paint();
      },
    });

    new MutationObserver(paint).observe(select, { childList: true });
    select.addEventListener("change", paint);
    paint();
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".fit-select, .fit-select__menu")) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  window.addEventListener("resize", repositionOpen);
  window.addEventListener("scroll", repositionOpen, true);

  document.querySelectorAll(SELECTS).forEach(enhance);
})();

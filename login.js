"use strict";
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  const fa = (v) => String(v).replace(/\d/g, (d) => faDigits[Number(d)]);
  const normalize = (v) =>
    String(v)
      .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  const phone = (v) =>
    normalize(v)
      .replace(/[\s()-]/g, "")
      .replace(/^(?:\+98|0098)/, "0");
  const isPhone = (v) => /^09\d{9}$/.test(phone(v));
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isName = (v) =>
    /^[\p{Script=Arabic}\s\u200c]+$/u.test(v.trim()) &&
    v.trim().split(/\s+/).length >= 2 &&
    !/[۰-۹٠-٩]/.test(v);
  const inputs = $$(".otp-input");
  let step = "login",
    identity = "",
    verified = false,
    deadline = 0,
    timer;
  const announce = (text) => {
    $("#announcement").textContent = text;
  };
  function error(id, message = "") {
    const field = $("#" + id),
      output = $("#" + id + "-error");
    field.classList.toggle("is-invalid", !!message);
    field.setAttribute("aria-invalid", String(!!message));
    if (message) field.classList.remove("is-valid");
    output.textContent = message;
    output.hidden = !message;
  }
  function otpError(message = "") {
    $("#otp-error").textContent = message;
    $("#otp-error").hidden = !message;
    inputs.forEach((i) => i.setAttribute("aria-invalid", String(!!message)));
  }
  function tick() {
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    $("#countdown").textContent = fa(
      String(Math.floor(seconds / 60)).padStart(2, "0") +
        ":" +
        String(seconds % 60).padStart(2, "0"),
    );
    $("#resend").disabled = seconds > 0;
    $(".otp-meta").classList.toggle("is-expired", !seconds);
    if (!seconds) clearInterval(timer);
  }
  function resumeTimer() {
    clearInterval(timer);
    tick();
    if (deadline > Date.now()) timer = setInterval(tick, 250);
  }
  function show(next, focus = true) {
    step = next;
    document.body.dataset.step = next;
    ["login", "otp", "register", "success"].forEach((n) => {
      $("#" + n + "-view").hidden = n !== next;
    });
    clearInterval(timer);
    if (next === "otp") resumeTimer();
    if (focus) $("#" + next + "-title").focus({ preventScroll: true });
  }
  function updateIdentity() {
    const filled = !!$("#identity").value.trim();
    $("#identity").classList.toggle("has-value", filled);
    $("#clear-identity").hidden = !filled;
    $("#login-legal").hidden = filled;
  }
  function setDigit(input, value) {
    input.value = fa(value);
    input.classList.toggle("has-value", !!value);
  }
  function resetCode() {
    inputs.forEach((i) => setDigit(i, ""));
    otpError();
  }
  function distribute(text, start) {
    const value = normalize(text).replace(/\D/g, "");
    if (!value) return;
    if (value.length >= 5) start = 0;
    value
      .slice(0, 5 - start)
      .split("")
      .forEach((d, n) => setDigit(inputs[start + n], d));
    inputs[Math.min(4, start + value.length)].focus();
    otpError();
  }
  $("#identity").addEventListener("input", () => {
    error("identity");
    updateIdentity();
  });
  $("#clear-identity").addEventListener("click", () => {
    $("#identity").value = "";
    error("identity");
    updateIdentity();
    $("#identity").focus();
  });
  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = $("#identity").value.trim();
    if (!isPhone(value) && !isEmail(value)) {
      error(
        "identity",
        value.includes("@")
          ? "لطفا ایمیل خود را به صورت صحیح وارد نمایید"
          : "لطفا شماره همراه خود را به صورت صحیح وارد نمایید",
      );
      $("#identity").focus();
      return;
    }
    error("identity");
    identity = isPhone(value) ? phone(value) : value;
    verified = false;
    resetCode();
    deadline = Date.now() + 90000;
    show("otp");
    inputs[0].focus();
    announce("حالت نمایشی: کد تایید ۴۷۲۰۹ است. پیام واقعی ارسال نمی‌شود.");
  });
  inputs.forEach((input, index) => {
    input.addEventListener("focus", () => input.select());
    input.addEventListener("input", () => {
      const value = normalize(input.value).replace(/\D/g, "");
      if (value.length > 1) {
        distribute(value, index);
        return;
      }
      setDigit(input, value);
      otpError();
      if (value && index < 4) inputs[index + 1].focus();
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      distribute(e.clipboardData.getData("text"), index);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        e.preventDefault();
        setDigit(inputs[index - 1], "");
        inputs[index - 1].focus();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        inputs[
          Math.max(0, Math.min(4, index + (e.key === "ArrowLeft" ? -1 : 1)))
        ].focus();
      }
    });
  });
  $("#resend").addEventListener("click", () => {
    if (Date.now() < deadline) return;
    resetCode();
    deadline = Date.now() + 90000;
    resumeTimer();
    inputs[0].focus();
    announce("کد نمایشی دوباره آماده شد: ۴۷۲۰۹");
  });
  $("#otp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = normalize(inputs.map((i) => i.value).join(""));
    if (code !== "11228") {
      otpError(
        code.length !== 5
          ? "لطفا کد پنج رقمی را کامل وارد کنید"
          : "کد تایید صحیح نیست. کد نمایشی: ۴۷۲۰۹",
      );
      inputs[0].focus();
      return;
    }
    verified = true;
    $("#phone").value = isPhone(identity) ? fa(identity) : "";
    $("#email").value = isEmail(identity) ? identity : "";
    ["phone", "email"].forEach((id) => {
      error(id);
      $("#" + id).classList.toggle("is-valid", !!$("#" + id).value);
    });
    show("register");
  });
  ["fullname", "phone", "email"].forEach((id) => {
    $("#" + id).addEventListener("input", () => {
      error(id);
      const v = $("#" + id).value;
      const valid =
        id === "phone" ? isPhone(v) : id === "email" ? isEmail(v) : isName(v);
      $("#" + id).classList.toggle("is-valid", !!v.trim() && valid);
    });
  });
  $("#terms").addEventListener("change", () => error("terms"));
  $("#register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!verified) {
      show("login");
      return;
    }
    error(
      "fullname",
      isName($("#fullname").value)
        ? ""
        : "نام و نام خانوادگی خود را به فارسی وارد کنید",
    );
    error(
      "phone",
      isPhone($("#phone").value) ? "" : "شماره همراه صحیح وارد کنید",
    );
    error(
      "email",
      !$("#email").value.trim() || isEmail($("#email").value)
        ? ""
        : "ایمیل صحیح وارد کنید",
    );
    error(
      "terms",
      $("#terms").checked ? "" : "پذیرش قوانین و مقررات الزامی است",
    );
    const invalid = $("#register-form .is-invalid");
    if (invalid) {
      invalid.focus();
      return;
    }
    show("success");
    announce("فرم نمایشی تکمیل شد. حساب واقعی ایجاد نشده است.");
  });
  function restart() {
    identity = "";
    verified = false;
    deadline = 0;
    $$("form").forEach((f) => f.reset());
    ["identity", "fullname", "phone", "email", "terms"].forEach((id) => {
      error(id);
      $("#" + id).classList.remove("is-valid");
    });
    resetCode();
    updateIdentity();
    show("login");
  }
  $$("[data-back]").forEach((b) =>
    b.addEventListener("click", () => {
      if (step === "register") show("otp");
      else if (step === "otp") show("login");
      else if (step === "success") restart();
      else window.location.assign("./");
    }),
  );
  $("#restart").addEventListener("click", restart);
  $$("[data-policy]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      $("#policy-title").textContent =
        b.dataset.policy === "privacy" ? "حریم خصوصی" : "قوانین و مقررات";
      $("#policy-dialog").showModal();
    }),
  );
  $("#close-policy").addEventListener("click", () =>
    $("#policy-dialog").close(),
  );
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && step === "otp") resumeTimer();
  });
  window.addEventListener("pagehide", () => clearInterval(timer));
  window.addEventListener("pageshow", () => {
    if (step === "otp") resumeTimer();
  });
  show("login", false);
  updateIdentity();
})();

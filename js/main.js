function updateLinkTheme(theme) {
  document.querySelectorAll("a[href]").forEach(a => {
    try {
      const u = new URL(a.href);
      if (u.origin === location.origin || u.protocol === "file:") {
        if (theme === "light") u.searchParams.set("theme", "light");
        else u.searchParams.delete("theme");
        a.href = u.toString();
      }
    } catch (_) {}
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  const logos = document.querySelectorAll("header img[alt='Telekom a.s.'], footer img[alt='Telekom a.s.']");
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const logo = isLight ? "images/logos/Telekom black text big.svg" : "images/logos/Telekom pink text big.svg";
  logos.forEach(img => { img.src = logo; });
  updateLinkTheme(isLight ? "light" : "dark");

  const applyTheme = theme => {
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    const src = theme === "light" ? "images/logos/Telekom black text big.svg" : "images/logos/Telekom pink text big.svg";
    logos.forEach(img => { img.src = src; });
  };
  const toggle = el => {
    el?.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (_) {}
      updateLinkTheme(next);
      const url = new URL(location.href);
      if (next === "light") url.searchParams.set("theme", "light");
      else url.searchParams.delete("theme");
      history.replaceState({}, "", url.toString());
    });
  };
  toggle(document.getElementById("theme-toggle"));
  toggle(document.getElementById("theme-toggle-mobile"));

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("hidden");
      hamburger.setAttribute("aria-expanded", !open);
    });
  }

  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.replace("text-white", "text-muted"));
        tabs.forEach(t => t.classList.replace("border-brand", "border-transparent"));
        panels.forEach(p => p.classList.add("hidden"));
        tab.classList.replace("text-muted", "text-white");
        tab.classList.replace("border-transparent", "border-brand");
        const target = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
        if (target) target.classList.remove("hidden");
      });
    });
  }

  const gallery = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  };
  if (gallery && lightbox) {
    gallery.addEventListener("click", e => {
      const cell = e.target.closest("[data-src]");
      if (!cell) return;
      openLightbox(cell.dataset.src, cell.dataset.alt);
    });
    gallery.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        const cell = e.target.closest("[data-src]");
        if (!cell) return;
        e.preventDefault();
        openLightbox(cell.dataset.src, cell.dataset.alt);
      }
    });
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  const formPages = document.querySelectorAll("[data-form-page]");
  const prevBtn = document.getElementById("form-prev");
  const nextBtn = document.getElementById("form-next");
  const submitBtn = document.getElementById("form-submit");
  let currentPage = 0;
  if (formPages.length) {
    const showPage = i => {
      formPages.forEach((p, idx) => p.classList.toggle("hidden", idx !== i));
      if (prevBtn) prevBtn.classList.toggle("hidden", i === 0);
      if (nextBtn) nextBtn.classList.toggle("hidden", i === formPages.length - 1);
      if (submitBtn) submitBtn.classList.toggle("hidden", i !== formPages.length - 1);
    };
    showPage(0);
    prevBtn?.addEventListener("click", () => {
      if (currentPage > 0) { currentPage--; showPage(currentPage); }
    });
    nextBtn?.addEventListener("click", () => {
      if (currentPage < formPages.length - 1) { currentPage++; showPage(currentPage); }
    });
  }

  const forms = document.querySelectorAll("[data-validate]");
  forms.forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach(el => {
        const err = el.parentElement.querySelector(".form-error");
        if (!el.value.trim()) {
          valid = false;
          el.classList.add("border-red-500");
          if (err) err.classList.remove("hidden");
        } else {
          el.classList.remove("border-red-500");
          if (err) err.classList.add("hidden");
        }
      });
      const email = form.querySelector('input[type="email"]');
      if (email && email.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          valid = false;
          email.classList.add("border-red-500");
          const err = email.parentElement.querySelector(".form-error");
          if (err) { err.textContent = "Neplatný e-mail"; err.classList.remove("hidden"); }
        }
      }
      const gdpr = form.querySelector("[name='gdpr']");
      if (gdpr && !gdpr.checked) {
        valid = false;
        gdpr.classList.add("border-red-500");
      } else if (gdpr) {
        gdpr.classList.remove("border-red-500");
      }
      if (valid) {
        const msg = document.getElementById("form-success");
        if (msg) msg.classList.remove("hidden");
        form.reset();
      }
    });
  });

  if (page === "gallery") {
    const grid = document.getElementById("gallery-grid");
    if (grid && !grid.children.length) {
      const items = [
        { label: "TK-Series radiostanice", file: "radio.jpg", hue: 0 },
        { label: "TF-90 Kestrel", file: "kestrel.jpg", hue: 30 },
        { label: "TeleOrbit satelit", file: "satellite.jpg", hue: 60 },
        { label: "Cunda SEM-4 Viper", file: "viper.jpg", hue: 90 },
        { label: "Phantom UAV roj", file: "uav.jpg", hue: 120 },
        { label: "Výrobní závod ČR", file: "factory.jpg", hue: 150 },
        { label: "APS-Shield", file: "aps.jpg", hue: 180 },
        { label: "Velitelské centrum", file: "command.jpg", hue: 210 },
        { label: "NATO cvičení", file: "nato.jpg", hue: 240 },
      ];
      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "gallery-cell relative border border-border rounded-lg aspect-[4/3] cursor-pointer hover:border-brand transition-colors";
        div.tabIndex = 0;
        div.role = "button";
        div.dataset.src = `images/gallery/${item.file}`;
        div.dataset.alt = item.label;
        div.style.cssText = `background:hsl(${item.hue},15%,18%) url('images/gallery/${item.file}') center/cover no-repeat`;
        grid.appendChild(div);
      });
    }
  }
});

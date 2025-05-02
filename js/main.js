document.addEventListener("DOMContentLoaded", () => {
  // — Dark-mode toggle —
  const btn  = document.getElementById("theme-toggle");
  const icon = btn.querySelector(".theme-icon");
  const saved = localStorage.getItem("prefers-dark");
  const useDark = saved === "true"
    ? true
    : saved === "false"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (useDark) {
    document.body.classList.add("dark-mode");
    icon.textContent = "🌙";
  } else {
    document.body.classList.remove("dark-mode");
    icon.textContent = "🌞";
  }
  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    icon.textContent = isDark ? "🌙" : "🌞";
    localStorage.setItem("prefers-dark", isDark);
  });

  // — Header scroll hide/show —
  const header = document.querySelector(".site-header");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("header-scrolled", y > 10);
    header.classList.toggle("header-hidden", y > lastY && y > 150);
    lastY = y;
  });

  // — Mobile menu —
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks   = document.querySelector(".nav-links");
  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });

  // — Scroll reveal —
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".section, .reveal").forEach(el => {
    observer.observe(el);
  });

  // — Contact form (Formspree) —
  const form = document.getElementById("contact-form");
  const resp = document.getElementById("form-response");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { "Accept": "application/json" }
      })
      .then(r => {
        if (r.ok) {
          resp.textContent = "👍 Thanks! I’ll be in touch soon.";
          resp.classList.add("success");
          form.reset();
        } else {
          resp.textContent = "⚠️ Oops! Something went wrong.";
          resp.classList.add("error");
        }
      })
      .catch(() => {
        resp.textContent = "⚠️ Network error. Please try again.";
        resp.classList.add("error");
      });
    });
  }

  // — PDF / Image viewer (first PDF loads by default) —
  const viewer  = document.querySelector(".research-viewer");
  const buttons = Array.from(document.querySelectorAll(".view-btn"));

  function showFile(file) {
    const ext = file.split(".").pop().toLowerCase();
    if (ext === "pdf") {
      viewer.innerHTML = `<iframe src="${file}" ></iframe>`;
    } else {
      viewer.innerHTML = `<img src="${file}" alt="Preview">`;
    }
  }

  // Wire up each button click
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      showFile(btn.dataset.file);
    });
  });

  // Load the first PDF/image on page load
  if (buttons.length > 0) {
    showFile(buttons[0].dataset.file);
  }
});

/* RAGShield — landing page interactions
   Nav state, mobile menu, scroll reveal, active section, footer year. */
(() => {
  "use strict";
  const doc = document;
  const html = doc.documentElement;
  html.classList.remove("no-js");
  html.classList.add("js");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Header background on scroll ----- */
  const header = doc.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Mobile navigation ----- */
  const toggle = doc.querySelector(".nav-toggle");
  const panel = doc.getElementById("nav-panel");
  const setNav = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("open", open);
    doc.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", () =>
    setNav(toggle.getAttribute("aria-expanded") !== "true")
  );
  panel.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });
  doc.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setNav(false);
      toggle.focus();
    }
  });

  /* ----- Stagger indexes for grouped reveals ----- */
  doc.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) =>
      child.style.setProperty("--i", i % 8)
    );
  });

  /* ----- Scroll reveal ----- */
  const revealEls = Array.from(doc.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ----- Active section highlighting in nav ----- */
  const links = Array.from(panel.querySelectorAll('a[href^="#"]:not(.btn)'));
  const sectionMap = new Map();
  links.forEach((link) => {
    const sec = doc.querySelector(link.hash);
    if (sec) sectionMap.set(sec, link);
  });
  if (sectionMap.size && "IntersectionObserver" in window) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = sectionMap.get(entry.target);
          if (!active) return;
          links.forEach((l) => l.classList.remove("active"));
          active.classList.add("active");
        });
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    sectionMap.forEach((_, sec) => navIo.observe(sec));
  }

  /* ----- Footer year ----- */
  const year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

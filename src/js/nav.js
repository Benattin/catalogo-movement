(() => {
  const rail = document.querySelector(".rail");
  const openBtn = document.querySelector("[data-open-rail]");
  const backdrop = document.querySelector(".rail-backdrop");

  function setOpen(open) {
    rail?.classList.toggle("is-open", open);
    backdrop?.toggleAttribute("hidden", !open);
    backdrop?.classList.toggle("is-on", open);
    openBtn?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  }

  openBtn?.addEventListener("click", () => setOpen(!rail.classList.contains("is-open")));
  document.querySelectorAll("[data-close-rail]").forEach((el) => {
    el.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  function markNav() {
    const hash = location.hash.replace("#", "");
    const onHome = !/\/(produto|sobre|pedido|privacidade|404)/.test(location.pathname);
    document.querySelectorAll(".rail-nav a[data-cat]").forEach((a) => {
      const cat = a.dataset.cat;
      const current = onHome && ((cat === "todos" && !hash) || (hash && hash === cat));
      if (current) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  markNav();
  window.addEventListener("hashchange", markNav);
  document.querySelectorAll(".rail-nav a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });
})();

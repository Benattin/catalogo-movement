(() => {
  const api = window.MJ;
  if (!api) return;
  const mount = document.querySelector("[data-catalog]");
  if (!mount) return;

  const { site, foldAccents } = api;
  const fold = foldAccents || ((s) => String(s || "").toLowerCase());
  const search = document.querySelector("[data-search]");
  const empty = document.querySelector("[data-empty]");
  const heading = document.querySelector("[data-cat-title]");
  const countEl = document.querySelector("[data-cat-count]");
  const labels = Object.fromEntries((site.categories || []).map((c) => [c.id, c.label]));
  labels.todos = labels.todos || "Coleção";

  let cat = "todos";
  let q = "";

  function markChips() {
    document.querySelectorAll("[data-chip]").forEach((el) => {
      if (el.dataset.chip === cat) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
  }

  function render() {
    let shown = 0;
    mount.querySelectorAll(".cat-block").forEach((block) => {
      const inCat = cat === "todos" || block.dataset.cat === cat;
      let n = 0;
      block.querySelectorAll(".card").forEach((card) => {
        const on = inCat && (!q || (card.dataset.q || "").includes(q));
        card.hidden = !on;
        if (on) n++;
      });
      block.hidden = n === 0;
      const count = block.querySelector("[data-block-count]");
      if (count) count.textContent = `${n} peça${n === 1 ? "" : "s"}`;
      shown += n;
    });
    if (empty) empty.hidden = shown > 0;
    if (heading) heading.textContent = labels[cat] || "Coleção";
    if (countEl) countEl.textContent = `${shown} peça${shown === 1 ? "" : "s"}`;
    markChips();
  }

  function applyHash() {
    const h = location.hash.replace("#", "");
    cat = labels[h] ? h : "todos";
    render();
    if (cat !== "todos") {
      document.getElementById("catalogo")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  }

  search?.addEventListener("input", (e) => {
    q = fold(e.target.value.trim());
    render();
  });

  window.addEventListener("hashchange", applyHash);
  applyHash();
})();

(() => {
  const api = window.MJ;
  if (!api) return;
  const { money, esc, imgSrc, site, pieceMeta } = api;
  const grid = document.querySelector("[data-grid]");
  const dataEl = document.getElementById("products-data");
  if (!grid || !dataEl) return;

  const search = document.querySelector("[data-search]");
  const empty = document.querySelector("[data-empty]");
  const heading = document.querySelector("[data-cat-title]");
  const countEl = document.querySelector("[data-cat-count]");
  const products = JSON.parse(dataEl.textContent);
  const labels = Object.fromEntries(
    (site.categories || []).map((c) => [c.id, c.label])
  );
  labels.todos = labels.todos || "Coleção";

  let cat = "todos";
  let q = "";

  function img(file) {
    return imgSrc(file);
  }

  function render() {
    const list = products.filter((p) => {
      const okCat = cat === "todos" || p.category === cat;
      const hay = `${p.name} ${p.sku} ${p.color} ${p.line}`.toLowerCase();
      return okCat && (!q || hay.includes(q));
    });
    if (empty) empty.hidden = list.length > 0;
    if (heading) heading.textContent = labels[cat] || "Coleção";
    if (countEl) countEl.textContent = `${list.length} peça${list.length === 1 ? "" : "s"}`;
    grid.innerHTML = list
      .map(
        (p, i) => `
      <article class="card">
        <a href="produto.html?id=${esc(p.id)}">
          <div class="card-media">
            ${p.soldOut ? `<span class="badge sold">Esgotado</span>` : `<span class="badge">${esc(p.line)}</span>`}
            <img src="${img(p.hero)}" alt="${esc(p.name)} — ${esc(p.color)}" width="480" height="600" ${i === 0 ? `fetchpriority="high" decoding="async"` : `loading="lazy" decoding="async"`}>
            <span class="card-go">${p.soldOut ? "Ver peça" : "Ver ficha"}</span>
          </div>
          <div class="card-body">
            <p class="meta">${esc(pieceMeta(p))}</p>
            <h2>${esc(p.name)}</h2>
            <div class="prices">
              <span class="price-a">${money(p.atacado)} <span class="meta">atacado</span></span>
              <span class="price-v">${money(p.varejo)} varejo</span>
            </div>
          </div>
        </a>
      </article>`
      )
      .join("");
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
    q = e.target.value.trim().toLowerCase();
    render();
  });

  window.addEventListener("hashchange", applyHash);
  applyHash();
})();

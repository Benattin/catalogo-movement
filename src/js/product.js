(() => {
  const api = window.MJ;
  if (!api) return;
  const { addItem, qtyTotal, imgSrc, money, esc, pieceMeta, site } = api;
  const mount = document.querySelector("[data-pdp]");
  if (!mount) return;

  const src =
    document.querySelector('meta[name="products-src"]')?.content || "data/products.json";
  const catalogUrl = new URL(src, document.baseURI).href;

  function readId() {
    const q = new URLSearchParams(location.search).get("id");
    if (q) return q;
    const hash = location.hash.replace(/^#/, "");
    if (hash.startsWith("id=")) return decodeURIComponent(hash.slice(3));
    const path = location.pathname.replace(/\/+$/, "");
    const m = path.match(/\/produto(?:\.html)?\/([^/]+)$/);
    if (m) return decodeURIComponent(m[1].replace(/\.html$/, ""));
    return "";
  }

  fetch(catalogUrl)
    .then((r) => {
      if (!r.ok) throw new Error("http");
      const type = r.headers.get("content-type") || "";
      if (type.includes("text/html")) throw new Error("html");
      return r.json();
    })
    .then((data) => boot(Array.isArray(data) ? data : data.products || []))
    .catch(() => missing("O catálogo não carregou."));

  function missing(lead) {
    mount.innerHTML = `<div class="wrap about">
      <p class="kicker">Ficha</p>
      <h1>Peça não encontrada</h1>
      <p class="lead">${lead}</p>
      <p class="about-cta"><a class="btn" href="index.html">Voltar ao catálogo</a></p>
    </div>`;
  }

  function boot(products) {
  const id = readId();
  const product = products.find((p) => p.id === id);
  const moqSame = site.moqSame || 6;
  const moqMix = site.moqMix || 12;

  if (!product) {
    missing("Essa peça não está no catálogo.");
    return;
  }

  const idx = products.findIndex((x) => x.id === product.id);
  const prev = products[(idx - 1 + products.length) % products.length];
  const next = products[(idx + 1) % products.length];
  const related = (product.related || [])
    .map((rid) => products.find((x) => x.id === rid))
    .filter(Boolean);

  function href(pid) {
    return `produto.html?id=${encodeURIComponent(pid)}`;
  }

  const thumbs = (product.images || [])
    .map(
      (file, i) =>
        `<button type="button" data-thumb="${esc(file)}" ${i === 0 ? 'aria-current="true"' : ""} aria-label="Foto ${i + 1}">
          <img src="${imgSrc(file)}" alt="${esc(product.name)} — foto ${i + 1}" width="64" height="80" loading="lazy">
        </button>`
    )
    .join("");

  const sizes = (product.sizes || [])
    .map(
      (s) => `<div class="size-row" data-size="${esc(s)}">
        <span>${esc(s)}</span>
        <div class="qty">
          <button type="button" class="qty-btn" data-minus data-size="${esc(s)}" aria-label="Diminuir ${esc(s)}" ${product.soldOut ? "disabled" : ""}>−</button>
          <span data-val>0</span>
          <button type="button" class="qty-btn qty-btn-plus" data-plus data-size="${esc(s)}" aria-label="Aumentar ${esc(s)}" ${product.soldOut ? "disabled" : ""}>+</button>
        </div>
        <span class="meta">${product.soldOut ? "Indisponível" : "Em linha"}</span>
      </div>`
    )
    .join("");

  const specs = (product.specs || [])
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("");
  const chart = product.sizeChart || { headers: [], rows: [], note: "" };
  const chartHead = (chart.headers || []).map((h) => `<th>${esc(h)}</th>`).join("");
  const chartRows = (chart.rows || [])
    .map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
    .join("");

  const relCards = related
    .map(
      (item) => `<article class="card">
        <a href="${href(item.id)}">
          <div class="card-media">
            <img src="${imgSrc(item.hero)}" alt="${esc(item.name)}" width="320" height="400" loading="lazy">
          </div>
          <div class="card-body">
            <p class="meta">${esc(pieceMeta(item))}</p>
            <h3>${esc(item.name)}</h3>
            <span class="price-a">${money(item.atacado)} <span class="meta">atacado</span></span>
          </div>
        </a>
      </article>`
    )
    .join("");

  document.title = `${product.name} | Movement atacado`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", product.description || "");
  const catLabel =
    (site.categories || []).find((c) => c.id === product.category)?.label || product.line;

  mount.innerHTML = `
    <nav class="wrap crumbs"><a href="index.html">Catálogo</a> / <a href="index.html#${esc(product.category)}">${esc(catLabel)}</a> / ${esc(product.name)}</nav>
<article class="wrap pdp" data-product>
  <div class="gallery">
    <div class="gallery-main">
      ${product.soldOut ? `<span class="badge sold">Esgotado</span>` : ""}
      <img data-main-img src="${imgSrc(product.hero)}" alt="${esc(product.name)} — ${esc(product.color)}, caimento ${esc(product.fit)}" width="720" height="900">
    </div>
    <div class="thumbs">${thumbs}</div>
  </div>
  <div class="pdp-info">
    <p class="sku">${esc(pieceMeta(product))}</p>
    <h1>${esc(product.name)}</h1>
    <div class="price-block">
      <div class="price-box"><span>Atacado</span><b>${money(product.atacado)}</b></div>
      <div class="price-box"><span>Varejo</span><b>${money(product.varejo)}</b></div>
    </div>
    <p class="moq">O atacado vale a partir de <strong>${moqSame} peças deste modelo</strong> ou <strong>${moqMix} peças no pedido</strong>. Abaixo disso, cobra-se o preço de varejo.</p>
    <p class="desc">${esc(product.description)}</p>
    ${product.photoNote ? `<p class="note">${esc(product.photoNote)}</p>` : ""}
    <h2>Escolha os tamanhos</h2>
    <p class="meta">Informe a quantidade por tamanho. Caimento: ${esc(product.fit)}.</p>
    ${sizes}
    <p class="meta" data-pieces>0 peças</p>
    <div class="pdp-actions">
      <button class="btn btn-full btn-add" data-add type="button" ${product.soldOut ? "disabled" : ""}>${product.soldOut ? "Esgotado" : "Adicionar à linha"}</button>
      <p class="note-add" data-added hidden></p>
      <a class="btn btn-ghost light btn-full" href="pedido.html">Ver pedido</a>
    </div>
    <div class="tabs" role="tablist">
      <button type="button" role="tab" data-tab="specs" aria-selected="true">Ficha técnica</button>
      <button type="button" role="tab" data-tab="chart" aria-selected="false">Medidas</button>
      <button type="button" role="tab" data-tab="care" aria-selected="false">Cuidados</button>
    </div>
    <div class="panel is-on" data-panel="specs">
      <table class="spec"><tbody>${specs}</tbody></table>
    </div>
    <div class="panel" data-panel="chart">
      <table class="chart"><thead><tr>${chartHead}</tr></thead><tbody>${chartRows}</tbody></table>
      <p class="note">${esc(chart.note || "")}</p>
    </div>
    <div class="panel" data-panel="care"><p class="desc">${esc(product.care || "")}</p></div>
    <nav class="pager" aria-label="Navegação da coleção">
      <a href="${href(prev.id)}"><span>Anterior</span>${esc(prev.name)}</a>
      <a class="next" href="${href(next.id)}"><span>Próxima</span>${esc(next.name)}</a>
    </nav>
  </div>
</article>
<section class="wrap related">
  <p class="kicker">Peças</p>
  <h2>Complete o look</h2>
  <div class="related-grid">${relCards}</div>
</section>`;

  const root = mount.querySelector("[data-product]");
  const qty = Object.fromEntries((product.sizes || []).map((s) => [s, 0]));

  const mainImg = root.querySelector("[data-main-img]");
  root.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (mainImg) mainImg.src = imgSrc(btn.dataset.thumb);
      root.querySelectorAll("[data-thumb]").forEach((b) => {
        if (b === btn) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
    });
  });

  function totalPieces() {
    return Object.values(qty).reduce((a, b) => a + b, 0);
  }

  function paint() {
    root.querySelectorAll(".size-row").forEach((row) => {
      const s = row.getAttribute("data-size");
      const val = row.querySelector("[data-val]");
      const minus = row.querySelector("[data-minus]");
      const plus = row.querySelector("[data-plus]");
      if (val) val.textContent = String(qty[s] || 0);
      if (product.soldOut) {
        if (minus) minus.disabled = true;
        if (plus) plus.disabled = true;
      } else if (minus) minus.disabled = !qty[s];
    });
    const n = totalPieces();
    const pieces = root.querySelector("[data-pieces]");
    const add = root.querySelector("[data-add]");
    if (pieces) pieces.textContent = `${n} peça${n === 1 ? "" : "s"} na linha`;
    if (add) {
      add.disabled = product.soldOut;
      add.classList.toggle("is-ready", n > 0 && !product.soldOut);
    }
  }

  function bump(size, delta) {
    if (product.soldOut) return;
    if (!Object.prototype.hasOwnProperty.call(qty, size)) return;
    qty[size] = Math.max(0, (qty[size] || 0) + delta);
    paint();
  }

  root.addEventListener("click", (e) => {
    const plus = e.target.closest("[data-plus]");
    const minus = e.target.closest("[data-minus]");
    if (plus && root.contains(plus)) {
      e.preventDefault();
      bump(plus.getAttribute("data-size") || plus.closest(".size-row")?.getAttribute("data-size"), 1);
      return;
    }
    if (minus && root.contains(minus)) {
      e.preventDefault();
      bump(minus.getAttribute("data-size") || minus.closest(".size-row")?.getAttribute("data-size"), -1);
    }
  });

  root.querySelector("[data-add]")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (product.soldOut) return;
    const picked = {};
    Object.entries(qty).forEach(([k, v]) => {
      if (v > 0) picked[k] = v;
    });
    const note = root.querySelector("[data-added]");
    if (!Object.keys(picked).length) {
      if (note) {
        note.hidden = false;
        note.textContent = "Escolha a quantidade em pelo menos um tamanho.";
      }
      return;
    }
    addItem(product, picked);
    Object.keys(qty).forEach((k) => {
      qty[k] = 0;
    });
    paint();
    if (note) {
      note.hidden = false;
      const total = qtyTotal();
      note.textContent = `Na grade: ${total} ${total === 1 ? "peça" : "peças"}. Abra Pedido no menu.`;
    }
  });

  root.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.dataset.tab;
      root.querySelectorAll("[data-tab]").forEach((t) =>
        t.setAttribute("aria-selected", String(t === tab))
      );
      root.querySelectorAll("[data-panel]").forEach((p) =>
        p.classList.toggle("is-on", p.dataset.panel === tabId)
      );
    });
  });

  paint();
  }
})();

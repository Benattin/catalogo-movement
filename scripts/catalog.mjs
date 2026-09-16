import { esc, money, foldAccents, pieceMeta, prodHref } from "./html.mjs";

export function catList(brand) {
  return (brand.categories || []).filter((c) => c.id && c.id !== "todos");
}

export function catalogChips(brand) {
  return [
    `<a href="#todos" data-chip="todos" aria-current="true">Todas</a>`,
    ...catList(brand).map(
      (c) => `<a href="#${esc(c.id)}" data-chip="${esc(c.id)}">${esc(c.label)}</a>`
    ),
  ].join("");
}

export function productCard(p, { href, src, i = 1 }) {
  const q = foldAccents(`${p.name} ${p.sku} ${p.color} ${p.line}`);
  return `<article class="card" data-cat="${esc(p.category)}" data-q="${esc(q)}">
        <a href="${href}">
          <div class="card-media">
            ${p.soldOut ? `<span class="badge sold">Esgotado</span>` : `<span class="badge">${esc(p.line)}</span>`}
            <img src="${src}" alt="${esc(p.name)} na cor ${esc(p.color)}" width="480" height="600" ${i === 0 ? 'fetchpriority="high" decoding="sync"' : i < 3 ? 'decoding="async"' : 'loading="lazy" decoding="async"'}>
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
      </article>`;
}

export function catalogBlocks(products, brand, { hrefOf, imgOf }) {
  return catList(brand)
    .map((c) => {
      const list = products.filter((p) => p.category === c.id);
      if (!list.length) return "";
      return `<section class="cat-block" data-cat="${esc(c.id)}">
      <header class="cat-head">
        <h2>${esc(c.label)}</h2>
        <p class="meta" data-block-count>${list.length} peça${list.length === 1 ? "" : "s"}</p>
      </header>
      <div class="grid">${list.map((p, i) => productCard(p, { href: hrefOf(p), src: imgOf(p), i })).join("")}</div>
    </section>`;
    })
    .join("");
}

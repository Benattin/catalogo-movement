import { esc, money, foldAccents, pieceKind, pieceMeta } from "../shared/piece.mjs";
export { esc, money, foldAccents, pieceKind, pieceMeta };

export function imgName(file) {
  const s = String(file);
  return /\.webp$/i.test(s) ? s : s.replace(/\.(jpe?g|png)$/i, ".webp");
}

export function imgAbs(origin, file) {
  return `${origin}/img/${encodeURI(imgName(file))}`;
}

export function depth(path) {
  if (!path || path === "/") return 0;
  const cleaned = path.replace(/^\//, "").replace(/\/$/, "");
  if (!cleaned.includes("/")) return 0;
  return cleaned.split("/").length - 1;
}

export function pretty(path) {
  if (!path || path === "/") return "/";
  return path;
}

export function rel(fromPath, target) {
  const d = depth(fromPath);
  return (d ? "../".repeat(d) : "") + target;
}

export function prodHref(id) {
  return `produto.html?id=${encodeURIComponent(id)}`;
}

export function homeHref(fromPath) {
  return rel(fromPath, "index.html");
}

const KIND_ORDER = ["Blusa", "Calça", "Bermuda", "Camiseta", "Conjunto", "Touca", "Peça"];

export function sortProducts(list, categories) {
  const catRank = Object.fromEntries((categories || []).map((c, i) => [c.id, i]));
  const kindRank = Object.fromEntries(KIND_ORDER.map((k, i) => [k, i]));
  return [...list].sort((a, b) => {
    const cat = (catRank[a.category] ?? 99) - (catRank[b.category] ?? 99);
    if (cat) return cat;
    const kind = (kindRank[pieceKind(a)] ?? 99) - (kindRank[pieceKind(b)] ?? 99);
    if (kind) return kind;
    if (!!a.soldOut !== !!b.soldOut) return a.soldOut ? 1 : -1;
    return String(a.name).localeCompare(String(b.name), "pt-BR");
  });
}

export function sitePayload(brand) {
  const cats = (brand.categories || []).filter((c) => c.id && c.id !== "todos");
  return {
    whatsapp: brand.whatsapp,
    moqSame: brand.moqSame,
    moqMix: brand.moqMix,
    categories: [{ id: "todos", label: "Coleção" }, ...cats],
  };
}

function wordmark(home, ornament) {
  const fl = (side) =>
    `<img class="flourish flourish-${side}" src="${ornament}" alt="" width="80" height="42" aria-hidden="true">`;
  return `<a class="wordmark" href="${home}" aria-label="Movement — ir ao catálogo">${fl("left")}<span>MOVEMENT</span>${fl("right")}</a>`;
}

export function layout({ brand, title, description, path, image, jsonLd, extraHead = "", body, script }) {
  const r = (t) => rel(path, t);
  const home = homeHref(path);
  const mark = wordmark(home, r("brand/arabesco.png"));
  const onSobre = path === "/sobre.html";
  const onPedido = path === "/pedido.html";
  const onPrivacidade = path === "/privacidade.html";
  const canonical = `${brand.url}${pretty(path)}`;
  const cats = (brand.categories || []).filter((c) => c.id && c.id !== "todos");
  const nav = [
    `<a href="${home}" data-cat="todos"><span class="n">01</span>Catálogo</a>`,
    ...cats.map(
      (c, i) =>
        `<a href="${home}#${c.id}" data-cat="${c.id}"><span class="n">${String(i + 2).padStart(2, "0")}</span>${esc(c.label)}</a>`
    ),
  ].join("");
  const footCats = cats
    .map((c) => `<p><a href="${home}#${c.id}">${esc(c.label)}</a></p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#090909">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="${path.startsWith("/produto") ? "product" : "website"}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Movement">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${r("favicon.svg")}" type="image/svg+xml">
<link rel="manifest" href="${r("manifest.webmanifest")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r("assets/styles.css")}">
<meta name="img-root" content="${r("img/")}">
<meta name="products-src" content="${r("data/products.json")}">
${extraHead}
</head>
<body>
<a class="skip" href="#conteudo">Ir para o conteúdo</a>
<div class="rail-backdrop" data-close-rail hidden></div>
<aside class="rail" id="menu">
  ${mark}
  <p class="rail-kicker">Catálogo atacado</p>
  <nav class="rail-nav" aria-label="Coleção">
    ${nav}
    <a href="${r("sobre.html")}" data-page="sobre" ${onSobre ? 'aria-current="page"' : ""}><span class="n">${String(cats.length + 2).padStart(2, "0")}</span>A marca</a>
  </nav>
  <a class="rail-order" href="${r("pedido.html")}" data-page="pedido" ${onPedido ? 'aria-current="page"' : ""} aria-label="Pedido">
    Pedido <span class="cart-count" data-cart-count>0</span>
  </a>
  <button class="rail-close" type="button" data-close-rail>Fechar</button>
</aside>
<div class="stage">
  <header class="topbar">
    <button class="menu-btn" type="button" data-open-rail aria-expanded="false" aria-controls="menu">Menu</button>
    ${mark}
    <a class="top-order" href="${r("pedido.html")}" aria-label="Pedido">Pedido <span class="cart-count" data-cart-count>0</span></a>
  </header>
  <main id="conteudo">${body}</main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          ${mark}
          <p>Streetwear com grade e preço de atacado. Mínimo de ${brand.moqSame} iguais ou ${brand.moqMix} mistas. O pedido fecha no WhatsApp.</p>
          <p>${esc(brand.city)}${brand.hours ? ` · ${esc(brand.hours)}` : ""}</p>
        </div>
        <div>
          <h2>Pedido</h2>
          <p><a href="${r("pedido.html")}">Montar pedido</a></p>
          <p><a href="https://wa.me/${brand.whatsapp}" rel="noopener noreferrer">WhatsApp</a></p>
          ${brand.email ? `<p><a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a></p>` : ""}
          ${brand.instagram ? `<p><a href="${esc(brand.instagram)}" rel="noopener noreferrer">Instagram</a></p>` : ""}
        </div>
        <div>
          <h2>Linhas</h2>
          ${footCats}
          <p><a href="${r("sobre.html")}" ${onSobre ? 'aria-current="page"' : ""}>A marca</a></p>
          <p><a href="${r("privacidade.html")}" ${onPrivacidade ? 'aria-current="page"' : ""}>Privacidade</a></p>
        </div>
      </div>
      <p class="legal">© ${new Date().getFullYear()} ${esc(brand.legalName || brand.name)}. Catálogo para lojistas. Pedido via WhatsApp; a grade fica só neste aparelho.</p>
    </div>
  </footer>
</div>
<template id="json-ld">${JSON.stringify(jsonLd)}</template>
<script src="${r("assets/lib.js")}"></script>
<script src="${r("assets/site.js")}"></script>
<script src="${r("assets/cart.js")}"></script>
<script src="${r("assets/nav.js")}" defer></script>
${script ? `<script src="${r(script)}" defer></script>` : ""}
</body>
</html>`;
}

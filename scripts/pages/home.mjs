import { esc, prodHref, rel } from "../html.mjs";
import { catalogBlocks, catalogChips } from "../catalog.mjs";
import { absImg, brand, locImg, orgLd, page, products } from "../ctx.mjs";

export function homePage() {
  const path = "/";
  const r = (t) => rel(path, t);
  const { moqSame, moqMix } = brand;
  const lookIds = [
    "bermuda-jeans-movement",
    "blusa-moletom-movement",
    "camiseta-boxy-legacy",
    "touca-arabesco-preta",
  ];
  const looks = lookIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const lookStrip = looks
    .map(
      (p) => `<a href="${r(prodHref(p.id))}">
        <img src="${locImg(path, p.hero)}" alt="${esc(p.name)}" width="280" height="360" decoding="async">
        <span>${esc(p.line)}</span>
      </a>`
    )
    .join("");
  const blocks = catalogBlocks(products, brand, {
    hrefOf: (p) => r(prodHref(p.id)),
    imgOf: (p) => locImg(path, p.hero),
  });

  return page({
    title: "Movement — Catálogo atacado streetwear",
    description:
      "Catálogo atacado Movement: moletom, jeans, camisetas e toucas. Preço de varejo e de atacado. Pedido mínimo de 6 peças iguais ou 12 mistas, via WhatsApp.",
    path,
    image: absImg(products[0].hero),
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        orgLd,
        {
          "@type": "CollectionPage",
          name: "Catálogo atacado Movement",
          url: brand.url + "/",
          description: brand.tagline,
        },
        {
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${brand.url}/produto.html?id=${p.id}`,
            name: p.name,
          })),
        },
      ],
    },
    extraHead: `<link rel="preload" as="image" href="${locImg(path, products[0].hero)}" fetchpriority="high">`,
    script: "assets/catalog.js",
    body: `
<section class="hero">
  <div class="wrap">
    <div class="hero-frame">
      <img class="flourish flourish-left" src="${r("brand/arabesco.png")}" alt="" width="180" height="48" aria-hidden="true">
      <a class="wordmark" href="#catalogo" aria-label="Movement — coleção"><span>MOVEMENT</span></a>
      <img class="flourish flourish-right" src="${r("brand/arabesco.png")}" alt="" width="180" height="48" aria-hidden="true">
    </div>
    <div class="hero-copy">
      <p class="kicker">Catálogo atacado</p>
      <p class="hero-lead">Grade e dois preços. O pedido fecha no WhatsApp.</p>
      <p class="hero-rules"><strong>${moqSame} iguais</strong> ou <strong>${moqMix} mistas</strong> no pedido · abaixo disso, vale o varejo</p>
      <ol class="how">
        <li><span>01</span><strong>Linha</strong> Moletom, jeans, camiseta ou touca</li>
        <li><span>02</span><strong>Grade</strong> Quantidade por tamanho na ficha</li>
        <li><span>03</span><strong>WhatsApp</strong> Envie pelo <a href="${r("pedido.html")}">Pedido</a></li>
      </ol>
    </div>
    <div class="look-strip">${lookStrip}</div>
  </div>
</section>
<section class="catalog wrap" id="catalogo">
  <div class="toolbar">
    <div>
      <p class="kicker">Peças</p>
      <h1 class="catalog-title" data-cat-title>Coleção</h1>
      <p class="meta" data-cat-count>${products.length} peças</p>
    </div>
    <label class="visually-hidden" for="busca">Buscar</label>
    <input class="search" id="busca" data-search type="search" placeholder="Peça ou cor" autocomplete="off">
    <nav class="cat-chips" aria-label="Linhas">${catalogChips(brand)}</nav>
  </div>
  <div data-catalog>${blocks}</div>
  <p class="empty-cat" data-empty hidden>Nenhuma peça nesta linha.</p>
</section>
<section class="wrap faq" id="faq">
  <p class="kicker">Lojista</p>
  <h2>Dúvidas do pedido</h2>
  <details open>
    <summary>Qual o mínimo?</summary>
    <p>O atacado vale a partir de ${moqSame} peças do mesmo modelo ou ${moqMix} peças misturadas no pedido. Abaixo disso, cobra-se o preço de varejo.</p>
  </details>
  <details>
    <summary>Como fecho o pedido?</summary>
    <p>Monte a grade nas fichas, abra <a href="${r("pedido.html")}">Pedido</a> e envie no WhatsApp. A mensagem já sai com peças, tamanhos e total.</p>
  </details>
  <details>
    <summary>Frete e prazo?</summary>
    <p>Frete e prazo são combinados no WhatsApp depois da grade. Atendimento ${esc(brand.hours || "em horário comercial")} · ${esc(brand.city)}.</p>
  </details>
  <details>
    <summary>As medidas conferem?</summary>
    <p>As tabelas são referência de grade. Confirme o caimento no WhatsApp antes de fechar o volume.</p>
  </details>
</section>`,
  });
}

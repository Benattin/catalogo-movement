import { esc, homeHref, rel } from "../html.mjs";
import { absImg, brand, orgLd, page, products } from "../ctx.mjs";

export function pedidoPage() {
  const path = "/pedido.html";
  return page({
    title: "Seu pedido | Movement atacado",
    description:
      "Revise os tamanhos, confira o atacado ou o varejo e envie o pedido Movement pelo WhatsApp.",
    path,
    image: absImg(products[0].hero),
    jsonLd: orgLd,
    script: "assets/pedido.js",
    body: `<div class="wrap cart-page">
      <p class="kicker">WhatsApp</p>
      <h1>Pedido</h1>
      <p class="lead">Revise tamanhos e quantidades. O envio libera com ${brand.moqSame} peças iguais ou ${brand.moqMix} mistas.</p>
      <div class="empty" data-empty-cart>
        <p>A grade está vazia.</p>
        <a class="btn" href="${homeHref(path)}#catalogo">Escolher peças</a>
      </div>
      <div class="order-sheet" data-sheet hidden>
        <div class="ticket" data-cart-list></div>
        <div class="totals" data-summary></div>
      </div>
      <div class="order-actions" data-actions hidden>
        <p class="note" data-moq-hint></p>
        <button class="btn btn-full btn-send" data-wa type="button" disabled>Enviar no WhatsApp</button>
        <button class="btn btn-ghost light btn-full" data-clear type="button">Limpar grade</button>
      </div>
    </div>`,
  });
}

export function sobrePage() {
  return page({
    title: "A marca | Movement streetwear",
    description:
      "A Movement é uma marca de streetwear atacado. Moletom 3 cabos, jeans baggy e camisetas boxy para lojistas.",
    path: "/sobre.html",
    image: absImg(products[0].hero),
    jsonLd: orgLd,
    body: `<div class="wrap about">
      <p class="kicker">Desde o ateliê</p>
      <h1>MOVEMENT</h1>
      <p class="lead">Streetwear para lojistas. Grade e dois preços — o pedido fecha no WhatsApp.</p>
      <dl class="facts">
        <div><dt>Iguais</dt><dd>${brand.moqSame} peças</dd></div>
        <div><dt>Mistas</dt><dd>${brand.moqMix} peças</dd></div>
        <div><dt>Praça</dt><dd>${esc(brand.city)}</dd></div>
        <div><dt>Horário</dt><dd>${esc(brand.hours || "Horário comercial")}</dd></div>
      </dl>
      <p>Linhas MJ Basic, Signature, Baggy, Legacy, Believe, Arabesco e Canelada. Moletom 3 cabos, jeans 100% algodão, malhão premium.</p>
      <p>Dúvidas de caimento e prazo se resolvem na conversa. E-mail: <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>.</p>
      <p class="about-cta"><a class="btn" href="${homeHref("/sobre.html")}#catalogo">Abrir coleção</a> <a class="btn btn-ghost light" href="${rel("/sobre.html", "pedido.html")}">Montar pedido</a></p>
    </div>`,
  });
}

export function privacidadePage() {
  return page({
    title: "Privacidade | Movement",
    description:
      "Como o catálogo Movement trata a grade no aparelho e o pedido enviado pelo WhatsApp.",
    path: "/privacidade.html",
    image: absImg(products[0].hero),
    jsonLd: orgLd,
    body: `<div class="wrap about">
      <p class="kicker">LGPD</p>
      <h1>Privacidade</h1>
      <p class="lead">A grade fica neste aparelho. O pedido só sai quando você envia no WhatsApp.</p>
      <p>Não criamos conta nem recebemos cartão neste catálogo. Nome das peças, tamanhos e total vão para o WhatsApp da Movement (${esc(brand.whatsapp)}) só para montar o pedido. Não usamos esses dados para anúncio.</p>
      <p>Não há cookies de análise. Dúvidas: <a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a> ou <a href="https://wa.me/${brand.whatsapp}" rel="noopener noreferrer">WhatsApp</a>.</p>
      <p class="note">${esc(brand.legalName || brand.name)} · ${esc(brand.city)}${brand.hours ? ` · ${esc(brand.hours)}` : ""}.</p>
    </div>`,
  });
}

export function productPage() {
  const path = "/produto.html";
  return page({
    title: "Peça | Movement atacado",
    description:
      "Ficha da peça Movement: grade, preço de atacado e varejo. Pedido pelo WhatsApp.",
    path,
    image: absImg(products[0].hero),
    jsonLd: orgLd,
    script: "assets/product.js",
    body: `<div data-pdp></div>
<script type="application/json" id="products-data">${JSON.stringify(products)}</script>`,
  });
}

export function notFoundPage() {
  return page({
    title: "Fora da coleção | Movement",
    description: "Esta página não existe no catálogo Movement.",
    path: "/404.html",
    image: absImg(products[0].hero),
    jsonLd: orgLd,
    body: `<div class="wrap about">
      <p class="kicker">404</p>
      <h1>Fora da coleção</h1>
      <p class="lead">Esta página não existe no catálogo Movement.</p>
      <p class="about-cta"><a class="btn" href="index.html">Voltar ao catálogo</a></p>
    </div>`,
  });
}

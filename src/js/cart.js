(() => {
  const site = JSON.parse(document.getElementById("site-data")?.textContent || "{}");
  const KEY = "movement-carrinho-v2";
  const MOQ_SAME = Number(site.moqSame) || 6;
  const MOQ_MIX = Number(site.moqMix) || 12;
  const WA = site.whatsapp || "";

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function money(n) {
    return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function pieceMeta(p) {
    const n = String(p.name || "").toLowerCase();
    let kind = "Peça";
    if (n.includes("bermuda")) kind = "Bermuda";
    else if (n.includes("blusa")) kind = "Blusa";
    else if (n.includes("calça") || n.includes("calca")) kind = "Calça";
    else if (n.includes("camiseta")) kind = "Camiseta";
    else if (n.includes("conjunto")) kind = "Conjunto";
    else if (n.includes("touca")) kind = "Touca";
    return p.color ? `MJ ${kind} · ${p.color}` : `MJ ${kind}`;
  }
  function imgSrc(file) {
    const root = document.querySelector('meta[name="img-root"]')?.content || "img/";
    const name = /\.webp$/i.test(file)
      ? file
      : String(file).replace(/\.(jpe?g|png)$/i, ".webp");
    return root + encodeURI(name);
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function qtyOf(item) {
    return Object.values(item.sizes || {}).reduce((a, b) => a + Number(b || 0), 0);
  }

  function qtyTotal(items = readCart()) {
    return items.reduce((s, i) => s + qtyOf(i), 0);
  }

  function isAtacado(item, items = readCart()) {
    return qtyTotal(items) >= MOQ_MIX || qtyOf(item) >= MOQ_SAME;
  }

  function lineTotal(item, items = readCart()) {
    const unit = isAtacado(item, items) ? item.atacado : item.varejo;
    return unit * qtyOf(item);
  }

  function cartTotal(items = readCart()) {
    return items.reduce((s, i) => s + lineTotal(i, items), 0);
  }

  function addItem(product, sizes) {
    const next = readCart();
    const i = next.findIndex((x) => x.id === product.id);
    const prev = i >= 0 ? next[i].sizes || {} : {};
    const merged = { ...prev };
    Object.entries(sizes || {}).forEach(([k, v]) => {
      merged[k] = (Number(merged[k]) || 0) + Number(v || 0);
    });
    Object.keys(merged).forEach((k) => {
      if (!merged[k]) delete merged[k];
    });
    const row = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      color: product.color,
      hero: product.hero,
      atacado: product.atacado,
      varejo: product.varejo,
      sizes: merged,
    };
    if (i >= 0) next[i] = row;
    else next.push(row);
    writeCart(next.filter((x) => qtyOf(x) > 0));
  }

  function meetsMoq(items = readCart()) {
    return qtyTotal(items) >= MOQ_MIX || items.some((i) => qtyOf(i) >= MOQ_SAME);
  }

  function waUrl(items = readCart()) {
    if (!meetsMoq(items) || !WA) return null;
    let t = "Olá! Quero fazer este pedido:%0A%0A";
    items.forEach((item) => {
      const kind = isAtacado(item, items) ? "ATACADO" : "VAREJO";
      t += `*${item.name}* (${item.sku}) — ${kind}%0A`;
      Object.entries(item.sizes).forEach(([size, q]) => {
        t += `Tamanho ${size}: ${q}%0A`;
      });
      t += `Subtotal: ${money(lineTotal(item, items))}%0A%0A`;
    });
    t += `Total de peças: ${qtyTotal(items)}%0A`;
    t += `*Total do pedido: ${money(cartTotal(items))}*`;
    return `https://wa.me/${WA}?text=${t}`;
  }

  function bindCartBadge() {
    const els = document.querySelectorAll("[data-cart-count]");
    const paint = () => {
      const n = qtyTotal();
      els.forEach((el) => {
        el.textContent = String(n);
        const wrap = el.closest("a");
        if (wrap) wrap.setAttribute("aria-label", n ? `Pedido, ${n} ${n === 1 ? "peça" : "peças"}` : "Pedido");
      });
    };
    paint();
    window.addEventListener("cart-updated", paint);
  }

  window.MJ = {
    site,
    moqSame: MOQ_SAME,
    moqMix: MOQ_MIX,
    money,
    esc,
    imgSrc,
    pieceMeta,
    readCart,
    writeCart,
    qtyOf,
    qtyTotal,
    isAtacado,
    lineTotal,
    cartTotal,
    addItem,
    clearCart: () => writeCart([]),
    meetsMoq,
    waUrl,
    bindCartBadge,
  };

  bindCartBadge();
})();

(() => {
  const lib = window.MJLib || {};
  const site = window.MJ_SITE || {};
  const ldTpl = document.getElementById("json-ld");
  if (ldTpl) {
    try {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.textContent = JSON.stringify(JSON.parse(ldTpl.innerHTML));
      document.head.appendChild(el);
    } catch {
      /* ignore */
    }
  }
  const KEY = "movement-carrinho-v2";
  const MOQ_SAME = Number(site.moqSame) || 6;
  const MOQ_MIX = Number(site.moqMix) || 12;
  const WA = site.whatsapp || "";
  const esc = lib.esc;
  const money = lib.money;
  const pieceMeta = lib.pieceMeta;
  const foldAccents = lib.foldAccents;

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

  function setSizeQty(id, size, qty) {
    const next = readCart();
    const i = next.findIndex((x) => x.id === id);
    if (i < 0) return;
    const sizes = { ...(next[i].sizes || {}) };
    const n = Math.max(0, Math.floor(Number(qty) || 0));
    if (n) sizes[size] = n;
    else delete sizes[size];
    next[i] = { ...next[i], sizes };
    writeCart(next.filter((x) => qtyOf(x) > 0));
  }

  function bumpSize(id, size, delta) {
    const item = readCart().find((x) => x.id === id);
    if (!item) return;
    setSizeQty(id, size, (Number(item.sizes?.[size]) || 0) + Number(delta || 0));
  }

  function removeItem(id) {
    writeCart(readCart().filter((i) => i.id !== id));
  }

  function meetsMoq(items = readCart()) {
    return qtyTotal(items) >= MOQ_MIX || items.some((i) => qtyOf(i) >= MOQ_SAME);
  }

  function waUrl(items = readCart()) {
    if (!meetsMoq(items) || !WA) return null;
    const lines = ["Olá! Quero fazer este pedido:", ""];
    items.forEach((item) => {
      const kind = isAtacado(item, items) ? "ATACADO" : "VAREJO";
      lines.push(`*${item.name}* (${item.sku}) — ${kind}`);
      Object.entries(item.sizes).forEach(([size, q]) => {
        lines.push(`Tamanho ${size}: ${q}`);
      });
      lines.push(`Subtotal: ${money(lineTotal(item, items))}`, "");
    });
    lines.push(`Total de peças: ${qtyTotal(items)}`);
    lines.push(`*Total do pedido: ${money(cartTotal(items))}*`);
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
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
    foldAccents,
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
    setSizeQty,
    bumpSize,
    removeItem,
    clearCart: () => writeCart([]),
    meetsMoq,
    waUrl,
    bindCartBadge,
  };

  bindCartBadge();
})();

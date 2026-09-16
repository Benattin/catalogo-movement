(() => {
  const api = window.MJ;
  if (!api) return;
  const {
    cartTotal,
    clearCart,
    esc,
    imgSrc,
    isAtacado,
    lineTotal,
    meetsMoq,
    money,
    moqMix,
    moqSame,
    pieceMeta,
    qtyTotal,
    readCart,
    waUrl,
    writeCart,
  } = api;

  const list = document.querySelector("[data-cart-list]");
  const summary = document.querySelector("[data-summary]");
  const empty = document.querySelector("[data-empty-cart]");
  const send = document.querySelector("[data-wa]");
  const clear = document.querySelector("[data-clear]");
  const actions = document.querySelector("[data-actions]");
  const sheet = document.querySelector("[data-sheet]");
  const hint = document.querySelector("[data-moq-hint]");
  if (!list || !send) return;

  function render() {
    const items = readCart();
    const n = qtyTotal(items);
    if (empty) empty.hidden = items.length > 0;
    if (sheet) sheet.hidden = items.length === 0;
    if (summary) summary.hidden = items.length === 0;
    if (actions) actions.hidden = items.length === 0;
    if (!items.length) {
      send.disabled = true;
      return;
    }
    list.hidden = false;
    list.innerHTML = items
      .map((item) => {
        const atacado = isAtacado(item, items);
        const kind = atacado ? "Atacado" : "Varejo";
        const unit = atacado ? item.atacado : item.varejo;
        const sizes = Object.entries(item.sizes)
          .map(
            ([s, q]) =>
              `<li><span>${esc(s)}</span><span>${q} un</span><span>${money(unit * q)}</span></li>`
          )
          .join("");
        return `<article class="cart-item">
          <img src="${imgSrc(item.hero)}" alt="${esc(item.name)}" width="88" height="110">
          <div>
            <p class="meta">${esc(pieceMeta(item))}</p>
            <strong>${esc(item.name)}</strong>
            <ul class="cart-grade">${sizes}</ul>
          </div>
          <div class="cart-side">
            <p class="line-sum">${money(lineTotal(item, items))}</p>
            <span class="cart-tag${atacado ? " is-atacado" : ""}">${kind}</span>
            <button class="cart-drop" data-remove="${esc(item.id)}" type="button">Retirar</button>
          </div>
        </article>`;
      })
      .join("");
    const ok = meetsMoq(items);
    const pct = Math.min(100, Math.round((n / moqMix) * 100));
    if (summary) {
      summary.innerHTML = `
        <p><span>Peças na grade</span><span>${n}</span></p>
        <div class="moq-meter${ok ? " is-ok" : ""}" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <p class="grand"><span>Total</span><span>${money(cartTotal(items))}</span></p>
        <p class="meta">${ok ? "Mínimo de atacado atingido." : `Faltam peças: ${moqSame} do mesmo modelo ou ${moqMix} no pedido.`}</p>
      `;
    }
    if (hint) {
      hint.textContent = ok
        ? "Pronto para enviar no WhatsApp."
        : `O envio libera com ${moqSame} peças do mesmo modelo ou ${moqMix} no pedido.`;
    }
    send.disabled = !ok;
    send.dataset.href = waUrl(items) || "";
  }

  list.addEventListener("click", (e) => {
    const id = e.target.closest("[data-remove]")?.dataset.remove;
    if (!id) return;
    writeCart(readCart().filter((i) => i.id !== id));
    render();
  });

  send.addEventListener("click", () => {
    const href = send.dataset.href;
    if (href) window.open(href, "_blank", "noopener");
  });

  clear?.addEventListener("click", () => {
    if (!readCart().length) return;
    if (!window.confirm("Limpar toda a grade?")) return;
    clearCart();
    render();
  });

  render();
})();

# Movement — catálogo atacado (site novo)

Catálogo estático para lojistas. Não usa o site antigo da Netlify.

**URL:** https://benattin.github.io/catalogo-movement/

Não edite `dist/`. Fonte → `npm run build`.

| O que mudar | Onde |
|---|---|
| WhatsApp, MOQ, e-mail, peças | `data/brand.json` |
| Peça, preço, foto, grade | `data/products.json` |
| Menu / rodapé HTML | `scripts/html.mjs` |
| Home | `scripts/pages/home.mjs` |
| Ficha (um HTML só) | `src/js/product.js` + `produto.html?id=` |
| Pedido / marca / privacidade | `scripts/pages/site.mjs` |
| Carrinho / atacado | `src/js/cart.js` |
| Menu mobile | `src/js/nav.js` |
| Busca / filtro | `src/js/catalog.js` |
| Tela do pedido | `src/js/pedido.js` |
| Visual | `src/css/styles.css` |
| Fotos | `public/img/` |
| Checklist mobile | `docs/MOBILE-CHECKLIST.md` |

```bash
npm run build
npm run dev
```

Peça nova: copie um objeto em `data/products.json`, coloque a foto em `public/img/` e rode `npm run build`. Não crie HTML por produto.

Abra `dist/index.html` (não a pasta `dist`).

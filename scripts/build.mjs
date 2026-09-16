import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import * as piece from "../shared/piece.mjs";
import { brand, copy, dist, products, root, write } from "./ctx.mjs";
import { sitePayload } from "./html.mjs";
import { homePage } from "./pages/home.mjs";
import { notFoundPage, pedidoPage, privacidadePage, productPage, sobrePage } from "./pages/site.mjs";

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

write("index.html", homePage());
write("produto.html", productPage());
write("pedido.html", pedidoPage());
write("sobre.html", sobrePage());
write("privacidade.html", privacidadePage());
write("404.html", notFoundPage());
write("data/products.json", JSON.stringify(products, null, 2) + "\n");
write("assets/site.js", `window.MJ_SITE = ${JSON.stringify(sitePayload(brand), null, 2)};\n`);
write(
  "assets/lib.js",
  `(() => {\n${piece.foldAccents.toString()}\n${piece.esc.toString()}\n${piece.money.toString()}\n${piece.pieceKind.toString()}\n${piece.pieceMeta.toString()}\nwindow.MJLib = { esc, money, foldAccents, pieceKind, pieceMeta };\n})();\n`
);

copy("src/css/styles.css", "assets/styles.css");
copy("src/js/cart.js", "assets/cart.js");
copy("src/js/nav.js", "assets/nav.js");
copy("src/js/catalog.js", "assets/catalog.js");
copy("src/js/product.js", "assets/product.js");
copy("src/js/pedido.js", "assets/pedido.js");
copy("public/favicon.svg", "favicon.svg");
copy("public/brand/arabesco.png", "brand/arabesco.png");
copy("serve.json", "serve.json");
for (const file of readdirSync(join(root, "public/img"))) {
  if (!/\.webp$/i.test(file)) continue;
  copy(`public/img/${file}`, `img/${file}`);
}

write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${brand.url}/sitemap.xml\n`);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${brand.url}/</loc><changefreq>weekly</changefreq><priority>1</priority></url>
<url><loc>${brand.url}/sobre.html</loc><changefreq>monthly</changefreq></url>
<url><loc>${brand.url}/pedido.html</loc><changefreq>weekly</changefreq></url>
<url><loc>${brand.url}/privacidade.html</loc><changefreq>yearly</changefreq></url>
${products.map((p) => `<url><loc>${brand.url}/produto.html?id=${p.id}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
</urlset>`
);
write(
  "manifest.webmanifest",
  JSON.stringify({
    name: "Movement Catálogo",
    short_name: "Movement",
    start_url: "./index.html",
    display: "browser",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    lang: "pt-BR",
    icons: [{ src: "./favicon.svg", sizes: "any", type: "image/svg+xml" }],
  })
);

console.log(`Built ${products.length} products → dist/`);

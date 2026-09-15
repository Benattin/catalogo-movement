import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { imgAbs, imgName, layout, rel } from "./html.mjs";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const dist = join(root, "dist");

export const brand = JSON.parse(readFileSync(join(root, "data/brand.json"), "utf8"));
export const products = JSON.parse(readFileSync(join(root, "data/products.json"), "utf8"));

export const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: brand.url,
  description: brand.tagline,
  sameAs: [brand.instagram, `https://wa.me/${brand.whatsapp}`].filter(Boolean),
};

export function absImg(file) {
  return imgAbs(brand.url, file);
}

export function locImg(path, file) {
  return rel(path, `img/${imgName(file)}`);
}

export function page(opts) {
  return layout({ brand, ...opts });
}

export function write(path, html) {
  const full = join(dist, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
}

export function copy(src, dest) {
  const full = join(dist, dest);
  mkdirSync(dirname(full), { recursive: true });
  copyFileSync(join(root, src), full);
}

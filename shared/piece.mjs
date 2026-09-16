/** Helpers compartilhados: build (Node) e browser (via assets/lib.js). */

export function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function money(n) {
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function foldAccents(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function pieceKind(p) {
  const n = foldAccents(p?.name || "");
  if (n.includes("bermuda")) return "Bermuda";
  if (n.includes("blusa")) return "Blusa";
  if (n.includes("calca")) return "Calça";
  if (n.includes("camiseta")) return "Camiseta";
  if (n.includes("conjunto")) return "Conjunto";
  if (n.includes("touca")) return "Touca";
  return "Peça";
}

export function pieceMeta(p) {
  return p?.color ? `MJ ${pieceKind(p)} · ${p.color}` : `MJ ${pieceKind(p)}`;
}

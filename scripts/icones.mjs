// Génère les icônes de l'appli (PWA, iPhone) à partir de public/favicon.svg.
// Usage : npm run icons
import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/favicon.svg");
const out = (nom, taille, marge = 0) =>
  sharp(svg, { density: 384 })
    .resize(taille - 2 * marge, taille - 2 * marge)
    .extend({ top: marge, bottom: marge, left: marge, right: marge, background: "#FFF8EE" })
    .png().toFile(`public/${nom}`);

await out("pwa-192x192.png", 192);
await out("pwa-512x512.png", 512);
await out("maskable-icon-512x512.png", 512, 64); // marge de sécurité pour les icônes « maskable »
await out("apple-touch-icon-180x180.png", 180, 12);
console.log("Icônes générées dans public/");

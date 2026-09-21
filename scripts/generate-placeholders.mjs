// Generates elegant abstract SVG placeholder visuals for LallaZina demo content.
// Run: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const GOLD = "#c9a66b";
const IVORY = "#faf7f2";

function card({ w, h, from, to, label, sublabel = "LallaZina", angle = 135 }) {
  const cx1 = w * 0.25;
  const cy1 = h * 0.3;
  const cx2 = w * 0.78;
  const cy2 = h * 0.72;
  const r1 = Math.max(w, h) * 0.38;
  const r2 = Math.max(w, h) * 0.3;
  const fontSize = Math.round(Math.min(w, h) * 0.058);
  const subFontSize = Math.round(fontSize * 0.32);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${Math.round(w * 0.03)}" />
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" />
  <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="#ffffff" opacity="0.14" filter="url(#soft)" />
  <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="#201c1a" opacity="0.08" filter="url(#soft)" />
  <g opacity="0.9">
    <line x1="${w * 0.5 - 46}" y1="${h * 0.52}" x2="${w * 0.5 + 46}" y2="${h * 0.52}" stroke="${GOLD}" stroke-width="2" />
  </g>
  <text x="50%" y="${h * 0.47}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="${IVORY}" letter-spacing="1">${label}</text>
  <text x="50%" y="${h * 0.585}" text-anchor="middle" font-family="Georgia, serif" font-size="${subFontSize}" fill="${IVORY}" letter-spacing="4" opacity="0.85">${sublabel.toUpperCase()}</text>
</svg>`;
}

const categories = [
  { slug: "robes", label: "Robes", from: "#d9a9a0", to: "#ece1cd" },
  { slug: "ensembles", label: "Ensembles", from: "#d9c9a8", to: "#faf7f2" },
  { slug: "hauts", label: "Hauts", from: "#c9a66b", to: "#d9a9a0" },
  { slug: "pantalons", label: "Pantalons", from: "#b7a99a", to: "#faf7f2" },
  { slug: "vestes-manteaux", label: "Vestes & Manteaux", from: "#b9776c", to: "#d9c9a8" },
  { slug: "accessoires", label: "Accessoires", from: "#c9a66b", to: "#faf7f2" },
];

// Category tiles (used on homepage + shop filters)
for (const c of categories) {
  const svg = card({ w: 800, h: 1000, from: c.from, to: c.to, label: c.label, angle: 135 });
  writeFileSync(path.join(outDir, `category-${c.slug}.svg`), svg);
}

// 3 product gallery placeholders per category (slightly different angle/label for variety)
for (const c of categories) {
  for (let i = 1; i <= 3; i++) {
    const svg = card({
      w: 900,
      h: 1125,
      from: c.from,
      to: c.to,
      label: c.label,
      sublabel: `Vue ${i}`,
      angle: 135 + i * 20,
    });
    writeFileSync(path.join(outDir, `product-${c.slug}-${i}.svg`), svg);
  }
}

// Hero banner (landscape)
writeFileSync(
  path.join(outDir, "hero.svg"),
  card({ w: 1920, h: 1080, from: "#d9a9a0", to: "#201c1a", label: "LallaZina", sublabel: "Nouvelle collection", angle: 120 })
);

// Promo banner (wide)
writeFileSync(
  path.join(outDir, "promo-banner.svg"),
  card({ w: 1920, h: 700, from: "#201c1a", to: "#b9776c", label: "Offres du moment", sublabel: "Jusqu'à -30%", angle: 110 })
);

// About page image
writeFileSync(
  path.join(outDir, "about.svg"),
  card({ w: 1200, h: 1400, from: "#ece1cd", to: "#d9a9a0", label: "LallaZina", sublabel: "Notre histoire", angle: 140 })
);

console.log("Placeholders generated in", outDir);

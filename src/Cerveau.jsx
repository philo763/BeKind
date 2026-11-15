/* Choix de l'hormone au début d'un tirage : un camembert en forme de cerveau.
   Chaque hormone y prend sa part du total des scores d'hormones (S.hs), avec un fondu entre les parts. */
import { HN } from "./data.js";
import { S } from "./store.js";

/* Cerveau vu de profil (avant à gauche), dans un repère 240 × 200 */
const CONTOUR = "M60 150C30 150 14 128 20 106C6 90 12 64 32 56C34 32 60 18 84 24C98 8 128 6 144 18C164 10 192 20 198 42C222 50 232 76 222 96C234 114 224 140 202 144C200 162 178 170 164 160L160 184Q150 192 142 184L140 158C120 160 100 150 86 154C76 158 66 154 60 150Z";
const PLIS = [
  "M120 20C110 48 130 70 116 102",
  "M48 122C80 108 110 114 140 102C160 94 174 110 196 102",
  "M36 82C52 72 60 94 78 86",
  "M66 48C78 64 96 54 100 76",
  "M150 36C140 58 162 64 152 86",
  "M178 64C196 74 190 94 212 96",
  "M88 136C104 126 120 140 134 130",
  "M172 148C184 140 198 140 206 144",
];
const MASQUE = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" preserveAspectRatio="none"><path d="${CONTOUR}"/></svg>`)}")`;

/* Parts en pourcentages entiers dont la somme fait 100 (plus forts restes) */
function parts() {
  const tot = S.hs.reduce((x, y) => x + Math.max(0, y), 0);
  const brut = S.hs.map((v) => (tot ? (Math.max(0, v) / tot) * 100 : 25));
  const pc = brut.map(Math.floor);
  let reste = 100 - pc.reduce((x, y) => x + y, 0);
  brut.map((v, h) => [v - Math.floor(v), h]).sort((x, y) => y[0] - x[0]).forEach(([, h]) => { if (reste > 0) { pc[h]++; reste--; } });
  return pc;
}

/* Dégradé conique : chaque part garde sa couleur au centre et se fond dans sa voisine sur les bords */
function degrade(pc) {
  const p = [0, 1, 2, 3].filter((h) => pc[h] > 0).map((h) => ({ h, w: pc[h] * 3.6 }));
  if (p.length === 1) return `var(--s${p[0].h})`;
  let a = 0;
  const arrets = p.map(({ h, w }) => {
    const f = Math.min(16, w / 3);
    const s = `var(--s${h}) ${(a + f).toFixed(1)}deg ${(a + w - f).toFixed(1)}deg`;
    a += w;
    return s;
  });
  const joint = `color-mix(in srgb, var(--s${p[p.length - 1].h}), var(--s${p[0].h}))`;
  return `conic-gradient(from 0deg at 49% 46%, ${joint} 0deg, ${arrets.join(", ")}, ${joint} 360deg)`;
}

export default function Cerveau({ onPick }) {
  const pc = parts();
  return (
    <section className="card" style={{ background: "var(--c4)" }}>
      <h2>Quelle hormone te fait envie ?</h2>
      <p className="mu">Ton cerveau, selon ce que tu as déjà fait. Fie-toi à ton instinct.</p>
      <div className="brain" role="img" aria-label={"Scores : " + HN.map((n, h) => `${n} ${S.hs[h]}`).join(", ")}>
        <div className="brain-fond" style={{ background: degrade(pc), WebkitMaskImage: MASQUE, maskImage: MASQUE }} />
        <svg viewBox="0 0 240 200" preserveAspectRatio="none" aria-hidden="true">
          <g className="brain-plis">{PLIS.map((d) => <path key={d} d={d} />)}</g>
          <path className="brain-bord" d={CONTOUR} />
        </svg>
      </div>
      <ul className="legende">
        {HN.map((n, h) => (
          <li key={h}>
            <button type="button" onClick={() => onPick(h)} style={{ background: `var(--h${h})`, "--k": `var(--s${h})` }}>
              <span className="dot" style={{ background: `var(--s${h})` }} />
              <span className="lg-n">{n}</span>
              <span className="lg-p">{S.hs[h]} {Math.abs(S.hs[h]) > 1 ? "pts" : "pt"}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

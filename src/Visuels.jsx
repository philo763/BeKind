/* Pages visuelles du carnet : Mon ciel (ressentis), Mon sac (vide-sac),
   Mon miroir (self love) et Mes montagnes (victoires). Chaque entrée ajoute un élément
   et rapporte une pièce, à dépenser dans la boutique de la page. */
import { useRef, useState } from "react";
import { cap } from "./ui.jsx";
import { commit } from "./store.js";
import { MONNAIES, achats, acheter, choisir, elements, hasard, libelle, solde } from "./monnaies.js";

const date = (t) => cap(new Date(t).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));

/* Glisser-déposer, comme les fleurs du jardin : au-delà de 6 px, c'est un déplacement ;
   sinon c'est un simple toucher (le clic sélectionne l'élément). */
function useGlisser() {
  const g = useRef(null), bouge = useRef(false);
  const props = (bouger, finir) => ({
    onPointerDown: (ev) => {
      g.current = { el: ev.currentTarget, sx: ev.clientX, sy: ev.clientY, dx: 0, dy: 0, moved: false, zone: ev.currentTarget.closest("[data-zone]").getBoundingClientRect() };
      try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch { /* ignoré */ }
    },
    onPointerMove: (ev) => {
      const d = g.current; if (!d) return;
      d.dx = ev.clientX - d.sx; d.dy = ev.clientY - d.sy;
      if (!d.moved) { if (Math.hypot(d.dx, d.dy) < 6) return; d.moved = true; d.el.classList.add("drag"); }
      bouger(d);
    },
    onPointerUp: () => { const d = g.current; g.current = null; if (d && d.moved) { d.el.classList.remove("drag"); bouge.current = true; finir(d); commit(); } },
    onPointerCancel: () => { const d = g.current; g.current = null; if (d && d.moved) { d.el.classList.remove("drag"); finir(d); commit(); } },
  });
  /* vrai si le clic qui suit vient d'un déplacement (on ne le compte pas comme un toucher) */
  const venaitDeGlisser = () => { const b = bouge.current; bouge.current = false; return b; };
  return { props, venaitDeGlisser };
}

/* Texte sous la scène : l'élément touché, ou une aide */
function Legende({ sel, ico, aide }) {
  return <p className="cap mu" role="status">{sel ? `${ico} ${sel.txt || "(sans texte)"} · ${date(sel.t)}` : aide}</p>;
}

/* Boutique commune : un article « objet » s'achète une fois ; un article avec un groupe
   (une couleur, par exemple) s'achète une fois puis se choisit parmi ceux du même groupe. */
function Boutique({ k, articles, bientot }) {
  const [msg, setMsg] = useState("");
  const a = achats(k), s = solde(k), m = MONNAIES[k];
  return (
    <section style={{ background: "var(--c4)" }}>
      <h2><span className="ico">🛍️</span><span>Boutique</span><span className="sun" aria-label={libelle(k, s)}>{m.e} {s}</span></h2>
      {bientot && <p className="mu" style={{ margin: "0 4px 6px" }}>{bientot}</p>}
      {(articles || []).map((it) => {
        const pris = a[it.id], actif = it.groupe && a["@" + it.groupe] === it.id;
        return (
          <div className="shopitem" key={it.id}>
            <div className="si" aria-hidden="true">{it.ico}</div>
            <div className="st"><strong>{it.nom}</strong>{it.desc && <><br /><span className="mu">{it.desc}</span></>}</div>
            {!pris ? (
              <button type="button" className="main sm" disabled={s < it.prix}
                onClick={() => { if (acheter(k, it.id, it.prix)) { if (it.groupe) choisir(k, it.groupe, it.id); setMsg(it.ok || "C’est à toi !"); } }}>{it.prix} {m.e}</button>
            ) : it.groupe ? (
              <button type="button" className={"reset sm" + (actif ? " on" : "")} aria-pressed={actif ? "true" : "false"}
                onClick={() => choisir(k, it.groupe, actif ? null : it.id)}>{actif ? "Choisi" : "Choisir"}</button>
            ) : <span className="acquis">✓ À toi</span>}
          </div>
        );
      })}
      {msg && <p className="banner" role="status">{msg}</p>}
      <p className="mu" style={{ margin: "8px 4px 2px", fontSize: 14 }}>Chaque entrée de ton carnet te rapporte 1 {m.e}.</p>
    </section>
  );
}

/* ---------- Mon ciel : un nuage par ressenti ---------- */
const NUAGES = { rose: "#FBD3E3", dore: "#FFE7A8", lavande: "#E4DAF8" };
const ARC = ["#E5484D", "#F28C3A", "#F5CC1F", "#76C442", "#2FA4E7", "#8E4A9B"];

export function Ciel() {
  const els = elements("res"), a = achats("res");
  const [sel, setSel] = useState(null);
  const H = Math.max(280, 70 + Math.ceil(els.length / 2) * 74);
  const { props, venaitDeGlisser } = useGlisser();
  /* position d'un nuage : celle où on l'a posé, sinon une place par défaut (2 par rangée) */
  const pos = (e, i) => ({ x: e.p.cx ?? (i % 2 ? 48 : 3) + hasard(e.n, 1) * 12, y: e.p.cy ?? 22 + Math.floor(i / 2) * 74 + hasard(e.n, 2) * 16 });
  return (
    <>
      <section style={{ background: "var(--c2)" }}>
        <h2><span className="ico">☁️</span><span>Mon ciel</span><span className="sn">{els.length + (els.length > 1 ? " nuages" : " nuage")}</span></h2>
        <div className="ciel" data-zone style={{ height: H, "--nuage": NUAGES[a["@nuages"]] || "#FFFFFF" }}>
          {a.soleil && <div className="ciel-soleil" aria-hidden="true" />}
          {a.arc && (
            <svg className="ciel-arc" viewBox="0 0 200 100" aria-hidden="true">
              {ARC.map((c, i) => <path key={c} d={`M${10 + i * 7} 100A${90 - i * 7} ${90 - i * 7} 0 0 1 ${190 - i * 7} 100`} stroke={c} strokeWidth="7" fill="none" opacity=".75" />)}
            </svg>
          )}
          {a.eclair && (
            <svg className="ciel-eclair" viewBox="0 0 40 80" aria-hidden="true"><path d="M26 0 6 44h14l-8 36 26-50H24l8-30z" fill="#FFD84D" stroke="#E0A800" strokeWidth="2" strokeLinejoin="round" /></svg>
          )}
          {els.map((e, i) => {
            const o = pos(e, i);
            const place = (d) => ({ x: Math.max(0, Math.min(80, o.x + d.dx / d.zone.width * 100)), y: Math.max(12, Math.min(H - 44, o.y + d.dy)) });
            return (
              <button key={e.id} type="button" className={"nuage" + (sel?.id === e.id ? " on" : "")} style={{ left: o.x + "%", top: o.y }}
                aria-label={"Nuage : " + e.txt}
                {...props((d) => { const q = place(d); d.el.style.left = q.x + "%"; d.el.style.top = q.y + "px"; },
                  (d) => { const q = place(d); e.p.cx = Math.round(q.x * 10) / 10; e.p.cy = Math.round(q.y); })}
                onClick={() => { if (!venaitDeGlisser()) setSel(sel?.id === e.id ? null : e); }}>
                {e.items[2] || e.items[0] || "☁️"}
              </button>
            );
          })}
          {!els.length && <p className="empty0">Ton ciel est encore tout bleu : écris un ressenti pour voir apparaître ton premier nuage ☁️</p>}
        </div>
        <Legende sel={sel} ico="💭" aide={els.length ? "Touche un nuage pour relire ton ressenti. Fais-le glisser où tu veux." : ""} />
      </section>
      <Boutique k="res" articles={[
        { id: "arc", ico: "🌈", nom: "Un arc-en-ciel", prix: 5, ok: "Un arc-en-ciel traverse ton ciel 🌈" },
        { id: "soleil", ico: "☀️", nom: "Un soleil qui perce", prix: 4, ok: "Le soleil perce 🌤️" },
        { id: "eclair", ico: "⚡", nom: "Un éclair", desc: "Pour les jours orageux, ça compte aussi.", prix: 3 },
        { id: "rose", groupe: "nuages", ico: "🩷", nom: "Des nuages roses", prix: 3 },
        { id: "dore", groupe: "nuages", ico: "💛", nom: "Des nuages dorés", prix: 3 },
        { id: "lavande", groupe: "nuages", ico: "💜", nom: "Des nuages lavande", prix: 3 },
      ]} />
    </>
  );
}

/* ---------- Mon sac : chaque poids posé devient un caillou sorti du sac ---------- */
const SACS = { rose: "#F28DB2", bleu: "#6FB7E8", vert: "#8CCB7E", jaune: "#F2C744" };

export function Sac() {
  const els = elements("car"), a = achats("car");
  const [sel, setSel] = useState(null);
  const coul = SACS[a["@couleur"]] || "#C08A6E";
  const leger = Math.max(0.72, 1 - els.length * 0.02); // le sac s'allège un peu à chaque caillou
  return (
    <>
      <section style={{ background: "var(--c2)" }}>
        <h2><span className="ico">🎒</span><span>Mon sac</span><span className="sn">{els.length + (els.length > 1 ? " cailloux posés" : " caillou posé")}</span></h2>
        <div className="sac-scene">
          <svg className="sac" viewBox="0 0 120 150" style={{ transform: `scale(${leger})` }} aria-hidden="true">
            <path d="M44 26Q60 4 76 26" stroke="#6B5A55" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="18" y="24" width="84" height="116" rx="24" fill={coul} />
            <path d="M18 54Q18 24 46 24H74Q102 24 102 54V66H18Z" fill="rgba(0,0,0,.13)" />
            <rect x="53" y="58" width="14" height="14" rx="3" fill="#FFE7A8" stroke="rgba(0,0,0,.2)" />
            <rect x="32" y="84" width="56" height="42" rx="11" fill="rgba(255,255,255,.2)" stroke="rgba(0,0,0,.15)" />
            {a.badge && <g transform="translate(76 104)">{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx="0" cy="-6" rx="3.4" ry="6" fill="#fff" transform={`rotate(${i * 60})`} />)}<circle r="3.6" fill="#FFC93C" /></g>}
            {a.etoile && <g><path d="M96 70v22" stroke="#6B5A55" strokeWidth="1.5" /><path d="M96 92l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFD84D" stroke="#C98A00" /></g>}
          </svg>
          <div className="cailloux">
            {els.map((e) => {
              const r = hasard(e.n, 3);
              return (
                <button key={e.id} type="button" className={"caillou" + (sel?.id === e.id ? " on" : "")} aria-label={"Caillou : " + e.txt}
                  style={{ width: 30 + r * 18, height: 22 + hasard(e.n, 4) * 10, background: `hsl(${20 + r * 30} 8% ${58 + hasard(e.n, 5) * 18}%)`, transform: `rotate(${(r - 0.5) * 30}deg)` }}
                  onClick={() => setSel(sel?.id === e.id ? null : e)} />
              );
            })}
          </div>
          {!els.length && <p className="empty0">Ton sac est encore plein : vide-le dans ton carnet, chaque poids posé devient un caillou 🪨</p>}
        </div>
        <Legende sel={sel} ico="🪨" aide={els.length ? "Touche un caillou pour relire ce que tu as posé." : ""} />
      </section>
      <Boutique k="car" articles={[
        { id: "rose", groupe: "couleur", ico: "🩷", nom: "Un sac rose", prix: 3 },
        { id: "bleu", groupe: "couleur", ico: "💙", nom: "Un sac bleu", prix: 3 },
        { id: "vert", groupe: "couleur", ico: "💚", nom: "Un sac vert", prix: 3 },
        { id: "jaune", groupe: "couleur", ico: "💛", nom: "Un sac jaune", prix: 3 },
        { id: "badge", ico: "🌼", nom: "Un badge fleur", prix: 5 },
        { id: "etoile", ico: "⭐", nom: "Un porte-clé étoile", prix: 4 },
      ]} />
    </>
  );
}

/* ---------- Mon miroir : un reflet (personnage simple, à personnaliser plus tard) ---------- */
export function Miroir() {
  const els = elements("sl");
  const [i, setI] = useState(0);
  const recents = els.slice().sort((x, y) => y.t - x.t);
  const mot = recents[i % Math.max(1, recents.length)];
  return (
    <>
      <section style={{ background: "var(--c0)" }}>
        <h2><span className="ico">🪞</span><span>Mon miroir</span><span className="sn">{els.length + (els.length > 1 ? " mots doux" : " mot doux")}</span></h2>
        <svg className="miroir" viewBox="0 0 200 270" role="img" aria-label="Un grand miroir, avec ton reflet qui sourit">
          <defs>
            <linearGradient id="vitre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E3F2F7" /><stop offset="1" stopColor="#F8FCFD" /></linearGradient>
            <clipPath id="reflet"><ellipse cx="100" cy="118" rx="70" ry="95" /></clipPath>
          </defs>
          <rect x="88" y="222" width="24" height="30" fill="#C9963F" />
          <ellipse cx="100" cy="256" rx="46" ry="9" fill="#C9963F" />
          <ellipse cx="100" cy="118" rx="82" ry="107" fill="#E8C07A" stroke="#C9963F" strokeWidth="5" />
          <ellipse cx="100" cy="118" rx="70" ry="95" fill="url(#vitre)" />
          <g clipPath="url(#reflet)">
            <path d="M44 214Q46 168 100 162Q154 168 156 214Z" fill="#F4A6B7" />
            <rect x="92" y="140" width="16" height="22" rx="6" fill="#F2C9A8" />
            <path d="M66 108Q64 62 100 60Q136 62 134 108Q138 140 126 150L120 112Q100 96 80 112L74 150Q62 140 66 108Z" fill="#7A4E3A" />
            <circle cx="100" cy="114" r="28" fill="#F6D2B5" />
            <path d="M74 106Q86 84 100 88Q114 84 126 106Q112 96 100 98Q88 96 74 106Z" fill="#7A4E3A" />
            <path d="M88 112q4-4 8 0M104 112q4-4 8 0" stroke="#5A4A5C" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M90 124Q100 134 110 124" stroke="#5A4A5C" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <circle cx="84" cy="124" r="5" fill="#F7B6C6" opacity=".8" /><circle cx="116" cy="124" r="5" fill="#F7B6C6" opacity=".8" />
            <path d="M52 40l60 150" stroke="#fff" strokeWidth="14" opacity=".35" />
          </g>
        </svg>
        {mot ? (
          <div className="postit">
            <p>{mot.txt}</p>
            <span className="mu">{date(mot.t)}</span>
            {recents.length > 1 && <button type="button" className="reset sm" onClick={() => setI(i + 1)}>Un autre mot doux</button>}
          </div>
        ) : <p className="empty0" style={{ position: "static" }}>Ton reflet attend ton premier mot doux 💖</p>}
      </section>
      <Boutique k="sl" bientot="Bientôt : des coiffures, des tenues et des accessoires pour ton reflet. Tes sourires t’attendent !" />
    </>
  );
}

/* ---------- Mes montagnes : une montagne de plus à chaque victoire ---------- */
const ROCHES = ["#8FB3A0", "#7A9E8C", "#A7C4B5", "#6F8F9E", "#9DB7C9", "#B5A8C9"];

export function Montagnes() {
  const els = elements("vic");
  const [sel, setSel] = useState(null);
  const { props, venaitDeGlisser } = useGlisser();
  const monts = els.map((e, i) => {
    const h = 50 + hasard(e.n, 2) * 60 + Math.min(i * 2, 24), w = 70 + hasard(e.n, 3) * 50;
    const x = (e.p.mx || {})[e.i] ?? 20 + hasard(e.n, 1) * 260; // position choisie, sinon au hasard
    return { e, h, w, x, fill: ROCHES[i % ROCHES.length] };
  }).sort((p, q) => q.h - p.h); // les plus hautes derrière
  return (
    <>
      <section style={{ background: "var(--c3)" }}>
        <h2><span className="ico">⛰️</span><span>Mes montagnes</span><span className="sn">{els.length + (els.length > 1 ? " montagnes" : " montagne")}</span></h2>
        <svg className="paysage" data-zone viewBox="0 0 300 190" role="group" aria-label="Mon paysage de victoires">
          <defs><linearGradient id="ciel-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE3F5" /><stop offset="1" stopColor="#F5F0E1" /></linearGradient></defs>
          <rect width="300" height="190" fill="url(#ciel-p)" />
          <circle cx="250" cy="38" r="16" fill="#FFE29A" />
          {monts.map(({ e, h, w, x, fill }) => {
            const top = 160 - h, on = sel?.id === e.id;
            /* une montagne glisse seulement de gauche à droite : elle reste posée sur le sol */
            const nx = (d) => Math.max(10, Math.min(290, x + d.dx * 300 / d.zone.width));
            return (
              <g key={e.id} role="button" tabIndex={0} aria-label={"Montagne : " + e.txt} className={"mont" + (on ? " on" : "")}
                {...props((d) => d.el.setAttribute("transform", `translate(${nx(d) - x} 0)`),
                  (d) => { d.el.removeAttribute("transform"); e.p.mx = { ...(e.p.mx || {}), [e.i]: Math.round(nx(d)) }; })}
                onClick={() => { if (!venaitDeGlisser()) setSel(on ? null : e); }} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); setSel(on ? null : e); } }}>
                <path d={`M${x - w / 2} 162L${x - w * 0.12} ${top + 6}Q${x} ${top - 4} ${x + w * 0.12} ${top + 6}L${x + w / 2} 162Z`} fill={fill} />
                {h > 85 && <path d={`M${x - w * 0.12} ${top + 6}Q${x} ${top - 4} ${x + w * 0.12} ${top + 6}L${x + w * 0.2} ${top + 22}L${x + w * 0.06} ${top + 16}L${x - w * 0.04} ${top + 24}L${x - w * 0.2} ${top + 20}Z`} fill="#fff" opacity=".9" />}
              </g>
            );
          })}
          <path d="M0 160Q75 146 150 158T300 154V190H0Z" fill="#9CCB9A" />
          <path d="M0 172Q90 162 180 172T300 168V190H0Z" fill="#7FB77E" />
          {!els.length && <text x="150" y="110" textAnchor="middle" fontSize="11" fill="#5A4A5C">Ton paysage attend sa première montagne ⛰️</text>}
        </svg>
        <Legende sel={sel} ico="🏆" aide={els.length ? "Touche une montagne pour relire ta victoire. Fais-la glisser à gauche ou à droite." : ""} />
      </section>
      <Boutique k="vic" bientot="Bientôt : de quoi décorer ton paysage. Garde précieusement tes chaussures 👟" />
    </>
  );
}

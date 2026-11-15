import { useState } from "react";
import { JR, JR_KEYS } from "./data.js";
import { S, pagesDe } from "./store.js";
import Journal from "./Journal.jsx";
import Timeline, { entreesLigne } from "./Timeline.jsx";
import Garden from "./Garden.jsx";
import { Ciel, Miroir, Montagnes, Sac } from "./Visuels.jsx";
import Todo from "./Todo.jsx";

/* Couleurs des intercalaires, dans l'ordre, puis on recommence */
const TEINTES = ["#2FA4E7", "#F28C3A", "#F5CC1F", "#76C442", "#8E4A9B"];

/* Pages du carnet : la to do list d'abord, les carnets, puis la ligne du temps et la pellicule tout en bas.
   lecture : page qui se remplit toute seule (on ne peut pas y écrire avec le stylo). */
const carnet = (k) => ({ k, ico: JR[k].ico, nom: JR[k].short, info: () => { const n = pagesDe(k).length; return n + (JR[k].photo ? " photo" : " page") + (n > 1 ? "s" : ""); } });
const PAGES = [
  { k: "todo", ico: "✅", nom: "To do list", info: () => { const n = S.todo.filter((t) => !t.d).length; return n + " à faire"; } },
  ...JR_KEYS.filter((k) => !JR[k].photo).map(carnet),
  { k: "tl", lecture: "se remplit toute seule", ico: "🕰️", nom: "Ligne du temps", info: () => { const n = entreesLigne().length; return n + " activité" + (n > 1 ? "s" : ""); } },
  ...JR_KEYS.filter((k) => JR[k].photo).map((k) => ({ ...carnet(k), lecture: "avec les activités photo" })),
];

/* Page visuelle de chaque carnet, accessible seulement depuis ce carnet */
const VISUELS = {
  gr: { ico: "🌷", nom: "Mon jardin de gratitude", C: Garden },
  sl: { ico: "🪞", nom: "Mon miroir", C: Miroir },
  vic: { ico: "⛰️", nom: "Mes montagnes", C: Montagnes },
  car: { ico: "🎒", nom: "Mon sac", C: Sac },
  res: { ico: "☁️", nom: "Mon ciel", C: Ciel },
};

/* Stylo 4 couleurs posé à côté du carnet (décoratif) */
function Stylo() {
  const mines = ["#2FA4E7", "#F28C3A", "#E5484D", "#76C442"];
  return (
    <svg className="stylo" viewBox="0 0 30 300" aria-hidden="true">
      <rect x="9" y="6" width="12" height="16" rx="5" fill="#E9EEF3" stroke="#B8C2CC" />
      {mines.map((c, i) => <rect key={c} x={6 + i * 5} y={20 - (i % 2) * 6} width="4" height="14" rx="2" fill={c} />)}
      <rect x="22" y="26" width="5" height="70" rx="2.5" fill="#E9EEF3" stroke="#B8C2CC" />
      <path d="M5 30h20v190l-5 50h-10l-5-50z" fill="rgba(225,235,243,.55)" stroke="#B8C2CC" strokeWidth="1.2" />
      {mines.map((c, i) => <rect key={c} x={8.5 + i * 3.6} y="34" width="2.2" height="200" rx="1" fill={c} opacity=".85" />)}
      <g stroke="#9AA6B2" strokeWidth=".8" opacity=".7">{Array.from({ length: 9 }, (_, i) => <line key={i} x1="6" x2="24" y1={200 + i * 3} y2={200 + i * 3} />)}</g>
      <path d="M12.5 270h5l-2.5 14z" fill="#8C96A0" />
    </svg>
  );
}

/* Menu : un carnet à spirale avec ses intercalaires, posé à côté d'un stylo.
   Toucher un intercalaire : on relit la page. Toucher le stylo, puis un intercalaire : on écrit. */
function Carnet({ ouvrir }) {
  const [choix, setChoix] = useState(false);
  return (
    <>
      <p className={"jr-aide" + (choix ? " on" : "")} role="status">
        {choix ? <>✏️ Dans quelle page veux-tu écrire ? <button type="button" className="reset sm" onClick={() => setChoix(false)}>Annuler</button></>
          : "Touche un intercalaire pour relire tes pages, ou le stylo pour écrire."}
      </p>
      <div className="bureau">
        <button type="button" className={"stylo-btn" + (choix ? " on" : "")} aria-pressed={choix ? "true" : "false"}
          aria-label="Écrire dans le carnet" onClick={() => setChoix(!choix)}><Stylo /></button>
        <div className={"carnet" + (choix ? " choix" : "")}>
          <div className="spirale" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <span key={i} />)}</div>
          <nav className="intercalaires" aria-label="Pages du carnet">
            {PAGES.map((p, i) => (
              <button key={p.k} type="button" className="interc" style={{ "--t": TEINTES[i % TEINTES.length], "--i": i }}
                disabled={choix && p.lecture} onClick={() => ouvrir(p.k, choix)}>
                <span className="interc-fleche" aria-hidden="true">{p.ico}</span>
                <span className="interc-bout" aria-hidden="true" />
                <span className="interc-etiq">
                  <span className="interc-num" aria-hidden="true">{i + 1}</span>
                  <span className="interc-nom">{p.nom}</span>
                  <span className="interc-info">{choix && p.lecture ? p.lecture : p.info()}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

/* Onglet « Journaling » : on arrive sur le carnet, puis on ouvre une page pour la relire ou y écrire */
export default function Journaling({ sub, setSub }) {
  const [ecrire, setEcrire] = useState(false);
  const [visuel, setVisuel] = useState(false);
  const ouvrir = (k, e = false) => { setEcrire(e); setVisuel(false); setSub(k); window.scrollTo({ top: 0 }); };
  if (!PAGES.some((p) => p.k === sub)) return <Carnet ouvrir={ouvrir} />;
  const page = PAGES.find((p) => p.k === sub);
  const ecrireIci = () => { setEcrire(true); setVisuel(false); window.scrollTo({ top: 0 }); };
  const V = VISUELS[sub];
  const voir = () => { setVisuel(true); setEcrire(false); window.scrollTo({ top: 0 }); };
  if (V && visuel) return (
    <>
      <div className="jr-haut">
        <button type="button" className="reset sm" onClick={() => { setVisuel(false); window.scrollTo({ top: 0 }); }}>← {page.ico} {page.nom}</button>
        <span className="jr-ou">{V.ico} {V.nom}</span>
      </div>
      <V.C />
    </>
  );
  return (
    <>
      <div className="jr-haut">
        <button type="button" className="reset sm" onClick={() => ouvrir(null)}>← Mon carnet</button>
        <span className="jr-ou">{page.ico} {page.nom}</span>
        {!page.lecture && (ecrire
          ? <button type="button" className="reset sm jr-mode" onClick={() => setEcrire(false)}>📖 Relire</button>
          : <button type="button" className="reset sm jr-mode" onClick={ecrireIci}>✏️ Écrire</button>)}
      </div>
      {V && !ecrire && (
        <button type="button" className="jr-visuel" onClick={voir}><span aria-hidden="true">{V.ico}</span><span>{V.nom}</span><span aria-hidden="true">→</span></button>
      )}
      {sub === "tl" ? <Timeline />
        : sub === "todo" ? <Todo ajout={ecrire} vide={<div className="jr-vide"><p>Vide pour le moment.</p><p className="mu">Touche le stylo pour ajouter une tâche.</p><button type="button" className="main sm" onClick={ecrireIci}>✏️ Ajouter une tâche</button></div>} />
        : <Journal key={sub + (ecrire ? "-e" : "-l")} k={sub} ecrire={ecrire} setEcrire={(v) => (v ? ecrireIci() : setEcrire(false))} retour={() => ouvrir(null)} voir={V && { ...V, ouvrir: voir }} />}
    </>
  );
}

import { useEffect, useState } from "react";
import { useStore } from "./store.js";
import Home, { newSess } from "./Home.jsx";
import Garden from "./Garden.jsx";
import Database from "./Database.jsx";
import Timeline from "./Timeline.jsx";
import Journaling from "./Journaling.jsx";
import Todo from "./Todo.jsx";
import { Bandeau, Indicateur } from "./Donnees.jsx";
import Parametres from "./Parametres.jsx";
import Apropos from "./Apropos.jsx";

/* Entrées du volet : [code, libellé, emoji]. Paramètres et À propos sont tout en bas. */
const HAUT = [["home", "Ma suggestion", "🌼"], ["garden", "Mon jardin", "🌷"], ["db", "Base de données", "📋"], ["tl", "Ligne du temps", "🕰️"], ["jrn", "Journaling", "📓"], ["todo", "To do list", "✅"]];
const BAS = [["settings", "Paramètres", "⚙️"], ["about", "À propos", "💛"]];
const TITRES = Object.fromEntries([...HAUT, ...BAS].map(([k, l]) => [k, l]));

function Header() {
  const petals = Array.from({ length: 12 }, (_, i) => (
    <ellipse key={i} cx="170" cy="34" rx="10" ry="21" transform={i ? `rotate(${i * 30} 170 68)` : undefined} />
  ));
  return (
    <header>
      <svg viewBox="0 0 340 170" role="img" aria-label="Une marguerite blanche au cœur jaune qui sourit">
        <circle cx="285" cy="38" r="22" fill="#FCEBC0" />
        <g fill="#fff" opacity=".9"><ellipse cx="62" cy="40" rx="30" ry="13" /><ellipse cx="84" cy="34" rx="20" ry="12" /><ellipse cx="272" cy="104" rx="26" ry="10" /><ellipse cx="290" cy="98" rx="16" ry="9" /></g>
        <ellipse cx="170" cy="162" rx="110" ry="7" fill="#000" opacity=".06" />
        <path d="M170 112C168 130 172 146 170 162" stroke="#A8CBA6" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="146" cy="142" rx="17" ry="7" fill="#C9E0C7" transform="rotate(-25 146 142)" />
        <ellipse cx="195" cy="134" rx="17" ry="7" fill="#C9E0C7" transform="rotate(25 195 134)" />
        <g fill="#fff" stroke="#E6D9E3" strokeWidth="1.5">{petals}</g>
        <circle cx="170" cy="68" r="24" fill="#FFD84D" />
        <circle cx="161" cy="64" r="3" fill="#5A4A5C" /><circle cx="179" cy="64" r="3" fill="#5A4A5C" />
        <path d="M159 73Q170 86 181 73" stroke="#5A4A5C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="153" cy="73" r="4" fill="#F7B6C6" opacity=".85" /><circle cx="187" cy="73" r="4" fill="#F7B6C6" opacity=".85" />
      </svg>
      <h1>Be Kind</h1>
      <p className="sub">Un petit coup de pouce pour prendre soin de moi</p>
    </header>
  );
}

export default function App() {
  useStore(); // redessine quand les données ou la sauvegarde changent
  const [tab, setTab] = useState("home");
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState("gr");
  const [sess, setSess] = useState(() => newSess());
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const aller = (k) => { setTab(k); setOpen(false); window.scrollTo({ top: 0 }); };
  const entree = ([k, l, e]) => (
    <button key={k} type="button" role="tab" className="dnav" aria-selected={tab === k ? "true" : "false"} onClick={() => aller(k)}>
      <span aria-hidden="true">{e}</span>{l}
    </button>
  );
  return (
    <main>
      <Header />
      <div className="topbar">
        <button type="button" className="burger" aria-label="Ouvrir le menu" aria-expanded={open ? "true" : "false"} aria-controls="volet" onClick={() => setOpen(true)}>☰</button>
        <h2 className="ttl">{TITRES[tab]}</h2>
      </div>
      <Indicateur onClick={() => aller("settings")} />
      <Bandeau />

      <div className={"scrim" + (open ? " on" : "")} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="volet" className={"drawer" + (open ? " open" : "")} inert={!open} aria-label="Menu">
        <div className="dhead">
          <strong>Be Kind</strong>
          <button type="button" className="burger" aria-label="Fermer le menu" onClick={() => setOpen(false)}>×</button>
        </div>
        <nav className="dlist" role="tablist" aria-label="Sections" aria-orientation="vertical">
          {HAUT.map(entree)}
          <div className="dgrow" />
          {BAS.map(entree)}
        </nav>
      </aside>

      <div id="view" role="tabpanel">
        {tab === "home" && <Home sess={sess} setSess={setSess} />}
        {tab === "garden" && <Garden />}
        {tab === "db" && <Database />}
        {tab === "tl" && <Timeline />}
        {tab === "jrn" && <Journaling sub={sub} setSub={setSub} />}
        {tab === "todo" && <Todo />}
        {tab === "settings" && <Parametres />}
        {tab === "about" && <Apropos />}
      </div>
    </main>
  );
}

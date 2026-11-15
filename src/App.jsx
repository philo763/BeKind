import { useState } from "react";
import { useStore } from "./store.js";
import Home, { newSess } from "./Home.jsx";
import Garden from "./Garden.jsx";
import Database from "./Database.jsx";
import Timeline from "./Timeline.jsx";
import Journal from "./Journal.jsx";
import Todo from "./Todo.jsx";
import Donnees, { Bandeau, Indicateur } from "./Donnees.jsx";

const ROWS = [
  [["home", "Ma suggestion"], ["garden", "Mon jardin"], ["db", "Base de données"], ["tl", "Ligne du temps"]],
  [["gr", "Gratitude"], ["sl", "Self love"], ["todo", "To do list"], ["data", "Mes données"]],
];

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
  const [sess, setSess] = useState(() => newSess());
  return (
    <main>
      <Header />
      <Indicateur onClick={() => setTab("data")} />
      <Bandeau />
      <nav className="tabs" role="tablist" aria-label="Sections">
        {ROWS.map((row, i) => (
          <div className="trow2" role="presentation" key={i}>
            {row.map(([k, l]) => (
              <button key={k} className="tab" role="tab" type="button" aria-selected={tab === k ? "true" : "false"} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
        ))}
      </nav>
      <div id="view" role="tabpanel">
        {tab === "home" && <Home sess={sess} setSess={setSess} goJournal={setTab} />}
        {tab === "garden" && <Garden />}
        {tab === "db" && <Database />}
        {tab === "tl" && <Timeline />}
        {(tab === "gr" || tab === "sl") && <Journal key={tab} k={tab} />}
        {tab === "todo" && <Todo />}
        {tab === "data" && <Donnees />}
      </div>
    </main>
  );
}

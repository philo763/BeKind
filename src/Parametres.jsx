import { useState } from "react";
import Donnees from "./Donnees.jsx";
import { lireTheme, choisirTheme } from "./theme.js";

/* Page « Paramètres » : ses rubriques sont des sous-onglets */
const RUBRIQUES = [["data", "💾 Mes données"], ["look", "🎨 Apparence"]];
const THEMES = [["auto", "📱 Automatique"], ["light", "☀️ Clair"], ["dark", "🌙 Sombre"]];

function Apparence() {
  const [theme, setTheme] = useState(lireTheme);
  const choisir = (t) => { choisirTheme(t); setTheme(t); };
  return (
    <section style={{ background: "var(--c3)" }}>
      <h2><span className="ico">🎨</span><span>Mode clair ou sombre</span></h2>
      <div className="trow2" role="radiogroup" aria-label="Thème" style={{ justifyContent: "flex-start", margin: "6px 0 10px" }}>
        {THEMES.map(([k, l]) => (
          <button key={k} type="button" role="radio" className="tab" aria-checked={theme === k ? "true" : "false"}
            onClick={() => choisir(k)}>{l}</button>
        ))}
      </div>
      <p className="mu" style={{ margin: "0 0 6px", fontSize: 14 }}>
        {theme === "auto"
          ? "L’appli suit le réglage de ton téléphone : elle passe en sombre quand il est en mode sombre."
          : "Ce choix est gardé sur cet appareil, quel que soit le réglage du téléphone."}
      </p>
    </section>
  );
}

export default function Parametres() {
  const [sub, setSub] = useState("data");
  return (
    <>
      <nav className="subtabs" role="tablist" aria-label="Paramètres">
        {RUBRIQUES.map(([k, l]) => (
          <button key={k} type="button" role="tab" className="tab sm" aria-selected={sub === k ? "true" : "false"} onClick={() => setSub(k)}>{l}</button>
        ))}
      </nav>
      {sub === "data" && <Donnees />}
      {sub === "look" && <Apparence />}
    </>
  );
}

import { useState } from "react";
import Donnees from "./Donnees.jsx";

/* Page « Paramètres » : ses rubriques sont des sous-onglets */
const RUBRIQUES = [["data", "💾 Mes données"]];

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
    </>
  );
}

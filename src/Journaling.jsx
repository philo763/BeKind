import { JR, JR_KEYS } from "./data.js";
import { pagesDe } from "./store.js";
import Journal from "./Journal.jsx";

/* Onglet « Journaling » : tous les carnets en sous-onglets */
export default function Journaling({ sub, setSub }) {
  return (
    <>
      <nav className="subtabs" role="tablist" aria-label="Carnets">
        {JR_KEYS.map((k) => (
          <button key={k} type="button" role="tab" className="tab sm" aria-selected={sub === k ? "true" : "false"}
            title={pagesDe(k).length + " page(s)"} onClick={() => setSub(k)}>{JR[k].ico + " " + JR[k].short}</button>
        ))}
      </nav>
      <Journal key={sub} k={sub} />
    </>
  );
}

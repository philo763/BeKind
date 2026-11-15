import { useState } from "react";
import { S, commit } from "./store.js";
import { Tick } from "./ui.jsx";

export default function Todo() {
  const [draft, setDraft] = useState("");
  const open = S.todo.filter((t) => !t.d).length;
  const add = () => {
    const v = draft.trim(); if (!v) return;
    S.todo.push({ id: S.next++, t: v, d: false }); setDraft(""); commit();
  };
  return (
    <section style={{ background: "var(--c1)" }}>
      <h2><span className="ico">✅</span><span>To do list</span><span className="sn">{S.todo.length ? open + " à faire" : ""}</span></h2>
      {!S.todo.length && <p className="mu">Rien à faire pour l’instant. Profites-en ! 🌿</p>}
      <ul>
        {S.todo.map((t) => (
          <li className="trow" key={t.id}>
            <label>
              <input type="checkbox" checked={!!t.d} onChange={(e) => { t.d = e.target.checked; commit(); }} />
              <span className="cb"><Tick /></span><span className="txt">{t.t}</span>
            </label>
            <button type="button" className="x" aria-label="Supprimer la tâche" onClick={() => { S.todo = S.todo.filter((k) => k.id !== t.id); commit(); }}>🗑</button>
          </li>
        ))}
      </ul>
      <div className="add">
        <input className="nm" placeholder="Ajouter une tâche" aria-label="Nouvelle tâche" value={draft}
          onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" onClick={add}>Ajouter</button>
      </div>
      {S.todo.some((t) => t.d) && <div className="foot"><button type="button" className="reset" onClick={() => { S.todo = S.todo.filter((k) => !k.d); commit(); }}>Effacer les terminées</button></div>}
    </section>
  );
}

import { useState } from "react";
import { EL, HN, emo, firstEmoji } from "./data.js";
import { S, commit } from "./store.js";
import { Chip } from "./ui.jsx";

/* ---------- sélecteur d'emoji ---------- */
function Picker({ onPick }) {
  const [own, setOwn] = useState("");
  const ok = () => { const e = firstEmoji(own); if (e) onPick(e); };
  return (
    <div className="picker" role="group" aria-label="Choisir un emoji">
      {EL.map((e) => (
        <button key={e} type="button" className="pe" aria-label={"Emoji " + e} onClick={() => onPick(e)}>{e}</button>
      ))}
      <div className="pown">
        <input className="nm" placeholder="Ou colle ton emoji" aria-label="Autre emoji" maxLength={12}
          value={own} onChange={(e) => setOwn(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); ok(); } }} />
        <button type="button" className="reset sm" onClick={ok}>OK</button>
      </div>
    </div>
  );
}

/* ---------- base de données ---------- */
export default function Database({ enCours }) {
  const [sortMode, setSortMode] = useState("h");
  const [filt, setFilt] = useState([]);
  const [pickFor, setPickFor] = useState(null);
  const [armed, setArmed] = useState(false);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [newH, setNewH] = useState([]);
  const [newE, setNewE] = useState("🌼");

  const toggleIn = (arr, set, k) => set(arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]);
  const setEmoji = (e) => { setNewE(e); setPickFor(null); };
  /* Une nouvelle activité part avec le meilleur score actuel : elle sera proposée parmi les premières.
     Les activités existantes ne se modifient ni ne se suppriment. « Pas du tout envie » leur retire
     un point ; « Je ne veux plus cette suggestion » les désactive (a.off), réactivables ici hors tirage. */
  const add = () => {
    const nm = name.trim();
    if (!nm) { setMsg("Écris d’abord le nom de l’activité."); return; }
    if (!newH.length) { setMsg("Choisis au moins une couleur."); return; }
    const top = S.acts.length ? Math.max(...S.acts.map((a) => a.s)) : 0;
    S.acts.push({ id: S.next++, n: nm, h: newH.slice().sort(), s: top, e: newE, g: "manuel" });
    setName(""); setNewH([]); setNewE("🌼"); setPickFor(null); setMsg(""); commit();
  };

  const reactiver = (a) => { delete a.off; commit(); };

  let rows = S.acts.map((a, i) => ({ a, i }));
  if (filt.length) rows = rows.filter((r) => r.a.h.some((k) => filt.includes(k)));
  if (sortMode === "s") rows.sort((x, y) => y.a.s - x.a.s || x.i - y.i);
  else if (sortMode === "a") rows.sort((x, y) => x.a.n.localeCompare(y.a.n, "fr", { sensitivity: "base" }) || x.i - y.i);

  return (
    <>
      <section style={{ background: "var(--c3)" }}>
        <h2><span className="ico">🧪</span><span>Scores des hormones</span></h2>
        <p className="mu" style={{ margin: "0 0 4px", fontSize: 14 }}>Touche une hormone pour filtrer la liste (plusieurs possibles).</p>
        <div className="hgrid">
          {[0, 1, 2, 3].map((k) => (
            <button key={k} type="button" className="hc" aria-pressed={filt.includes(k) ? "true" : "false"}
              onClick={() => toggleIn(filt, setFilt, k)} style={{ background: `var(--h${k})`, "--k": `var(--s${k})` }}>
              <span className="dot" style={{ background: `var(--s${k})` }} />
              <span className="hct"><strong>{HN[k]}</strong><br /><span className="mu">{S.acts.filter((a) => a.h.includes(k)).length} activités</span></span>
              <span className="sc">{S.hs[k]}</span>
            </button>
          ))}
        </div>
        {filt.length > 0 && <div className="tools" style={{ margin: "6px 0 0" }}><button type="button" className="reset sm" onClick={() => setFilt([])}>Tout afficher</button></div>}
      </section>

      <section style={{ background: "var(--c3)" }}>
        <h2><span className="ico">📋</span><span>Mes activités</span><span className="sn">{(filt.length ? rows.length + " / " : "") + S.acts.length}</span></h2>
        <div className="tools" style={{ justifyContent: "flex-start", marginTop: 0 }}>
          <span className="mu" style={{ fontSize: 14, alignSelf: "center" }}>Trier :</span>
          {[["h", "Par hormone"], ["s", "Par score"], ["a", "A → Z"]].map(([v, l]) => (
            <button key={v} type="button" className={"reset sm" + (sortMode === v ? " on" : "")} aria-pressed={sortMode === v ? "true" : "false"} onClick={() => setSortMode(v)}>{l}</button>
          ))}
        </div>
        <table>
          <thead><tr><th>Activité et ses hormones</th><th className="c">Score</th></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan={2} className="mu">Aucune activité pour ce filtre.</td></tr>}
            {rows.map(({ a }) => (
              <tr key={a.id} className={a.off ? "off" : undefined}>
                <td>
                  <div className="arow">
                    <span className="emo" aria-hidden="true">{emo(a)}</span>
                    <div className="aw">{a.n}{a.off && <span className="etat">Désactivée</span>}
                      <div className="chips">
                        {a.h.map((k) => <Chip key={k} h={k} on />)}
                      </div>
                      {a.off && (
                        <div className="reac">
                        <button type="button" className="reset sm" disabled={enCours} aria-describedby={enCours ? "pq-" + a.id : undefined}
                          onClick={() => reactiver(a)}>Réactiver</button>
                        {enCours && <span id={"pq-" + a.id} className="mu">Reviens d’abord au début du tour (le cerveau) pour la réactiver.</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="score">{a.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ background: "var(--c1)" }}>
        <h2><span className="ico">➕</span><span>Ajouter mon activité</span></h2>
        <div className="add">
          <button type="button" className="emo big" aria-label="Choisir un emoji" title="Choisir un emoji" onClick={() => setPickFor(pickFor === "new" ? null : "new")}>{newE}</button>
          <input className="nm" placeholder="Ex. : Faire une sieste de 20 minutes" aria-label="Nouvelle activité" value={name}
            onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        </div>
        {pickFor === "new" && <Picker onPick={setEmoji} />}
        <div className="addrow"><span className="mu">Ses hormones :</span>
          <div className="chips">{[0, 1, 2, 3].map((q) => <Chip key={q} h={q} on={newH.includes(q)} onClick={() => toggleIn(newH, setNewH, q)} />)}</div>
          <button type="button" className="reset sm" onClick={add}>Ajouter</button></div>
        {msg && <p className="mu" role="status" style={{ margin: "0 0 6px" }}>{msg}</p>}
      </section>
      <div className="foot">
        <button type="button" className="reset" onClick={() => {
          if (!armed) { setArmed(true); return; }
          setArmed(false); S.acts.forEach((k) => { k.s = 0; }); S.hs = [0, 0, 0, 0]; commit();
        }}>{armed ? "Confirmer : tout remettre à zéro" : "Réinitialiser les scores"}</button>
      </div>
    </>
  );
}

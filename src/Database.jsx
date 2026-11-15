import { useState } from "react";
import { EL, HN, SUGG, TAGS, WLOIS, WSPORT, emo, firstEmoji } from "./data.js";
import { S, commit } from "./store.js";
import { Chip, Dots, TagOptions, Tick } from "./ui.jsx";

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

/* ---------- assistant « suggestions d'ajout d'activités » ---------- */
function Wizard({ close, onAdded }) {
  const [w, setW] = useState(() => {
    const tg = (S.prof && S.prof.tags) || [];
    const ans = {};
    if (S.prof) { ans.chien = tg.includes("chien") ? 1 : 0; ans.chat = tg.includes("chat") ? 1 : 0; }
    return { step: 0, tg: tg.slice(), off: {}, ans };
  });
  const upd = (fn) => setW((o) => { const n = { ...o, tg: o.tg.slice(), off: { ...o.off }, ans: { ...o.ans } }; fn(n); return n; });
  const has = (k) => w.tg.includes(k);
  const toggle = (n, k) => { const i = n.tg.indexOf(k); if (i > -1) n.tg.splice(i, 1); else n.tg.push(k); };
  const cands = SUGG.map((s, i) => ({ s, i })).filter((o) => {
    const g = o.s[0];
    if (g !== "generique" && !w.tg.includes(g)) return false;
    const nm = o.s[2].toLowerCase();
    return !S.acts.some((a) => a.n.toLowerCase() === nm);
  });
  const chosen = cands.filter((o) => !w.off[o.i]);
  const add = () => {
    chosen.forEach((o) => { const s = o.s; S.acts.push({ id: S.next++, n: s[2], h: s[3].slice(), s: 0, e: s[1], g: s[0] }); });
    S.prof = { tags: w.tg.slice() }; commit();
    onAdded(chosen.length);
  };
  const st = w.step;
  const head = (n, emoji, q) => (
    <><p className="kicker">Question {n} sur 4</p><div className="bigemo" aria-hidden="true">{emoji}</div><h2>{q}</h2></>
  );
  const yn = (tag, emoji, q, n) => (
    <>{head(n, emoji, q)}
      <div className="opts">
        {[["Oui", 1], ["Non", 0]].map(([l, v]) => (
          <button key={l} type="button" className="opt" aria-pressed={w.ans[tag] === v ? "true" : "false"}
            onClick={() => upd((o) => { o.ans[tag] = v; const i = o.tg.indexOf(tag); if (v) { if (i < 0) o.tg.push(tag); } else if (i > -1) o.tg.splice(i, 1); o.step++; })}>{l}</button>
        ))}
      </div></>
  );
  const multi = (list, emoji, q, n, sub, btn) => (
    <>{head(n, emoji, q)}<p className="mu">{sub}</p>
      <div className="opts">
        {list.map((o) => (
          <button key={o[0]} type="button" className="opt" aria-pressed={has(o[0]) ? "true" : "false"}
            onClick={() => upd((x) => toggle(x, o[0]))}>{o[2] + " " + o[1]}</button>
        ))}
      </div>
      <button type="button" className="main" onClick={() => upd((o) => { o.step++; })}>{btn}</button></>
  );
  return (
    <section className="card" style={{ background: "var(--c3)" }}>
      <div className="tools" style={{ margin: "0 0 6px", justifyContent: "space-between" }}>
        {st > 0 ? <button type="button" className="reset sm" onClick={() => upd((o) => { o.step--; })}>‹ Retour</button> : <span />}
        <button type="button" className="reset sm" onClick={close}>Fermer</button>
      </div>
      {st === 0 && yn("chien", "🐶", "Tu as un chien ?", 1)}
      {st === 1 && yn("chat", "🐱", "Tu as un chat ?", 2)}
      {st === 2 && multi(WSPORT, "🏅", "Quels sports aimes-tu pratiquer ?", 3, "Choisis-en autant que tu veux, ou aucun.", "Suivant")}
      {st === 3 && multi(WLOIS, "✨", "Qu’est-ce qui te plaît à côté ?", 4, "Là aussi, tu peux en choisir plusieurs.", "Voir mes suggestions")}
      {st > 3 && (
        <>
          <p className="kicker">Mes suggestions</p><h2>Voici des idées pour toi</h2>
          {!cands.length ? (
            <><p>Tu as déjà toutes les idées que je pouvais te proposer ! 🌼</p>
              <button type="button" className="main" onClick={close}>Retour à la base</button></>
          ) : (
            <>
              <p className="mu">Décoche celles qui ne te plaisent pas, puis ajoute le reste à ta base.</p>
              <div style={{ textAlign: "left" }}>
                {TAGS.map((g) => {
                  const it = cands.filter((o) => o.s[0] === g.k);
                  if (!it.length) return null;
                  return (
                    <div key={g.k}>
                      <div className="sgh">{g.e + " " + g.l}</div>
                      {it.map((o) => (
                        <label key={o.i}>
                          <input type="checkbox" checked={!w.off[o.i]}
                            onChange={(e) => upd((x) => { if (e.target.checked) delete x.off[o.i]; else x.off[o.i] = 1; })} />
                          <span className="cb"><Tick /></span>
                          <span className="sgt">{o.s[1] + " " + o.s[2]}</span>
                          <span className="dots"><Dots hs={o.s[3]} /></span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div className="foot" style={{ marginTop: 14 }}>
                <button type="button" className="main" onClick={add}>Ajouter la sélection (<span>{chosen.length}</span>)</button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

/* ---------- base de données ---------- */
export default function Database() {
  const [wiz, setWiz] = useState(false);
  const [sortMode, setSortMode] = useState("h");
  const [filt, setFilt] = useState([]);
  const [pickFor, setPickFor] = useState(null);
  const [armed, setArmed] = useState(false);
  const [ok, setOk] = useState("");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [newH, setNewH] = useState([]);
  const [newE, setNewE] = useState("🌼");
  const [newT, setNewT] = useState("generique");

  if (wiz) return <Wizard close={() => setWiz(false)} onAdded={(n) => {
    setOk(n ? n + (n > 1 ? " activités ajoutées" : " activité ajoutée") + " à ta base 🌸" : ""); setWiz(false);
  }} />;

  const toggleIn = (arr, set, k) => set(arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]);
  const setEmoji = (e) => {
    if (pickFor === "new") setNewE(e);
    else { const a = S.acts.find((k) => k.id === pickFor); if (a) { a.e = e; commit(); } }
    setPickFor(null);
  };
  const add = () => {
    const nm = name.trim();
    if (!nm) { setMsg("Écris d’abord le nom de l’activité."); return; }
    if (!newH.length) { setMsg("Choisis au moins une couleur."); return; }
    S.acts.push({ id: S.next++, n: nm, h: newH.slice().sort(), s: 0, e: newE, g: newT });
    setName(""); setNewH([]); setNewE("🌼"); setNewT("generique"); setPickFor(null); setMsg(""); commit();
  };
  const chipToggle = (a, h) => {
    const i = a.h.indexOf(h);
    if (i > -1) { if (a.h.length > 1) a.h.splice(i, 1); } else { a.h.push(h); a.h.sort(); }
    commit();
  };

  let rows = S.acts.map((a, i) => ({ a, i }));
  if (filt.length) rows = rows.filter((r) => r.a.h.some((k) => filt.includes(k)));
  if (sortMode === "s") rows.sort((x, y) => y.a.s - x.a.s || x.i - y.i);
  else if (sortMode === "a") rows.sort((x, y) => x.a.n.localeCompare(y.a.n, "fr", { sensitivity: "base" }) || x.i - y.i);

  return (
    <>
      <div style={{ margin: "0 0 14px" }}>
        <button type="button" className="main sm wide" onClick={() => { setOk(""); setWiz(true); }}>✨ Suggestions d’ajout d’activités</button>
      </div>
      {ok && <p className="banner" role="status" style={{ margin: "0 0 12px" }}>{ok}</p>}
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
          <thead><tr><th>Activité et ses hormones</th><th className="c">Score</th><th><span className="sr">Supprimer</span></th></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan={3} className="mu">Aucune activité pour ce filtre.</td></tr>}
            {rows.map(({ a }) => [
              <tr key={a.id}>
                <td>
                  <div className="arow">
                    <button type="button" className="emo" aria-label="Changer l’emoji" title="Changer l’emoji" onClick={() => setPickFor(pickFor === a.id ? null : a.id)}>{emo(a)}</button>
                    <div className="aw">{a.n}
                      <div className="chips">
                        {[0, 1, 2, 3].map((k) => <Chip key={k} h={k} on={a.h.includes(k)} onClick={() => chipToggle(a, k)} />)}
                        <select className="tagsel" aria-label="Balise de l’activité" value={a.g} onChange={(e) => { a.g = e.target.value; commit(); }}><TagOptions /></select>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="score">{a.s}</td>
                <td>
                  {a.k ? <span className="lock" role="img" aria-label="Liée à un onglet : ne peut pas être supprimée" title="Liée à un onglet : ne peut pas être supprimée">🔒</span>
                    : <button type="button" className="x" aria-label="Supprimer l’activité" onClick={() => { S.acts = S.acts.filter((k) => k.id !== a.id); commit(); }}>🗑</button>}
                </td>
              </tr>,
              pickFor === a.id && <tr key={a.id + "p"}><td colSpan={3}><Picker onPick={setEmoji} /></td></tr>,
            ])}
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
        <div className="addrow"><span className="mu">Balise :</span>
          <select className="tagsel" aria-label="Balise de la nouvelle activité" value={newT} onChange={(e) => setNewT(e.target.value)}><TagOptions /></select></div>
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

import { useState } from "react";
import { JR } from "./data.js";
import { S, commit } from "./store.js";
import { cap } from "./ui.jsx";

const drafts = { gr: ["", "", ""], sl: ["", "", ""] }; // gardés quand on change d'onglet
const pickRem = (k) => {
  const all = S[k].flatMap((p) => p.items);
  return all.length ? all[Math.floor(Math.random() * all.length)] : null;
};
const dateLong = (t, withYear) => cap(new Date(t).toLocaleDateString("fr-FR",
  { weekday: "long", day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}) }));

export default function Journal({ k }) {
  const c = JR[k], L = S[k];
  const [, setTick] = useState(0);
  const [msg, setMsg] = useState("");
  const [arm, setArm] = useState("");
  const [rem, setRem] = useState(() => pickRem(k));
  const d = drafts[k];

  const save = () => {
    const it = d.map((s) => s.trim()).filter(Boolean);
    if (!it.length) { setMsg("Écris au moins une ligne pour enregistrer ta page."); return; }
    S[k].push({ id: S.next++, t: Date.now(), items: it });
    drafts[k] = ["", "", ""]; setMsg(c.ok); setRem(pickRem(k)); commit();
  };
  const keydown = (e, i) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (i < 2) e.currentTarget.parentNode.parentNode.querySelectorAll(".ln")[i + 1]?.focus();
    else save();
  };

  return (
    <>
      <section style={{ background: c.bg }}>
        <h2><span className="ico">{c.ico}</span><span>{c.title}</span><span className="sn">{L.length + (L.length > 1 ? " pages" : " page")}</span></h2>
        <p className="mu" style={{ margin: "0 0 4px" }}>{c.intro}</p>
        <div className="page">
          <div className="pdate">{dateLong(Date.now())}</div>
          {[0, 1, 2].map((i) => (
            <div className="line" key={i}>
              <span className="num" aria-hidden="true">{i + 1}</span>
              <input className="ln" placeholder={c.ph[i]} aria-label={`${c.title}, ligne ${i + 1}`} maxLength={200}
                value={d[i]} onChange={(e) => { d[i] = e.target.value; setTick((x) => x + 1); }} onKeyDown={(e) => keydown(e, i)} />
            </div>
          ))}
          <p className="hint">{c.hint}</p>
          {msg && <p className="banner" role="status" style={{ margin: "6px 0" }}>{msg}</p>}
          <div className="foot" style={{ margin: "6px 0 2px" }}>
            <button type="button" className="main sm" onClick={save}>Enregistrer ma page</button>
          </div>
        </div>
        {rem && (
          <div className="remcard"><span className="kicker">{c.rem}</span><p className="q">« {rem} »</p>
            <button type="button" className="reset sm" onClick={() => setRem(pickRem(k))}>Un autre</button></div>
        )}
      </section>
      {L.length > 0 && (
        <section style={{ background: "var(--c3)" }}>
          <h2><span className="ico">📖</span><span>Mes pages précédentes</span></h2>
          {L.slice().sort((a, b) => b.t - a.t).map((p) => {
            const on = arm === p.id;
            return (
              <div className="page old" key={p.id}>
                <div className="oldhead"><span className="pdate">{dateLong(p.t, true)}</span>
                  <button type="button" className={"x" + (on ? " warn" : "")} aria-label="Supprimer cette page"
                    onClick={() => {
                      if (on) { S[k] = S[k].filter((q) => q.id !== p.id); setArm(""); commit(); setRem(pickRem(k)); } else setArm(p.id);
                    }}>{on ? "Confirmer ?" : "🗑"}</button></div>
                <ol>{p.items.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

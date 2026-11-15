import { FLOREAL_URL, HABIBITS_URL, JR, LIEN_BTN, emo } from "./data.js";
import { S, addFlower, commit } from "./store.js";
import { LinesInput, hasDraft, msgManque, saveDraft } from "./Journal.jsx";
import Todo from "./Todo.jsx";
import Cerveau from "./Cerveau.jsx";
import { useState } from "react";

const EXTERNES = { habibits: HABIBITS_URL, floreal: FLOREAL_URL };

/* ---------- logique de suggestion (état de session géré par App) ---------- */
export const newSess = (msg) => ({ ph: "idle", excl: [], seen: [], cur: null, hor: null, tied: [], msg: msg || "" });

/* activités encore proposables : pas désactivées, pas déjà vues pendant ce tirage */
const pool = (s, h) => S.acts.filter((a) => !a.off && a.h.includes(h) && !s.seen.includes(a.id));
const reste = (s) => [0, 1, 2, 3].some((h) => pool(s, h).length > 0);

/* Début d'un tirage : on choisit toujours l'hormone dans le cerveau */
export function demarrer(s) {
  Object.assign(s, newSess());
  s.ph = reste(s) ? "choose" : "empty";
}

/* Passe à une autre hormone (après « Pas du tout envie » ou quand une hormone est épuisée) :
   la meilleure au score d'hormone parmi celles pas encore refusées, au hasard en cas d'égalité.
   Si toutes ont été refusées, on reprend celles où il reste des activités, jusqu'à épuiser la base. */
export function decide(s) {
  let cands = [0, 1, 2, 3].filter((h) => !s.excl.includes(h) && pool(s, h).length > 0);
  if (!cands.length) { s.excl = [s.hor]; cands = [0, 1, 2, 3].filter((h) => !s.excl.includes(h) && pool(s, h).length > 0); }
  if (!cands.length) { s.excl = []; cands = [0, 1, 2, 3].filter((h) => pool(s, h).length > 0); }
  if (!cands.length) { s.ph = "empty"; return; }
  const mx = Math.max(...cands.map((h) => S.hs[h]));
  const tied = cands.filter((h) => S.hs[h] === mx);
  propose(s, tied[Math.floor(Math.random() * tied.length)]);
}
export function propose(s, h) {
  const p = pool(s, h);
  if (!p.length) { s.excl.push(h); decide(s); return; }
  const mx = Math.max(...p.map((a) => a.s));
  const top = p.filter((a) => a.s === mx);
  const a = top[Math.floor(Math.random() * top.length)];
  s.cur = a; s.hor = h; s.seen.push(a.id); s.ph = "propose"; s.err = "";
  s.todoBase = a.k === "todo" ? S.todo.filter((t) => t.d).map((t) => t.id) : [];
}

export default function Home({ sess, setSess }) {
  const c = sess.cur;
  const [, setTick] = useState(0);
  /* on mute une copie de la session puis on la republie */
  const act = (fn) => { const s = { ...sess, excl: sess.excl.slice(), seen: sess.seen.slice() }; fn(s); setSess(s); };
  const link = c && c.k;

  if (sess.ph === "idle") return (
    <>
      {sess.msg && (
        <section className="card" style={{ background: "var(--c1)" }}>
          <p className="big" style={{ margin: 0 }}>{sess.msg}</p>
        </section>
      )}
      <section className="card" style={{ background: "var(--c0)" }}>
        <h2>Un petit coup de mou ?</h2>
        <p>Je te propose une activité pour te remettre d’aplomb.</p>
        <button type="button" className="main" onClick={() => act(demarrer)}>Trouver une activité</button>
      </section>
    </>
  );
  if (sess.ph === "choose") return <Cerveau onPick={(h) => act((s) => propose(s, h))} />;
  if (sess.ph === "propose") {
    const saisi = link === "todo" ? S.todo.some((t) => t.d && !(sess.todoBase || []).includes(t.id)) : link && JR[link] ? hasDraft(link) : false;
    const valider = () => act((s) => {
      if (link && JR[link] && !saveDraft(link)) { s.err = msgManque(link); return; }
      if (link === "todo" && !S.todo.some((t) => t.d && !(s.todoBase || []).includes(t.id))) { s.err = "Coche au moins une tâche faite pour valider ton activité."; return; }
      c.s++; c.h.forEach((k) => { S.hs[k]++; }); S.sun++; addFlower(c);
      S.tl.push({ id: S.next++, t: Date.now(), n: c.n, e: emo(c), h: c.h.slice() });
      commit();
      if (link) { Object.assign(s, newSess("Bravo, une activité de plus pour prendre soin de toi 🌼")); s.err = ""; } else s.ph = "yes";
    });
    return (
      <>
      <section className="card" style={{ background: `var(--h${sess.hor})` }}>
        <div className="bigemo" aria-hidden="true">{emo(c)}</div>
        <p className="act">{c.n}</p>
        {link && JR[link] && (
          <div className="page embed">
            <LinesInput k={link} onEnter={valider} onChange={() => setTick((x) => x + 1)} />
            {sess.err && <p className="banner" role="alert" style={{ margin: "6px 0 0" }}>{sess.err}</p>}
          </div>
        )}
        {link === "todo" && (
          <div className="embed"><Todo compact />
            {sess.err && <p className="banner" role="alert" style={{ margin: "6px 0 0" }}>{sess.err}</p>}</div>
        )}
        {EXTERNES[link] && (
          <div style={{ marginBottom: 14 }}>
            <a className="reset" href={EXTERNES[link]} target="_blank" rel="noreferrer">{LIEN_BTN[link]}</a>
          </div>
        )}
        <div className="answers">
          {/* Chaque réponse indique ce qu'elle change au score de l'activité */}
          <button type="button" className="main" onClick={valider}>{saisi ? "Valider ma saisie" : "Oui, je fais ça"} <span className="pts">+1</span></button>
          <button type="button" className="reset" onClick={() => act((s) => { s.err = ""; propose(s, s.hor); })}>Mouais… <span className="pts">0</span></button>
          <button type="button" className="reset" onClick={() => { c.s -= 1; commit(); act((s) => { s.err = ""; s.excl.push(s.hor); decide(s); }); }}>Pas du tout envie <span className="pts">−1</span></button>
          <button type="button" className="reset jamais" onClick={() => { c.off = true; commit(); act((s) => { s.err = ""; propose(s, s.hor); }); }}>Je ne veux plus cette suggestion</button>
        </div>
      </section>
      {/* Retour au cerveau : ne change aucun score (ni l'activité, ni l'hormone) */}
      <div className="retour">
        <button type="button" className="reset" onClick={() => act(demarrer)}>← Revenir au cerveau</button>
      </div>
      </>
    );
  }
  if (sess.ph === "yes") return (
    <section className="card" style={{ background: `var(--h${sess.hor})` }}>
      <div className="bigemo" aria-hidden="true">{emo(c)}</div>
      <p className="kicker">C’est parti !</p>
      <p className="act">{c.n}</p>
      <p>Vas-y, tu vas te faire du bien 🌼</p>
      <p className="mu" style={{ fontSize: 14, marginTop: -6 }}>+1 ☀️ et une nouvelle marguerite dans ton jardin</p>
      <button type="button" className="main" autoFocus onClick={() => setSess(newSess("Bravo, une activité de plus pour prendre soin de toi 🌼"))}>C’est fait ✓</button>
    </section>
  );
  return (
    <section className="card" style={{ background: "var(--c3)" }}>
      <div className="bigemo" aria-hidden="true">🫠</div>
      <h2>Tu as épuisé toute la base de données !</h2>
      <p>Tu as dit non à absolument tout ce qu’on avait en stock. Chapeau, c’est un exploit 😅</p>
      <p>Plus sérieusement : si rien ne te fait envie depuis un moment, ça vaut le coup d’en parler à un professionnel (ton médecin, un psy). Demander de l’aide, c’est aussi prendre soin de toi 💛</p>
      <button type="button" className="main" autoFocus onClick={() => act(demarrer)}>Recommencer</button>
    </section>
  );
}

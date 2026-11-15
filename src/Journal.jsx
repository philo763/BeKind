import { useRef, useState } from "react";
import { JR } from "./data.js";
import { S, commit, pagesDe, definirPages } from "./store.js";
import { cap } from "./ui.jsx";

/* Brouillons gardés quand on change d'onglet. Pour un carnet avec photo,
   la case 0 contient la photo (image réduite, en texte). */
const drafts = {};
const draftOf = (k) => (drafts[k] ||= JR[k].ph.map(() => ""));
const pickRem = (k) => {
  const all = pagesDe(k).flatMap((p) => p.items);
  return all.length ? all[Math.floor(Math.random() * all.length)] : null;
};
const dateLong = (t, withYear) => cap(new Date(t).toLocaleDateString("fr-FR",
  { weekday: "long", day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}) }));

/* Texte à afficher quand il manque une saisie */
export function msgManque(k) {
  const c = JR[k];
  if (c.photo) return "Ajoute une photo pour enregistrer ta page.";
  if (c.req) return "Remplis la première ligne pour enregistrer ta page.";
  return "Écris au moins une ligne pour enregistrer ta page.";
}

/* Enregistre le brouillon comme une nouvelle page. Renvoie false s'il manque une saisie. */
export function saveDraft(k) {
  const c = JR[k], d = draftOf(k);
  if (c.photo) {
    if (!d[0]) return false;
    const items = d.slice(1).map((s) => s.trim()).filter(Boolean);
    pagesDe(k).push({ id: S.next++, t: Date.now(), photo: d[0], items });
  } else {
    const items = d.map((s) => s.trim()).filter(Boolean);
    if (c.req ? c.req.some((i) => !d[i].trim()) : !items.length) return false;
    pagesDe(k).push({ id: S.next++, t: Date.now(), items });
  }
  drafts[k] = JR[k].ph.map(() => "");
  return true;
}

/* Réduit la photo (côté long 640 px, JPEG) pour qu'elle tienne dans le stockage */
function reduire(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const r = Math.min(1, 640 / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.width * r); cv.height = Math.round(img.height * r);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
    img.src = url;
  });
}

function PhotoInput({ d, bump }) {
  const cam = useRef(null), gal = useRef(null);
  const [err, setErr] = useState("");
  const prendre = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    try { d[0] = await reduire(f); setErr(""); } catch { setErr("Cette image n’a pas pu être lue. Essaie une autre photo."); }
    bump();
  };
  return (
    <div className="photo">
      {d[0] && <img src={d[0]} alt="Aperçu de la photo choisie" />}
      <div className="tools" style={{ justifyContent: "flex-start", margin: "4px 0" }}>
        <button type="button" className="reset sm" onClick={() => cam.current.click()}>📷 Prendre une photo</button>
        <button type="button" className="reset sm" onClick={() => gal.current.click()}>🖼️ Ma galerie</button>
        {d[0] && <button type="button" className="reset sm" onClick={() => { d[0] = ""; bump(); }}>Retirer</button>}
      </div>
      <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={prendre} aria-label="Prendre une photo" />
      <input ref={gal} type="file" accept="image/*" hidden onChange={prendre} aria-label="Choisir une photo dans la galerie" />
      {err && <p className="banner" role="alert" style={{ margin: "4px 0" }}>{err}</p>}
    </div>
  );
}

/* Les lignes d'une page (utilisées dans l'onglet et sous la suggestion) */
export function LinesInput({ k, onEnter }) {
  const c = JR[k], d = draftOf(k);
  const [, setTick] = useState(0);
  const bump = () => setTick((x) => x + 1);
  const keydown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const lns = [...e.currentTarget.closest(".page").querySelectorAll(".ln")];
    const next = lns[lns.indexOf(e.currentTarget) + 1];
    if (next) next.focus(); else onEnter?.();
  };
  return (
    <>
      <div className="pdate">{dateLong(Date.now())}</div>
      {c.ph.map((ph, i) => (c.photo && i === 0 ? <PhotoInput key={i} d={d} bump={bump} /> : (
        <div className="line" key={i}>
          {c.ph.length > 1 && <span className="num" aria-hidden="true">{i + 1}</span>}
          <input className="ln" placeholder={ph} aria-label={`${c.title}, ligne ${i + 1}`} maxLength={200}
            value={d[i]} onChange={(e) => { d[i] = e.target.value; bump(); }} onKeyDown={keydown} />
        </div>
      )))}
    </>
  );
}

const nbPages = (n) => n + (n > 1 ? " pages" : " page");

export default function Journal({ k }) {
  const c = JR[k], L = pagesDe(k);
  const [msg, setMsg] = useState("");
  const [arm, setArm] = useState("");
  const [rem, setRem] = useState(() => pickRem(k));

  const save = () => {
    if (!saveDraft(k)) { setMsg(msgManque(k)); return; }
    setMsg(c.ok); setRem(pickRem(k)); commit();
  };

  return (
    <>
      <section style={{ background: c.bg }}>
        <h2><span className="ico">{c.ico}</span><span>{c.title}</span><span className="sn">{nbPages(L.length)}</span></h2>
        <p className="mu" style={{ margin: "0 0 4px" }}>{c.intro}</p>
        <div className="page">
          <LinesInput k={k} onEnter={save} />
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
                      if (on) { definirPages(k, pagesDe(k).filter((q) => q.id !== p.id)); setArm(""); commit(); setRem(pickRem(k)); } else setArm(p.id);
                    }}>{on ? "Confirmer ?" : "🗑"}</button></div>
                {p.photo && <img className="pphoto" src={p.photo} alt="Photo de cette page" />}
                {p.items.length > 0 && <ol>{p.items.map((s, i) => <li key={i}>{s}</li>)}</ol>}
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

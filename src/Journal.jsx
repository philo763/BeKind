import { useRef, useState } from "react";
import { JR } from "./data.js";
import { S, commit, pagesDe, definirPages, fleurDeGratitude } from "./store.js";
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

/* Y a-t-il quelque chose de saisi dans le brouillon ? */
export const hasDraft = (k) => draftOf(k).some((s) => s.trim());

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
    if (k === "gr") items.forEach(fleurDeGratitude);
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
  const cam = useRef(null);
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
        {d[0] && <button type="button" className="reset sm" onClick={() => { d[0] = ""; bump(); }}>Retirer</button>}
      </div>
      <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={prendre} aria-label="Prendre une photo" />
      {err && <p className="banner" role="alert" style={{ margin: "4px 0" }}>{err}</p>}
    </div>
  );
}

/* Les lignes d'une page (utilisées dans l'onglet et sous la suggestion) */
export function LinesInput({ k, onEnter, onChange }) {
  const c = JR[k], d = draftOf(k);
  const [, setTick] = useState(0);
  const bump = () => { setTick((x) => x + 1); onChange?.(); };
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
          {c.ph.length > 1 && !c.photo && <span className="num" aria-hidden="true">{i + 1}</span>}
          <input className="ln" placeholder={ph} aria-label={`${c.title}, ligne ${i + 1}`} maxLength={200}
            value={d[i]} onChange={(e) => { d[i] = e.target.value; bump(); }} onKeyDown={keydown} />
        </div>
      )))}
    </>
  );
}

/* Mot du jour : un calendrier du mois, avec le mot écrit dans la case de chaque jour */
const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
function Calendrier({ L, suppr }) {
  const [mois, setMois] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [sel, setSel] = useState(null);
  const [arm, setArm] = useState(false);
  const parJour = {};
  L.forEach((p) => { const cle = new Date(p.t).toDateString(); if (!parJour[cle] || parJour[cle].t < p.t) parJour[cle] = p; });
  const decal = (mois.getDay() + 6) % 7, nb = new Date(mois.getFullYear(), mois.getMonth() + 1, 0).getDate();
  const auj = new Date().toDateString();
  const aller = (n) => { setMois(new Date(mois.getFullYear(), mois.getMonth() + n, 1)); setSel(null); setArm(false); };
  const p = sel && parJour[sel];
  return (
    <div className="cal">
      <div className="cal-tete">
        <button type="button" className="reset sm" aria-label="Mois précédent" onClick={() => aller(-1)}>‹</button>
        <strong>{cap(mois.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }))}</strong>
        <button type="button" className="reset sm" aria-label="Mois suivant" onClick={() => aller(1)}>›</button>
      </div>
      <div className="cal-grille">
        {JOURS.map((j, i) => <span key={i} className="cal-js" aria-hidden="true">{j}</span>)}
        {Array.from({ length: decal }, (_, i) => <span key={"v" + i} />)}
        {Array.from({ length: nb }, (_, i) => {
          const d = new Date(mois.getFullYear(), mois.getMonth(), i + 1), cle = d.toDateString(), e = parJour[cle];
          return (
            <button key={i} type="button" disabled={!e} aria-pressed={sel === cle ? "true" : "false"}
              className={"cal-j" + (e ? " plein" : "") + (cle === auj ? " auj" : "") + (sel === cle ? " on" : "")}
              aria-label={(i + 1) + (e ? " : " + e.items[0] : "")} onClick={() => { setSel(sel === cle ? null : cle); setArm(false); }}>
              <span className="cal-n">{i + 1}</span>{e && <span className="cal-mot">{e.items[0]}</span>}
            </button>
          );
        })}
      </div>
      {p && (
        <div className="page old" style={{ marginTop: 10 }}>
          <div className="oldhead"><span className="pdate">{dateLong(p.t, true)}</span>
            <button type="button" className={"x" + (arm ? " warn" : "")} aria-label="Supprimer ce mot"
              onClick={() => { if (arm) { suppr(p); setSel(null); setArm(false); } else setArm(true); }}>{arm ? "Confirmer ?" : "🗑"}</button></div>
          <p className="cal-grand">{p.items[0]}</p>
          {p.items.length > 1 && <ol start={2}>{p.items.slice(1).map((s, i) => <li key={i}>{s}</li>)}</ol>}
        </div>
      )}
      {!p && <p className="mu" style={{ fontSize: 14, margin: "8px 2px 0" }}>Touche un jour pour relire ton mot.</p>}
    </div>
  );
}

const nbPages = (n, photo) => n + (photo ? " photo" : " page") + (n > 1 ? "s" : "");

/* Un carnet ouvert. En consultation (ecrire faux) : les pages déjà écrites.
   En écriture : le cadre d'ajout, puis, une fois la page enregistrée, le choix
   entre une nouvelle entrée et le retour au carnet. */
export default function Journal({ k, ecrire, setEcrire, retour, voir }) {
  const c = JR[k], L = pagesDe(k);
  const [msg, setMsg] = useState("");
  const [fini, setFini] = useState(false);
  const [arm, setArm] = useState("");
  const [rem, setRem] = useState(() => pickRem(k));

  const suppr = (p) => { definirPages(k, pagesDe(k).filter((q) => q.id !== p.id)); setArm(""); commit(); setRem(pickRem(k)); };
  const save = () => {
    if (!saveDraft(k)) { setMsg(msgManque(k)); return; }
    setMsg(""); setFini(true); setRem(pickRem(k)); commit();
  };

  if (ecrire && fini) return (
    <section style={{ background: c.bg }}>
      <h2><span className="ico">{c.ico}</span><span>{c.title}</span><span className="sn">{nbPages(L.length, c.photo)}</span></h2>
      <p className="banner" role="status" style={{ margin: "4px 0 14px" }}>{c.ok}</p>
      <div className="jr-suite">
        <button type="button" className="main" autoFocus onClick={() => setFini(false)}>✏️ Faire une nouvelle entrée</button>
        {voir && <button type="button" className="reset" onClick={voir.ouvrir}>{voir.ico} Voir {voir.nom.charAt(0).toLowerCase() + voir.nom.slice(1)}</button>}
        <button type="button" className="reset" onClick={retour}>← Revenir au carnet</button>
      </div>
    </section>
  );

  if (ecrire) return (
    <section style={{ background: c.bg }}>
      <h2><span className="ico">{c.ico}</span><span>{c.title}</span><span className="sn">{nbPages(L.length, c.photo)}</span></h2>
      <p className="mu" style={{ margin: "0 0 4px" }}>{c.intro}</p>
      <div className="page">
        <LinesInput k={k} onEnter={save} />
        <p className="hint">{c.hint}</p>
        {msg && <p className="banner" role="status" style={{ margin: "6px 0" }}>{msg}</p>}
        <div className="foot" style={{ margin: "6px 0 2px" }}>
          <button type="button" className="main sm" onClick={save}>Enregistrer ma page</button>
        </div>
      </div>
    </section>
  );

  return (
    <section style={{ background: c.bg }}>
      <h2><span className="ico">{c.ico}</span><span>{c.title}</span><span className="sn">{nbPages(L.length, c.photo)}</span></h2>
      {!L.length && (
        <div className="jr-vide">
          <p>Vide pour le moment.</p>
{c.photo ? <p className="mu">Elle se remplit avec les activités photo de « Hacker mon cerveau » : sors prendre une photo de quelque chose de beau 📷</p>
            : <><p className="mu">Touche le stylo pour écrire ta première page.</p>
              <button type="button" className="main sm" onClick={() => setEcrire(true)}>✏️ Écrire une page</button></>}
        </div>
      )}
      {k === "mot" && L.length > 0 && <Calendrier L={L} suppr={suppr} />}
      {rem && L.length > 1 && !c.photo && k !== "mot" && (
        <div className="remcard"><span className="kicker">{c.rem}</span><p className="q">« {rem} »</p>
          <button type="button" className="reset sm" onClick={() => setRem(pickRem(k))}>Un autre</button></div>
      )}
      {c.photo && L.length > 0 && (
        <div className="pellicule">
          {L.slice().sort((a, b) => b.t - a.t).map((p) => {
            const on = arm === p.id;
            return (
              <figure className="pell-vue" key={p.id}>
                <img src={p.photo} alt={p.items[0] || "Photo de ma pellicule"} />
                <figcaption>
                  {p.items[0] && <span className="pell-desc">{p.items[0]}</span>}
                  <span className="pell-pied">
                    <span className="pell-date">{dateLong(p.t, true)}</span>
                    <button type="button" className={"x" + (on ? " warn" : "")} aria-label="Supprimer cette photo"
                      onClick={() => { if (on) suppr(p); else setArm(p.id); }}>{on ? "Confirmer ?" : "🗑"}</button>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
      {!c.photo && k !== "mot" && L.slice().sort((a, b) => b.t - a.t).map((p) => {
        const on = arm === p.id;
        return (
          <div className="page old" key={p.id}>
            <div className="oldhead"><span className="pdate">{dateLong(p.t, true)}</span>
              <button type="button" className={"x" + (on ? " warn" : "")} aria-label="Supprimer cette page"
                onClick={() => {
                  if (on) suppr(p); else setArm(p.id);
                }}>{on ? "Confirmer ?" : "🗑"}</button></div>
            {p.photo && <img className="pphoto" src={p.photo} alt="Photo de cette page" />}
            {p.items.length > 0 && <ol>{p.items.map((s, i) => <li key={i}>{s}</li>)}</ol>}
          </div>
        );
      })}
    </section>
  );
}

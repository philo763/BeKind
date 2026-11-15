/* État de l'appli : un objet S (modifié sur place), enregistré via BK, et un
   compteur de version pour que React sache quand redessiner. */
import { useSyncExternalStore } from "react";
import { BK } from "./storage.js";
import { fresh, BASE, FIXE, SUBS, LINK, LINK_ANCIEN, RETIREES, JR_KEYS, gardenH } from "./data.js";

function charger() {
  let S = BK.charger();
  let ch = false;
  if (!S || !Array.isArray(S.acts) || !S.acts.length || !Array.isArray(S.hs) || S.hs.length !== 4) {
    S = fresh();
    ch = true;
  }
  S.tl = S.tl || [];
  S.todo = S.todo || [];
  /* activités renommées (une seule ligne par entrée) : on garde l'activité et son score */
  const RENOMMEES = { "Faire une liste de 3 gratitudes": "Écrire une gratitude", "Écrire 3 choses que j’apprécie chez moi": "Écrire un mot doux pour moi" };
  S.acts.forEach((a) => { if (RENOMMEES[a.n]) { a.n = RENOMMEES[a.n]; ch = true; } });
  /* si le nouveau nom existait déjà (ajouté avant le renommage), on garde l'activité au meilleur score */
  Object.values(RENOMMEES).forEach((n) => {
    const memes = S.acts.filter((a) => a.n === n);
    if (memes.length < 2) return;
    const garde = memes.reduce((x, y) => (y.s > x.s ? y : x));
    S.acts = S.acts.filter((a) => a.n !== n || a === garde);
    ch = true;
  });
  const EM = {};
  BASE.forEach(([e, n]) => { EM[n] = e; });
  const NEW_K = { gratitude: "gr", selflove: "sl" };
  S.acts.forEach((a) => {
    if (!a.e) { a.e = EM[a.n] || "🌼"; ch = true; }
    /* le carnet « Câlins » n'existe plus : l'activité câlin redevient une activité simple */
    if (a.k === "cal") { delete a.k; a.g = "base"; ch = true; }
    /* onglet lié : anciens codes (gratitude, selflove) → codes des onglets */
    const k = LINK[a.n] || LINK_ANCIEN[a.n] || NEW_K[a.k] || (a.k && a.k !== "x" ? a.k : undefined);
    if (k && a.k !== k) { a.k = k; ch = true; }
    /* balise : les anciennes balises (14 thèmes) deviennent balise + sous-balise */
    const OK = ["base", "manuel", "sport", "animaux", "onglet"];
    if (!OK.includes(a.g)) {
      const sub = SUBS.find((x) => x.k === a.g);
      if (sub) { a.g = sub.cat; a.sg = sub.k; } else a.g = "base";
      ch = true;
    }
    if (a.k && a.g !== "onglet") { a.g = "onglet"; ch = true; }
  });
  /* activités perso retirées : on garde un profil générique */
  const avant = S.acts.length;
  S.acts = S.acts.filter((a) => !RETIREES.includes(a.n));
  if (S.acts.length !== avant) ch = true;
  /* hormones ajoutées après coup à une activité de départ (les activités ne se modifient plus dans l'appli) */
  const AJOUTS_H = { "me masser les mains ou les épaules avec une crème": 3 };
  S.acts.forEach((a) => {
    const h = AJOUTS_H[a.n.toLowerCase().replace(/'/g, "’")];
    if (h !== undefined && !a.h.includes(h)) { a.h.push(h); a.h.sort(); ch = true; }
  });
  /* base fixe : chaque activité qui manque (ajoutée depuis) est ajoutée avec un score de 0 */
  const nom = (n) => n.toLowerCase().replace(/'/g, "’").trim();
  const deja = new Set(S.acts.map((a) => nom(a.n)));
  FIXE.forEach((f) => {
    if (!deja.has(nom(f.n))) { S.acts.push({ ...f, id: S.next++, h: f.h.slice(), s: 0 }); ch = true; }
  });
  if (!Array.isArray(S.garden)) {
    S.garden = [];
    S.tl.forEach((v) => addFlowerTo(S, { n: v.n, e: v.e, h: v.h }, v.t));
    ch = true;
  }
  if (typeof S.sun !== "number") { S.sun = S.garden.length; ch = true; }
  /* le jardin devient le jardin de gratitude : une fleur et un soleil par gratitude écrite */
  if (!S.prof || !S.prof.jardinGr) {
    S.garden = [];
    (S.gr || []).slice().sort((x, y) => x.t - y.t).forEach((p) => p.items.forEach((txt) => addFlowerTo(S, { n: txt, e: "🙏", h: teintesFleur() }, p.t)));
    S.sun = S.garden.length;
    S.prof = { ...(S.prof || {}), jardinGr: true };
    ch = true;
  }
  if (!Array.isArray(S.gr)) { S.gr = []; ch = true; }
  if (!Array.isArray(S.sl)) { S.sl = []; ch = true; }
  if (!S.jr || typeof S.jr !== "object") { S.jr = {}; ch = true; }
  JR_KEYS.forEach((k) => { if (k !== "gr" && k !== "sl" && !Array.isArray(S.jr[k])) { S.jr[k] = []; ch = true; } });
  if (ch) BK.sauvegarder(S);
  return S;
}

/* couleurs des pétales d'une fleur de gratitude : une ou deux hormones au hasard */
function teintesFleur() {
  const a = Math.floor(Math.random() * 4), b = Math.floor(Math.random() * 4);
  return a === b ? [a] : [a, b].sort();
}

function addFlowerTo(S, a, when) {
  const n = S.garden.length + 1, H = gardenH(n);
  let best = null, bd = -1;
  for (let i = 0; i < 16; i++) {
    const x = 8 + Math.random() * 84, y = 110 + Math.random() * (H - 125);
    let m = 1e9;
    for (const g of S.garden) m = Math.min(m, Math.hypot((x - g.x) * 6, y - g.y));
    if (m > bd) { bd = m; best = { x, y }; }
  }
  S.garden.push({
    id: S.next++, t: when || Date.now(), n: a.n, e: a.e || "🌼", h: a.h.slice(),
    x: Math.round(best.x * 10) / 10, y: Math.round(best.y), dance: false,
  });
}

export const S = charger();

/* Pages d'un journal : gr et sl ont leurs propres listes, les autres sont dans S.jr */
export const pagesDe = (k) => (k === "gr" ? S.gr : k === "sl" ? S.sl : S.jr[k]);
export const definirPages = (k, l) => { if (k === "gr") S.gr = l; else if (k === "sl") S.sl = l; else S.jr[k] = l; };
export const addFlower = (a, when) => addFlowerTo(S, a, when);
/* Une gratitude écrite : une fleur pousse et un soleil est gagné */
export function fleurDeGratitude(txt) { addFlowerTo(S, { n: txt, e: "🙏", h: teintesFleur() }); S.sun++; }

let version = 0;
const abonnes = new Set();
function notifier() { version++; abonnes.forEach((f) => f()); }

/** Enregistre (si save) et redessine. */
export function commit(save = true) {
  if (save) BK.sauvegarder(S);
  notifier();
}
/** Redessine seulement (état d'interface modifié ailleurs). */
export const redraw = () => notifier();

export function useStore() {
  return useSyncExternalStore(
    (f) => { abonnes.add(f); return () => abonnes.delete(f); },
    () => version,
  );
}

BK.abonner(notifier);
BK.initialiser();

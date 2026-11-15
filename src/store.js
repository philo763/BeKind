/* État de l'appli : un objet S (modifié sur place), enregistré via BK, et un
   compteur de version pour que React sache quand redessiner. */
import { useSyncExternalStore } from "react";
import { BK } from "./storage.js";
import { fresh, BASE, SUBS, LINK, LINK_ANCIEN, MANUELS, JR_KEYS, gardenH } from "./data.js";

function charger() {
  let S = BK.charger();
  let ch = false;
  if (!S || !Array.isArray(S.acts) || !S.acts.length || !Array.isArray(S.hs) || S.hs.length !== 4) {
    S = fresh();
    ch = true;
  }
  S.tl = S.tl || [];
  S.todo = S.todo || [];
  const EM = {};
  BASE.forEach(([e, n]) => { EM[n] = e; });
  const NEW_K = { gratitude: "gr", selflove: "sl" };
  S.acts.forEach((a) => {
    if (!a.e) { a.e = EM[a.n] || "🌼"; ch = true; }
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
    if (!a.k && MANUELS.includes(a.n) && a.g === "base") { a.g = "manuel"; ch = true; }
  });
  if (!Array.isArray(S.garden)) {
    S.garden = [];
    S.tl.forEach((v) => addFlowerTo(S, { n: v.n, e: v.e, h: v.h }, v.t));
    ch = true;
  }
  if (typeof S.sun !== "number") { S.sun = S.garden.length; ch = true; }
  if (!Array.isArray(S.gr)) { S.gr = []; ch = true; }
  if (!Array.isArray(S.sl)) { S.sl = []; ch = true; }
  if (!S.jr || typeof S.jr !== "object") { S.jr = {}; ch = true; }
  JR_KEYS.forEach((k) => { if (k !== "gr" && k !== "sl" && !Array.isArray(S.jr[k])) { S.jr[k] = []; ch = true; } });
  if (ch) BK.sauvegarder(S);
  return S;
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

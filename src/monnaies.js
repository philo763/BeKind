/* Monnaies des pages visuelles du carnet.
   On gagne 1 pièce par entrée du carnet lié ; les dépenses et les achats sont gardés
   dans le profil (S.prof), qui fait déjà partie des sauvegardes. */
import { S, commit, pagesDe } from "./store.js";

export const MONNAIES = {
  sl: { un: "sourire", plusieurs: "sourires", e: "😊" },
  res: { un: "goutte de pluie", plusieurs: "gouttes de pluie", e: "💧" },
  car: { un: "caillou", plusieurs: "cailloux", e: "🪨" },
  vic: { un: "chaussure", plusieurs: "chaussures", e: "👟" },
};

const profil = () => (S.prof ||= {});

/* Les éléments d'une page : une entrée par ligne écrite (une seule ligne par entrée désormais) */
export const elements = (k) => pagesDe(k).flatMap((p) =>
  (p.items.length ? (k === "res" ? [p.items.join(" · ")] : p.items) : [""]).map((txt, i) => ({ id: p.id + "-" + i, n: p.id * 7 + i, t: p.t, txt, items: p.items, p, i })));

export const gagnees = (k) => elements(k).length;
export const solde = (k) => Math.max(0, gagnees(k) - ((profil().depense || {})[k] || 0));
export const achats = (k) => ((profil().achats ||= {})[k] ||= {});
export const libelle = (k, n) => n + " " + (n > 1 ? MONNAIES[k].plusieurs : MONNAIES[k].un);

/* Achète un article : renvoie false s'il manque des pièces */
export function acheter(k, id, prix) {
  if (solde(k) < prix) return false;
  const p = profil();
  p.depense ||= {};
  p.depense[k] = (p.depense[k] || 0) + prix;
  achats(k)[id] = true;
  commit();
  return true;
}
export function choisir(k, groupe, id) { achats(k)["@" + groupe] = id; commit(); }

/* Nombre pseudo-aléatoire stable (même résultat pour le même élément) */
export const hasard = (n, sel = 1) => { const x = Math.sin(n * 12.9898 + sel * 78.233) * 43758.5453; return x - Math.floor(x); };

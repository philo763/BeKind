/* Illustrations des activités, affichées pendant le tour (Hacker mon cerveau).
   Clé : nom de l'activité en minuscules, avec l'apostrophe typographique.
   Une scène remplit le cadre ; un sujet détouré (fond transparent) s'affiche en entier, sans recadrage. */
import parcForet from "./assets/illustrations/parc-foret.webp";
import cachou from "./assets/illustrations/chien-cachou.webp";
import floki from "./assets/illustrations/chien-floki.webp";
import nala from "./assets/illustrations/chat-nala.webp";
import kuma from "./assets/illustrations/chat-kuma.webp";

const scene = (src) => ({ src, detoure: false });
const detoure = (src) => ({ src, detoure: true });

const ILLUS = {
  "aller dans un parc ou en forêt": scene(parcForet),
  /* activités avec chien : Cachou pour les moments calmes, Floki pour le jeu et le sport */
  "faire un câlin à mon chien": detoure(cachou),
  "brosser mon chien tout doucement": detoure(cachou),
  "donner un bain à mon chien": detoure(cachou),
  "faire une promenade avec mon chien": detoure(cachou),
  "faire une longue balade au grand air avec mon chien": detoure(cachou),
  "jouer avec mon chien": detoure(floki),
  "cacher des friandises dans la maison pour mon chien": detoure(floki),
  "apprendre un nouveau tour à mon chien": detoure(floki),
  "courir ou trottiner avec mon chien": detoure(floki),
  /* activités avec chat : Nala pour la douceur, Kuma pour le jeu */
  "câliner mon chat": detoure(nala),
  "écouter mon chat ronronner sur mes genoux": detoure(nala),
  "brosser mon chat": detoure(nala),
  "jouer avec mon chat avec une plume ou une ficelle": detoure(kuma),
  "prendre mon chat en photo dans sa plus belle pose": detoure(kuma),
};

export const illustration = (a) => ILLUS[a.n.toLowerCase().replace(/'/g, "’").trim()];

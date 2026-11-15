import { useLayoutEffect, useRef, useState } from "react";
import { S, useStore } from "./store.js";
import { emo } from "./data.js";

/* Les 4 hormones du bonheur, dans l'ordre de HN (data.js) : mêmes couleurs que le reste de l'appli (--h0..3 / --s0..3).
   sent : les sentiments associés. roles : [emoji, rôle, activités liées (noms de la base de données)].
   Une activité peut être rangée dans plusieurs rôles ; elle n'apparaît que si elle a cette hormone dans la base. */
const HORMONES = [
  {
    nom: "Dopamine", e: "🎯", role: "La motivation et la récompense",
    sent: ["Plaisir", "Motivation", "Récompense"],
    roles: [
      ["🚀", "Donne l’envie d’agir et de se lancer", [
        "Faire le lit et aérer la pièce", "Me doucher et m’habiller comme si je sortais", "Faire une courte séance de yoga ou de sport",
        "Ranger mon bureau", "Boire un grand verre d’eau", "Choisir un mot pour guider ma journée", "Faire un flow de yoga dynamique de 15 minutes", "Courir sur un parcours que je ne connais pas", "Aller faire une course à vélo",
      ]],
      ["🏅", "Procure le plaisir d’un objectif atteint", [
        "Faire mon Habibit du jour", "Faire une entrée dans Floreal Fitness Tracker", "Faire une tâche de ma to-do list", "Noter mes petites victoires de la semaine",
        "Avancer d’une toute petite étape sur un projet perso", "Choisir mes 10 plus belles photos et les imprimer", "Apprendre un nouveau tour à mon chien", "Faire des fractionnés : 6 fois 1 minute rapide", "Faire 3 séries de squats", "Tenir la planche pendant 1 minute", "Faire 10 minutes de gainage", "Faire quelques pompes, même sur les genoux", "Marcher jusqu’à un endroit avec une jolie vue",
      ]],
      ["🔎", "Aide à se concentrer et à rester motivé·e", [
        "Trier mes mails", "Dessiner ou créer quelque chose pour le plaisir",
        "Écrire quelques lignes libres ou un petit poème", "Faire un croquis de ce que je vois autour de moi", "Apprendre quelques notes d’un nouvel air", "Colorier un mandala", "Tenir la posture de l’arbre 1 minute de chaque côté", "Apprendre quelques pas d’une nouvelle chorégraphie",
      ]],
      ["🔁", "Pousse à répéter ce qui fait du bien", [
        "Me faire un café", "Me préparer un thé que j’aime et le savourer sans écran", "Faire un soin (masque, crème)", "Prendre un bain", "Regarder un épisode de série",
        "Composer un petit bouquet ou arranger des fleurs", "Jouer un morceau que j’aime", "Composer une playlist qui me fait du bien", "Prendre en photo quelque chose de beau autour de moi", "Aller faire du shopping", "Photographier trois belles choses dehors", "Cacher des friandises dans la maison pour mon chien", "Prendre mon chat en photo dans sa plus belle pose", "Pédaler jusqu’à un endroit que j’aime", "Ramasser une jolie feuille ou un caillou en chemin",
      ]],
    ],
  },
  {
    nom: "Ocytocine", e: "🤗", role: "Le lien et la confiance",
    sent: ["Lien social", "Amour", "Confiance"],
    roles: [
      ["🫶", "Renforce l’attachement et la connexion aux autres", [
        "Appeler un proche", "Envoyer un message à quelqu’un à qui je pense", "Proposer un café ou une balade à une amie",
        "Aller dans un lieu avec du monde (café, marché)", "Jouer avec mon chien", "Regarder de belles photos ou d’anciens messages tendres",
        "Choisir mes 10 plus belles photos et les imprimer", "Cacher des friandises dans la maison pour mon chien", "Apprendre un nouveau tour à mon chien", "Jouer avec mon chat avec une plume ou une ficelle", "Prendre mon chat en photo dans sa plus belle pose", "Danser sur la chanson de mon adolescence",
      ]],
      ["🤝", "Favorise la confiance et l’empathie", [
        "Écrire un petit mot gentil à quelqu’un", "Remercier ou féliciter quelqu’un", "Écrire un mot doux pour moi",
        "Écrire une lettre à moi-même pour dans un an", "Envoyer un compliment sincère à quelqu’un",
      ]],
      ["🛡️", "Apaise le stress, donne un sentiment de sécurité", [
        "Me blottir sous un plaid avec une boisson chaude", "Prendre une douche ou un bain chaud", "Écouter une musique douce et réconfortante",
        "Composer un petit bouquet ou arranger des fleurs", "Mettre des chaussettes bien douillettes", "Écouter mon chat ronronner sur mes genoux",
      ]],
      ["💞", "Libérée par le contact et la tendresse", [
        "Faire un câlin à quelqu’un (20 secondes minimum)", "Faire un câlin à mon chien", "Me masser les mains ou les épaules avec une crème",
        "Brosser mon chien tout doucement", "Donner un bain à mon chien", "Câliner mon chat", "Brosser mon chat",
      ]],
    ],
  },
  {
    nom: "Sérotonine", e: "☀️", role: "L’humeur et l’équilibre",
    sent: ["Bien-être", "Humeur", "Sommeil"],
    roles: [
      ["🌈", "Stabilise l’humeur, apporte de la sérénité", [
        "Marcher dehors (20 min minimum)", "Aller dans un parc ou en forêt", "Faire une promenade avec mon chien",
        "Courir doucement (20 min minimum)", "Noter dans un carnet ce qui me pèse et ce qui va bien",
        "Composer une playlist qui me fait du bien", "Prendre en photo quelque chose de beau autour de moi", "Photographier trois belles choses dehors", "Écrire ce que je ressens, sans me juger", "Courir ou trottiner avec mon chien", "Faire une longue balade au grand air avec mon chien", "Faire un footing tranquille dans un parc", "Faire une balade à vélo tranquille", "Faire un tour à vélo au coucher du soleil", "Marcher jusqu’à un endroit avec une jolie vue", "Faire une marche rapide en musique",
      ]],
      ["🌟", "Nourrit la confiance en soi et la fierté", [
        "Écrire une gratitude", "Noter dans un carnet ce qui me pèse et ce qui va bien",
        "Écrire quelques lignes libres ou un petit poème", "Écrire une lettre à moi-même pour dans un an", "Choisir un mot pour guider ma journée",
      ]],
      ["🌙", "Aide à réguler le sommeil et l’appétit", [
        "Aller à la lumière du jour, près d’une fenêtre ou dehors", "M’asseoir au soleil quelques minutes", "Faire des étirements lents",
        "Boire un grand verre d’eau",
      ]],
      ["🍃", "Participe au calme intérieur", [
        "Méditer (10 min minimum)", "Faire une respiration profonde / cohérence cardiaque (5 min)", "Faire du yoga doux",
        "Écouter de la musique calme les yeux fermés", "Marcher pieds nus dans l’herbe", "Observer le ciel et la nature sans téléphone",
        "Faire un croquis de ce que je vois autour de moi", "Colorier un mandala", "Écouter un album en entier sans rien faire d’autre", "Lire quelques pages d’un livre", "Ouvrir la fenêtre et prendre 5 grandes inspirations", "Écouter mon chat ronronner sur mes genoux", "Faire quelques salutations au soleil", "Faire 10 minutes de yin yoga", "Tenir la posture de l’arbre 1 minute de chaque côté", "Finir par 5 minutes de savasana", "Danser lentement les yeux fermés", "Ramasser une jolie feuille ou un caillou en chemin",
      ]],
    ],
  },
  {
    nom: "Endorphines", e: "💪", role: "Le soulagement et l’euphorie",
    sent: ["Relaxation", "Anti-stress", "Euphorie"],
    roles: [
      ["🩹", "Atténuent la douleur : un antidouleur naturel", [
        "Se faire un massage", "Me masser les mains ou les épaules avec une crème",
      ]],
      ["😮‍💨", "Réduisent le stress et l’anxiété", [
        "Regarder un film ou un sketch drôle", "Regarder des vidéos d’animaux", "Appeler quelqu’un qui me fait rire",
        "Jouer à un jeu qui me fait rire", "Chanter à tue-tête", "Secouer tout mon corps pendant 2 minutes",
        "Jouer un morceau que j’aime", "Faire du karaoke", "Jouer avec mon chat avec une plume ou une ficelle", "Courir en musique sans regarder ma montre", "Faire un footing tranquille dans un parc", "Danser sur la chanson de mon adolescence",
      ]],
      ["🎉", "Procurent une sensation d’euphorie après l’effort", [
        "Faire un entraînement court et intense (15 min)", "Courir (20 min minimum)", "Faire une séance de renforcement musculaire",
        "Faire du vélo", "Faire une marche rapide", "Danser comme si personne ne regardait", "Faire une grosse séance de danse",
        "Faire une entrée dans Floreal Fitness Tracker",
        "Faire une vidéo tuto de danse", "Courir ou trottiner avec mon chien", "Faire un flow de yoga dynamique de 15 minutes", "Faire des fractionnés : 6 fois 1 minute rapide", "Courir sur un parcours que je ne connais pas", "Pédaler jusqu’à un endroit que j’aime", "Aller faire une course à vélo", "Faire 30 minutes de vélo d’appartement en musique", "Apprendre quelques pas d’une nouvelle chorégraphie", "Faire 3 séries de squats", "Tenir la planche pendant 1 minute", "Faire 10 minutes de gainage", "Faire quelques pompes, même sur les genoux", "Faire une marche rapide en musique",
      ]],
      ["🧘", "Détendent le corps", [
        "Respirer des huiles essentielles en m’étirant",
        "Faire une séance de pilates", "Faire quelques salutations au soleil", "Faire une balade à vélo tranquille", "Danser lentement les yeux fermés",
      ]],
    ],
  },
];

/* Les noms sont comparés sans tenir compte des majuscules ni du type d'apostrophe */
/* Les activités créées à la main (balise « manuel ») ne figurent pas dans l'infographie */
const visible = (a, i) => a.g !== "manuel" && a.h.includes(i);
const norm = (s) => s.toLowerCase().replace(/'/g, "’").trim();
const actsDuRole = (i, noms) => {
  const voulu = noms.map(norm);
  return S.acts.filter((a) => visible(a, i) && voulu.includes(norm(a.n)))
    .sort((a, b) => voulu.indexOf(norm(a.n)) - voulu.indexOf(norm(b.n)));
};

/* Carte mentale : un centre (avec ses sentiments) relié aux bulles du haut et du bas.
   Les branches sont tracées d'après la position réelle des bulles. */
function Carte({ centre, sent = [], haut, bas, couleur, teinte }) {
  const boite = useRef(null);
  const [traits, setTraits] = useState([]);
  useLayoutEffect(() => {
    const el = boite.current;
    if (!el) return undefined;
    const pos = (n) => {
      let x = n.offsetWidth / 2, y = n.offsetHeight / 2;
      for (let p = n; p && p !== el; p = p.offsetParent) { x += p.offsetLeft; y += p.offsetTop; }
      return [x, y];
    };
    const mesurer = () => {
      const c = el.querySelector("[data-centre]");
      if (!c) return;
      const [cx, cy] = pos(c);
      setTraits([...el.querySelectorAll("[data-b]")].map((n) => {
        const [x, y] = pos(n);
        return { d: `M${cx} ${cy} C${(cx + x) / 2} ${cy} ${x} ${(cy + y) / 2} ${x} ${y}`, k: n.dataset.b, s: n.dataset.s === "1" };
      }));
    };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    if (document.fonts) document.fonts.ready.then(mesurer);
    return () => ro.disconnect();
  }, [haut.length, bas.length, sent.length]);

  const grille = (liste, decal) => (
    <div className={"hm-grid" + (liste.length % 2 ? " impair" : "")}>
      {liste.map((b, j) => <div key={j} className="hm-cell" data-b={decal + j} style={{ "--d": decal + j }}>{b}</div>)}
    </div>
  );
  return (
    <div className="hm-map" ref={boite} style={teinte === undefined ? undefined : { "--hb": `var(--h${teinte})`, "--hc": `var(--s${teinte})` }}>
      <svg className="hm-lines" aria-hidden="true">
        {traits.map((t) => (
          <path key={t.k} pathLength="1" d={t.d} stroke={couleur(t.s ? -1 : Number(t.k))} className={t.s ? "sent" : ""} style={{ "--d": t.s ? 0 : Number(t.k) }} />
        ))}
      </svg>
      {grille(haut, 0)}
      <div className="hm-mid">
        <div data-centre="">{centre}</div>
        {sent.length > 0 && (
          <ul className="hm-sents" aria-label="Sentiments associés">
            {sent.map((s, j) => <li key={s} data-b={"s" + j} data-s="1" style={{ "--d": j }}>{s}</li>)}
          </ul>
        )}
      </div>
      {grille(bas, haut.length)}
    </div>
  );
}

function VueGenerale({ ouvrir }) {
  return (
    <>
      <p className="hm-intro mu">Touche une hormone pour découvrir ses rôles.</p>
      <Carte
        couleur={(i) => `var(--s${i})`}
        centre={<div className="hm-center"><span aria-hidden="true">🧠</span>Hormones<br />du bonheur</div>}
        haut={HORMONES.slice(0, 2).map((x, i) => <Bulle key={x.nom} x={x} i={i} ouvrir={ouvrir} />)}
        bas={HORMONES.slice(2).map((x, i) => <Bulle key={x.nom} x={x} i={i + 2} ouvrir={ouvrir} />)}
      />
    </>
  );
}

function Bulle({ x, i, ouvrir }) {
  return (
    <button type="button" className="hm-node" style={{ "--hb": `var(--h${i})`, "--hc": `var(--s${i})` }} onClick={() => ouvrir(i)}>
      <span className="hm-e" aria-hidden="true">{x.e}</span>
      <span className="hm-n">{x.nom}</span>
      <span className="hm-r">{x.role}</span>
    </button>
  );
}

function VueHormone({ i, retour, ouvrirRole }) {
  const h = HORMONES[i];
  const acts = S.acts.filter((a) => visible(a, i)).sort((a, b) => a.n.localeCompare(b.n, "fr"));
  const style = { "--hb": `var(--h${i})`, "--hc": `var(--s${i})` };
  const role = ([e, t, noms], j) => (
    <button key={t} type="button" className="hm-node hm-role" style={style} onClick={() => ouvrirRole(j)}>
      <span className="hm-e" aria-hidden="true">{e}</span>
      <span className="hm-r">{t}</span>
      <span className="hm-nb">{actsDuRole(i, noms).length} activité{actsDuRole(i, noms).length > 1 ? "s" : ""}</span>
    </button>
  );
  return (
    <>
      <div className="hm-back">
        <button type="button" className="reset sm" onClick={retour}>← Les 4 hormones</button>
      </div>
      <p className="hm-intro mu">Touche un rôle pour voir les activités qui l’aident.</p>
      <Carte
        couleur={() => `var(--s${i})`}
        teinte={i}
        sent={h.sent}
        centre={
          <button type="button" className="hm-center hm-center-h" style={style} onClick={retour} aria-label={`${h.nom}, revenir aux 4 hormones`}>
            <span aria-hidden="true">{h.e}</span>
            <span className="hm-ct"><span className="hm-n">{h.nom}</span><span className="hm-r">{h.role}</span></span>
          </button>
        }
        haut={h.roles.slice(0, 2).map((r, j) => role(r, j))}
        bas={h.roles.slice(2).map((r, j) => role(r, j + 2))}
      />

      <section className="hm-stim" style={{ background: `var(--h${i})`, "--hc": `var(--s${i})` }}>
        <h2><span className="ico">✨</span><span>Pour la stimuler</span><span className="hm-count mu">{acts.length} activité{acts.length > 1 ? "s" : ""}</span></h2>
        {acts.length ? (
          <ul className="hm-acts">
            {acts.map((a, j) => (
              <li key={a.id} style={{ "--d": Math.min(j, 12) }}><span aria-hidden="true">{emo(a)}</span>{a.n}</li>
            ))}
          </ul>
        ) : (
          <p className="mu" style={{ margin: "0 0 6px" }}>Aucune activité de ta base de données n’est encore liée à cette hormone.</p>
        )}
        <p className="hm-note mu">Les activités viennent de ta base de données. Pour les modifier, va dans « Base de données ».</p>
      </section>
    </>
  );
}

function VueRole({ i, j, retour }) {
  const h = HORMONES[i];
  const [e, t, noms] = h.roles[j];
  const acts = actsDuRole(i, noms);
  const moitie = Math.ceil(acts.length / 2);
  const style = { "--hb": `var(--h${i})`, "--hc": `var(--s${i})` };
  const bulle = (a) => (
    <div key={a.id} className="hm-node hm-act" style={style}>
      <span className="hm-e" aria-hidden="true">{emo(a)}</span>
      <span className="hm-r">{a.n}</span>
    </div>
  );
  return (
    <>
      <div className="hm-back">
        <button type="button" className="reset sm" onClick={retour}>← {h.e} {h.nom}</button>
      </div>
      <Carte
        couleur={() => `var(--s${i})`}
        centre={
          <button type="button" className="hm-center hm-center-h hm-center-r" style={style} onClick={retour} aria-label={`${t}, revenir à ${h.nom}`}>
            <span aria-hidden="true">{e}</span>
            <span className="hm-ct"><span className="hm-r">{h.nom}</span><span className="hm-n">{t}</span></span>
          </button>
        }
        haut={acts.slice(0, moitie).map(bulle)}
        bas={acts.slice(moitie).map(bulle)}
      />
      {!acts.length && <p className="mu" style={{ textAlign: "center" }}>Aucune activité de ta base de données n’est encore rangée ici.</p>}
    </>
  );
}

export default function Hormones() {
  useStore(); // suit les changements de la base de données
  const [vue, setVue] = useState({ h: null, r: null });
  const aller = (h, r = null) => { setVue({ h, r }); window.scrollTo({ top: 0 }); };
  let contenu;
  if (vue.h === null) contenu = <VueGenerale ouvrir={(h) => aller(h)} />;
  else if (vue.r === null) contenu = <VueHormone i={vue.h} retour={() => aller(null)} ouvrirRole={(r) => aller(vue.h, r)} />;
  else contenu = <VueRole i={vue.h} j={vue.r} retour={() => aller(vue.h)} />;
  return (
    <>
      <div key={`${vue.h}-${vue.r}`} className="hm-vue">{contenu}</div>
      <p className="hm-note mu">Infos simplifiées, qui ne remplacent pas un avis médical.</p>
    </>
  );
}

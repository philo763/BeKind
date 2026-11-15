/* Données fixes de Be Kind : hormones, base de départ, suggestions, journaux */
export const HN=["Dopamine","Ocytocine","Sérotonine","Endorphines"];
export const CN=["orange","rose","jaune","bleu"];
export const EL=["🌼","🌸","🌷","🌻","🌿","🌳","☀️","🌈","⭐","✨","💖","💌","🤗","🙏","💪","🏃","🚶","🚴","🏊","🧘","💃","🎶","🎧","🎤","🎨","✍️","📓","📚","📷","🎮","🎬","📺","📞","💻","✅","🧹","🛏️","🚿","🛁","🧴","☕","🍵","🍎","🥗","🍫","🐶","🐱","🎾","🕯️","🌙","☁️","🌬️","🧣","🛋️","🎁","🏆","🎯"];
export const DANCE=3;
export function pad(n){return(n<10?"0":"")+n}
export function sod(d){var x=new Date(d);x.setHours(0,0,0,0);return x}
export function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
export function emo(a){return a.e||"🌼"}
export function firstEmoji(s){s=(s||"").trim();if(!s)return"";try{if(window.Intl&&Intl.Segmenter){var it=new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(s)[Symbol.iterator]().next();return it.value.segment}}catch(e){}return Array.from(s)[0]}
export function gardenH(n){return Math.max(380,380+Math.ceil(Math.max(0,n-14)/7)*90)}

/* Balises (colonne « Balise » du tableau des activités) */
export const BALISES=[
  {k:"base",l:"Base de départ"},{k:"manuel",l:"Manuel"},{k:"sport",l:"Suggestion Sport"},
  {k:"animaux",l:"Suggestion Animaux"},{k:"onglet",l:"Lié à un onglet"},
];
export const balLabel=(k)=>(BALISES.find((b)=>b.k===k)||{l:k}).l;
/* Sous-balises : une par type de suggestion proposé par l'assistant */
export const SUBS=[
  {k:"chien",l:"Chien",e:"🐶",cat:"animaux"},{k:"chat",l:"Chat",e:"🐱",cat:"animaux"},
  {k:"yoga",l:"Yoga",e:"🧘",cat:"sport"},{k:"course",l:"Course",e:"🏃",cat:"sport"},
  {k:"velo",l:"Vélo",e:"🚴",cat:"sport"},{k:"danse",l:"Danse",e:"💃",cat:"sport"},
  {k:"muscu",l:"Muscu",e:"🏋️",cat:"sport"},{k:"marche",l:"Marche",e:"🚶",cat:"sport"},
  {k:"meditation",l:"Méditation",e:"🧘‍♀️",cat:"sport"},
];
export const subCat=(k)=>(SUBS.find((s)=>s.k===k)||{}).cat||"";

/* Base de départ : [emoji, activité, hormones, onglet lié (facultatif)] */
export const BASE=[
["✅", "Faire une tâche de ma to-do list", [0], "todo"],
["🧴", "Faire un soin (masque, crème)", [0]],
["📧", "Trier mes mails", [0]],
["☕", "Me faire un café", [0]],
["🎯", "Faire mon Habibit du jour", [0], "habibits"],
["🌸", "Faire une entrée dans Floreal Fitness Tracker", [0, 3], "floreal"],
["🚿", "Me doucher", [0]],
["🛏️", "Faire le lit et aérer la pièce", [0]],
["🛁", "Prendre un bain", [0]],
["🍵", "Me préparer un thé que j’aime et le savourer sans écran", [0]],
["📺", "Regarder un épisode de série", [0]],
["🎨", "Dessiner ou créer quelque chose pour le plaisir", [0]],
["🏆", "Noter mes petites victoires de la semaine", [0], "vic"],
["📝", "Écrire quelques lignes libres ou un petit poème", [0, 2]],
["✏️", "Faire un croquis de ce que je vois autour de moi", [0, 2]],
["💐", "Composer un petit bouquet ou arranger des fleurs", [0, 1]],
["🎸", "Jouer un morceau que j’aime", [0, 3]],
["🎧", "Composer une playlist qui me fait du bien", [0, 2]],
["🎹", "Apprendre quelques notes d’un nouvel air", [0]],
["🧩", "Avancer d’une toute petite étape sur un projet perso", [0]],
["🖼️", "Choisir mes 10 plus belles photos et les imprimer", [0, 1]],
["🗂️", "Ranger mon bureau", [0]],
["💧", "Boire un grand verre d’eau", [0, 2]],
["📸", "Prendre en photo quelque chose de beau autour de moi", [0, 2], "bel"],
["👗", "Enlever mon jogging et m’habiller comme si je sortais", [0]],
["🛍️", "Aller faire du shopping", [0]],
["📞", "Appeler un proche", [1]],
["💌", "Envoyer un message à quelqu’un à qui je pense", [1]],
["👯", "Proposer un café ou une balade à une amie", [1]],
["🛍️", "Aller dans un lieu avec du monde (café, marché)", [1]],
["🛋️", "Me blottir sous un plaid avec une boisson chaude", [1]],
["🛀", "Prendre un bain chaud", [1]],
["🎧", "Écouter une musique douce et réconfortante", [1]],
["💆", "Me masser les mains ou les épaules avec une crème", [1]],
["✍️", "Laisser un post-it gentil à quelqu’un", [1]],
["🖼️", "Regarder de belles photos ou d’anciens messages tendres", [1]],
["🤗", "Faire un câlin à quelqu’un", [1], "cal"],
["🙏", "Féliciter quelqu’un", [1]],
["💖", "Écrire 3 choses que j’apprécie chez moi", [1], "sl"],
["💌", "Écrire une lettre à moi-même pour dans un an", [1, 2]],
["💬", "Envoyer un compliment sincère à quelqu’un", [1]],
["🧦", "Mettre des chaussettes bien douillettes", [1]],
["😊", "Remercier quelqu’un", [1]],
["🌬️", "Faire de la cohérence cardiaque", [2]],
["🎶", "Écouter de la musique calme les yeux fermés", [2]],
["🙆", "Faire des étirements lents", [2]],
["📓", "Noter dans un carnet ce qui me pèse et ce qui va bien", [2], "car"],
["🌈", "Faire une liste de 3 gratitudes", [2], "gr"],
["🌤️", "Aller à la lumière du jour, près d’une fenêtre ou dehors", [2]],
["🌳", "Aller dans un parc ou en forêt", [2]],
["☀️", "M’asseoir au soleil quelques minutes", [2]],
["🌱", "Marcher pieds nus dans l’herbe", [2]],
["☁️", "Observer le ciel (sans téléphone)", [2]],
["📷", "Photographier trois belles choses dehors", [2, 0]],
["🖍️", "Colorier un mandala", [2, 0]],
["💿", "Écouter un album en entier sans rien faire d’autre", [2]],
["📖", "Lire quelques pages d’un livre", [2]],
["🔑", "Choisir un mot pour guider ma journée", [2, 0], "mot"],
["📓", "Écrire ce que je ressens, sans me juger", [2], "res"],
["🪟", "Ouvrir la fenêtre et prendre 5 grandes inspirations", [2]],
["🙌", "Secouer tout mon corps pendant 2 minutes", [3]],
["🌿", "Respirer des huiles essentielles en m’étirant", [3]],
["🎬", "Regarder un film ou un sketch drôle", [3]],
["🎤", "Faire du karaoke", [3]],
["😂", "Appeler quelqu’un qui me fait rire", [3]],
["🚿", "Chanter sous la douche", [3]]
];
export const SUGG=[
["yoga", "🤸", "Faire une séance de yoga", [0]],
["chien", "🎾", "Jouer avec mon chien", [1]],
["chien", "🐶", "Faire un câlin à mon chien", [1]],
["meditation", "🧘", "Méditer", [2]],
["yoga", "🧘‍♀️", "Faire du yoga doux", [2]],
["marche", "🚶", "Marcher dehors (20 min minimum)", [2]],
["course", "🏃", "Aller courir 20 min", [2]],
["chien", "🐕", "Faire une promenade avec mon chien", [2]],
["yoga", "💪", "Faire une séance de pilates", [3]],
["marche", "👟", "Faire une marche rapide", [3]],
["muscu", "🏋️", "Faire une séance de renforcement musculaire", [3]],
["velo", "🚴", "Faire du vélo", [3]],
["danse", "🪩", "Faire une vidéo tuto de danse", [3]],
["chien", "🦴", "Cacher des friandises dans la maison pour mon chien", [1, 0]],
["chien", "🪮", "Brosser mon chien tout doucement", [1]],
["chien", "🎓", "Apprendre un nouveau tour à mon chien", [0, 1]],
["chien", "🐕‍🦺", "Courir ou trottiner avec mon chien", [3, 2]],
["chien", "🌲", "Faire une longue balade au grand air avec mon chien", [2]],
["chat", "😻", "Câliner mon chat", [1]],
["chat", "🪶", "Jouer avec mon chat avec une plume ou une ficelle", [1, 3]],
["chat", "🎵", "Écouter mon chat ronronner sur mes genoux", [1, 2]],
["chat", "🪮", "Brosser mon chat", [1]],
["chat", "📸", "Prendre mon chat en photo dans sa plus belle pose", [0, 1]],
["yoga", "☀️", "Faire quelques salutations au soleil", [2, 3]],
["yoga", "🧘", "Faire 10 minutes de yin yoga", [2]],
["yoga", "🌳", "Tenir la posture de l’arbre 1 minute de chaque côté", [2, 0]],
["yoga", "🔥", "Faire un flow de yoga dynamique de 15 minutes", [3, 0]],
["yoga", "😌", "Finir par 5 minutes de savasana", [2]],
["course", "🏃", "Faire un footing de 15 minutes", [3]],
["course", "⚡", "Faire des fractionnés : 6 fois 1 minute rapide", [3, 0]],
["course", "🗺️", "Courir sur un parcours que je ne connais pas", [3, 0]],
["course", "🎧", "Courir en musique sans regarder ma montre", [3]],
["course", "🌳", "Faire un footing tranquille dans un parc", [2, 3]],
["velo", "🚲", "Faire une balade à vélo tranquille", [2, 3]],
["velo", "📍", "Pédaler jusqu’à un endroit que j’aime", [3, 0]],
["velo", "🌇", "Faire un tour à vélo au coucher du soleil", [2]],
["velo", "🛒", "Aller faire une course à vélo", [0, 3]],
["velo", "🎶", "Faire 30 minutes de vélo d’appartement en musique", [3]],
["danse", "🕺", "Apprendre quelques pas d’une nouvelle chorégraphie", [0, 3]],
["danse", "🪩", "Danser sur la chanson de mon adolescence", [3, 1]],
["danse", "💫", "Danser lentement les yeux fermés", [2, 3]],
["muscu", "🦵", "Faire 3 séries de squats", [3, 0]],
["muscu", "💪", "Tenir la planche pendant 1 minute", [0, 3]],
["muscu", "🧱", "Faire 10 minutes de gainage", [0, 3]],
["muscu", "🤸", "Faire une mini séance de pilates", [2, 3]],
["muscu", "🏋️", "Faire quelques pompes, même sur les genoux", [0, 3]],
["marche", "🚶", "Faire une marche de 30 minutes sans écouteurs", [2]],
["marche", "⛰️", "Marcher jusqu’à un endroit avec une jolie vue", [2, 0]],
["marche", "🍂", "Ramasser une jolie feuille ou un caillou en chemin", [2, 0]],
["marche", "🎧", "Faire une marche rapide en musique", [3, 2]]
];
export const MANUELS=["Importer des photos sur Immich", "Coder sur Habibit"];
export const LINK={"Faire une tâche de ma to-do list": "todo", "Faire mon Habibit du jour": "habibits", "Noter mes petites victoires de la semaine": "vic", "Faire un câlin à quelqu’un": "cal", "Écrire 3 choses que j’apprécie chez moi": "sl", "Noter dans un carnet ce qui me pèse et ce qui va bien": "car", "Faire une liste de 3 gratitudes": "gr", "Choisir un mot pour guider ma journée": "mot", "Écrire ce que je ressens, sans me juger": "res", "Prendre en photo quelque chose de beau autour de moi": "bel"};

/* Ancien nom d'une activité liée (pour reconnaître les données déjà enregistrées) */
export const LINK_ANCIEN={"Faire un câlin à quelqu’un (20 secondes minimum)":"cal"};

/* Onglets liés : texte du bouton sur l'écran « Vas-y » */
export const HABIBITS_URL="https://philo763.github.io/Habibits/";
export const FLOREAL_URL="https://splendorous-axolotl-8382a7.netlify.app/";
export const LIEN_BTN={
  floreal:"🌸 Ouvrir Floreal Fitness Tracker",
  todo:"✅ Ouvrir ma to-do list",habibits:"🎯 Ouvrir Habibits",gr:"🙏 Ouvrir mon journal de gratitude",sl:"💖 Ouvrir mon self love",
  vic:"🏆 Ouvrir mes petites victoires",cal:"🤗 Ouvrir mes câlins",car:"📓 Ouvrir mon carnet",mot:"🔑 Ouvrir mon mot du jour",
  res:"💭 Ouvrir mes ressentis",bel:"📸 Ouvrir mes belles choses",
};

export function fresh(){
  let id=1;
  const acts=BASE.map(([e,n,h,k])=>{const a={id:id++,n,h:h.slice(),s:0,e,g:k?"onglet":"base"};if(k)a.k=k;return a});
  return{v:1,next:id,acts,hs:[0,0,0,0],tl:[],todo:[]};
}

/* Journaux : « Journaling » regroupe tous les carnets (gr et sl gardent leurs anciennes clés de stockage) */
export const JR={
 gr:{short:"Gratitude",ico:"🙏",title:"Journal de gratitude",bg:"var(--c4)",intro:"Trois petites choses pour lesquelles je suis reconnaissante aujourd’hui.",ph:["Un moment agréable de ma journée…","Quelqu’un ou quelque chose qui m’a fait du bien…","Une toute petite chose simple…"],hint:"Pas besoin de grand-chose : un café chaud, un rayon de soleil ou un message gentil comptent.",rem:"Un petit rappel de gratitude",ok:"Page enregistrée 🌸 Merci pour ces jolies choses."},
 sl:{short:"Self love",ico:"💖",title:"Self love",bg:"var(--c0)",intro:"Trois choses que j’apprécie chez moi.",ph:["Une qualité que j’aime en moi…","Quelque chose que j’ai bien fait récemment…","Un petit détail de moi qui me plaît…"],hint:"Parle-toi comme à une amie. Écris ce qui est vrai, même si c’est petit.",rem:"Un mot doux de toi à toi",ok:"Page enregistrée 💖 Tu as le droit d’être fière de toi."},
 vic:{short:"Victoires",ico:"🏆",title:"Mes petites victoires",bg:"var(--c3)",intro:"Trois choses dont je suis fière cette semaine, même toutes petites.",ph:["Une chose que j’ai réussie…","Quelque chose que j’ai osé faire…","Je suis fière d’avoir fait…"],hint:"Une victoire, c’est aussi s’être levée, avoir demandé de l’aide ou fait une pause.",rem:"Une victoire passée",ok:"Page enregistrée 🏆 Bravo pour tout ça !"},
 cal:{short:"Câlins",ico:"🤗",title:"Mes câlins",bg:"var(--c1)",intro:"À qui j’ai fait un câlin.",ph:["À qui j’ai fait un câlin…"],hint:"Un câlin, ça peut être aussi un chien, un chat ou un gros pull.",rem:"Un câlin dont je me souviens",ok:"Page enregistrée 🤗 Plein de douceur."},
 car:{short:"Vide-sac",ico:"🎒",title:"Mon vide-sac",bg:"var(--c2)",intro:"Je pose ici ce qui me pèse.",ph:["Ce qui me pèse en ce moment…"],hint:"Pose les choses sur le papier, sans chercher à les résoudre.",rem:"Un poids déjà posé",ok:"Page enregistrée 🎒 Voilà, c’est posé."},
 mot:{short:"Mot du jour",ico:"🔑",title:"Mon mot du jour",bg:"var(--c4)",intro:"Un mot pour guider ma journée.",ph:["Mon mot pour aujourd’hui…","Pourquoi ce mot… (facultatif)","Comment je peux l’incarner… (facultatif)"],req:[0],hint:"Douceur, courage, lenteur, joie… le premier mot qui vient est souvent le bon.",rem:"Un mot d’un autre jour",ok:"Page enregistrée 🔑 Belle journée à toi."},
 res:{short:"Ressentis",ico:"💭",title:"Mes ressentis",bg:"var(--c0)",intro:"Écrire ce que je ressens, sans me juger.",ph:["La sensation dans mon corps…","Où je le sens dans mon corps…","L’émotion que j’y associe…"],hint:"Tous les ressentis ont le droit d’exister.",rem:"Un ressenti passé",ok:"Page enregistrée 💭 Merci de t’être écoutée."},
 bel:{short:"Belles choses",ico:"📸",title:"Mes belles choses",bg:"var(--c1)",intro:"Une belle chose remarquée autour de moi : une photo et quelques mots.",photo:true,ph:["Photo","Description de ce que j’ai photographié…"],hint:"Prends la photo avec l’appareil ou choisis-en une dans ta galerie.",rem:"Une belle chose d’un autre jour",ok:"Page enregistrée 📸 Le monde est joli."},
};
export const JR_KEYS=Object.keys(JR);

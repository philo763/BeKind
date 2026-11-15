/* Données fixes de Be Kind : hormones, activités de départ, emojis, balises, suggestions */
export const HN=["Dopamine","Ocytocine","Sérotonine","Endorphines"];
export const CN=["orange","rose","jaune","bleu"];
export const SEED=[
["Faire une tâche de ma to-do list","Faire un soin (masque, crème)","Trier mes mails","Faire une courte séance de yoga ou de sport","Importer des photos sur Immich","Me faire un café","Faire mon Habibit du jour","Me doucher et m’habiller comme si je sortais","Faire le lit et aérer la pièce","Coder sur Habibit","Prendre un bain","Me préparer un thé que j’aime et le savourer sans écran","Regarder un épisode de série","Dessiner ou créer quelque chose pour le plaisir","Noter mes petites victoires de la semaine"],
["Appeler un proche","Envoyer un message à quelqu’un à qui je pense","Proposer un café ou une balade à une amie","Jouer avec mon chien","Aller dans un lieu avec du monde (café, marché)","Faire un câlin à mon chien","Me blottir sous un plaid avec une boisson chaude","Prendre une douche ou un bain chaud","Écouter une musique douce et réconfortante","Me masser les mains ou les épaules avec une crème","Écrire un petit mot gentil à quelqu’un","Regarder de belles photos ou d’anciens messages tendres","Faire un câlin à quelqu’un (20 secondes minimum)","Remercier ou féliciter quelqu’un","Écrire 3 choses que j’apprécie chez moi"],
["Méditer (10 min minimum)","Faire une respiration profonde / cohérence cardiaque (5 min)","Faire du yoga doux","Écouter de la musique calme les yeux fermés","Faire des étirements lents","Marcher dehors (20 min minimum)","Noter dans un carnet ce qui me pèse et ce qui va bien","Faire une liste de 3 gratitudes","Aller à la lumière du jour, près d’une fenêtre ou dehors","Courir doucement (20 min minimum)","Aller dans un parc ou en forêt","M’asseoir au soleil quelques minutes","Marcher pieds nus dans l’herbe","Observer le ciel et la nature sans téléphone","Faire une promenade avec mon chien"],
["Faire un entraînement court et intense (15 min)","Danser comme si personne ne regardait","Faire une marche rapide","Secouer tout mon corps pendant 2 minutes","Respirer des huiles essentielles en m’étirant","Regarder un film ou un sketch drôle","Regarder des vidéos d’animaux","Chanter à tue-tête","Appeler quelqu’un qui me fait rire","Jouer à un jeu qui me fait rire","Courir (20 min minimum)","Faire une séance de renforcement musculaire","Faire du vélo","Faire une grosse séance de danse"]
];
export const EMO=[
["✅","🧴","📧","🤸","📷","☕","🎯","🚿","🛏️","💻","🛁","🍵","📺","🎨","🏆"],
["📞","💌","👯","🎾","🛍️","🐶","🛋️","🛀","🎧","💆","✍️","🖼️","🤗","🙏","💖"],
["🧘","🌬️","🧘‍♀️","🎶","🙆","🚶","📓","🌈","🌤️","🏃","🌳","☀️","🌱","☁️","🐕"],
["💪","💃","👟","🙌","🌿","🎬","🐱","🎤","😂","🎮","🏃‍♀️","🏋️","🚴","🪩"]
];
export const EL=["🌼","🌸","🌷","🌻","🌿","🌳","☀️","🌈","⭐","✨","💖","💌","🤗","🙏","💪","🏃","🚶","🚴","🏊","🧘","💃","🎶","🎧","🎤","🎨","✍️","📓","📚","📷","🎮","🎬","📺","📞","💻","✅","🧹","🛏️","🚿","🛁","🧴","☕","🍵","🍎","🥗","🍫","🐶","🐱","🎾","🕯️","🌙","☁️","🌬️","🧣","🛋️","🎁","🏆","🎯"];
export const TAGS=[{k:"generique",l:"Générique",e:"🌼"},{k:"perso",l:"Perso & philo",e:"🧘‍♀️"},{k:"yoga",l:"Sport · yoga",e:"🧘"},{k:"course",l:"Sport · course",e:"🏃"},{k:"velo",l:"Sport · vélo",e:"🚴"},{k:"danse",l:"Sport · danse",e:"💃"},{k:"muscu",l:"Sport · renforcement",e:"🏋️"},{k:"natation",l:"Sport · natation",e:"🏊"},{k:"marche",l:"Marche & nature",e:"🌳"},{k:"chien",l:"Chien",e:"🐶"},{k:"chat",l:"Chat",e:"🐱"},{k:"creatif",l:"Créatif",e:"🎨"},{k:"musique",l:"Musique",e:"🎶"},{k:"numerique",l:"Projets numériques",e:"💻"}];
export const GT=[
["generique","generique","generique","yoga","numerique","generique","numerique","generique","generique","numerique","generique","generique","generique","creatif","perso"],
["generique","generique","generique","chien","generique","chien","generique","generique","generique","generique","perso","generique","generique","generique","perso"],
["perso","perso","yoga","generique","generique","marche","perso","perso","generique","course","marche","generique","marche","marche","chien"],
["muscu","danse","marche","generique","generique","generique","generique","musique","generique","generique","course","muscu","velo","danse"]
];
export const TG_BY={};SEED.forEach(function(L,h){L.forEach(function(n,j){TG_BY[n]=GT[h][j]})});
export const LINK={"Faire une liste de 3 gratitudes":"gratitude","Écrire 3 choses que j’apprécie chez moi":"selflove"};
export const DANCE=3;
export function pad(n){return(n<10?"0":"")+n}
export function sod(d){var x=new Date(d);x.setHours(0,0,0,0);return x}
export function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
export const SUGG=[
["chien","🦴","Cacher des friandises dans la maison pour mon chien",[1,0]],
["chien","🪮","Brosser mon chien tout doucement",[1]],
["chien","🎓","Apprendre un nouveau tour à mon chien",[0,1]],
["chien","🐕‍🦺","Courir ou trottiner avec mon chien",[3,2]],
["chien","🌲","Faire une longue balade au grand air avec mon chien",[2]],
["chat","😻","Câliner mon chat",[1]],
["chat","🪶","Jouer avec mon chat avec une plume ou une ficelle",[1,3]],
["chat","🎵","Écouter mon chat ronronner sur mes genoux",[1,2]],
["chat","🪮","Brosser mon chat",[1]],
["chat","📸","Prendre mon chat en photo dans sa plus belle pose",[0,1]],
["yoga","☀️","Faire quelques salutations au soleil",[2,3]],
["yoga","🧘","Faire 10 minutes de yin yoga",[2]],
["yoga","🌳","Tenir la posture de l’arbre 1 minute de chaque côté",[2,0]],
["yoga","🔥","Faire un flow de yoga dynamique de 15 minutes",[3,0]],
["yoga","😌","Finir par 5 minutes de savasana",[2]],
["course","🏃","Faire un footing de 15 minutes",[3]],
["course","⚡","Faire des fractionnés : 6 fois 1 minute rapide",[3,0]],
["course","🗺️","Courir sur un parcours que je ne connais pas",[3,0]],
["course","🎧","Courir en musique sans regarder ma montre",[3]],
["course","🌳","Faire un footing tranquille dans un parc",[2,3]],
["velo","🚲","Faire une balade à vélo tranquille",[2,3]],
["velo","📍","Pédaler jusqu’à un endroit que j’aime",[3,0]],
["velo","🌇","Faire un tour à vélo au coucher du soleil",[2]],
["velo","🛒","Aller faire une course à vélo",[0,3]],
["velo","🎶","Faire 30 minutes de vélo d’appartement en musique",[3]],
["danse","🕺","Apprendre quelques pas d’une nouvelle chorégraphie",[0,3]],
["danse","🪩","Danser sur la chanson de mon adolescence",[3,1]],
["danse","📱","Reproduire la chorégraphie d’un clip que j’aime",[0,3]],
["danse","💫","Danser lentement les yeux fermés",[2,3]],
["danse","🍵","Danser dans la cuisine pendant que le thé infuse",[3,0]],
["muscu","🦵","Faire 3 séries de squats",[3,0]],
["muscu","💪","Tenir la planche pendant 1 minute",[0,3]],
["muscu","🧱","Faire 10 minutes de gainage",[0,3]],
["muscu","🤸","Faire une mini séance de pilates",[2,3]],
["muscu","🏋️","Faire quelques pompes, même sur les genoux",[0,3]],
["natation","🏊","Aller nager 20 minutes",[3,2]],
["natation","🌊","Faire quelques longueurs tranquilles",[2,3]],
["natation","🧜‍♀️","Flotter sur le dos et respirer profondément",[2]],
["natation","🎯","Me fixer un nombre de longueurs et les compter",[0,3]],
["marche","🚶","Faire une marche de 30 minutes sans écouteurs",[2]],
["marche","⛰️","Marcher jusqu’à un endroit avec une jolie vue",[2,0]],
["marche","🍂","Ramasser une jolie feuille ou un caillou en chemin",[2,0]],
["marche","🎧","Faire une marche rapide en musique",[3,2]],
["marche","📷","Photographier trois belles choses dehors",[2,0]],
["creatif","🖍️","Colorier un mandala",[2,0]],
["creatif","📝","Écrire quelques lignes libres ou un petit poème",[0,2]],
["creatif","✂️","Faire un petit collage",[0]],
["creatif","✏️","Faire un croquis de ce que je vois autour de moi",[0,2]],
["creatif","💐","Composer un petit bouquet ou arranger des fleurs",[0,1]],
["musique","🎸","Jouer un morceau que j’aime",[0,3]],
["musique","🚿","Chanter sous la douche",[3]],
["musique","🎧","Composer une playlist qui me fait du bien",[0,2]],
["musique","🎹","Apprendre quelques notes d’un nouvel air",[0]],
["musique","💿","Écouter un album en entier sans rien faire d’autre",[2]],
["numerique","🧩","Avancer d’une toute petite étape sur un projet perso",[0]],
["numerique","🖼️","Choisir mes 10 plus belles photos et les classer",[0,1]],
["numerique","🗂️","Ranger mon bureau ou mes dossiers sur l’ordinateur",[0]],
["numerique","💡","Noter une idée de projet qui m’enthousiasme",[0]],
["perso","💌","Écrire une lettre à moi-même pour dans un an",[1,2]],
["perso","📖","Lire quelques pages d’un livre de philo ou de développement personnel",[2]],
["perso","🔑","Choisir un mot pour guider ma journée",[2,0]],
["perso","📓","Écrire ce que je ressens, sans me juger",[2]],
["perso","❓","Me demander : de quoi ai-je vraiment besoin maintenant ?",[2]],
["generique","🪟","Ouvrir la fenêtre et prendre 5 grandes inspirations",[2]],
["generique","💧","Boire un grand verre d’eau",[0,2]],
["generique","💬","Envoyer un compliment sincère à quelqu’un",[1]],
["generique","🧦","Mettre des chaussettes bien douillettes",[1]],
["generique","📸","Prendre en photo quelque chose de beau autour de moi",[0,2]]
];
export const WSPORT=[["yoga","Yoga","🧘"],["course","Course à pied","🏃"],["velo","Vélo","🚴"],["danse","Danse","💃"],["muscu","Renforcement / fitness","🏋️"],["natation","Natation","🏊"],["marche","Marche / randonnée","🌳"]];
export const WLOIS=[["creatif","Créatif (dessin, collage…)","🎨"],["musique","Musique (jouer, chanter…)","🎶"],["numerique","Projets numériques (code, photos…)","💻"],["perso","Introspection (méditer, écrire, philo…)","🧘‍♀️"]];
export function emo(a){return a.e||"🌼"}
export function firstEmoji(s){s=(s||"").trim();if(!s)return"";try{if(window.Intl&&Intl.Segmenter){var it=new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(s)[Symbol.iterator]().next();return it.value.segment}}catch(e){}return Array.from(s)[0]}
export function gardenH(n){return Math.max(380,380+Math.ceil(Math.max(0,n-14)/7)*90)}
export function fresh(){var id=1,acts=[];SEED.forEach(function(L,h){L.forEach(function(n,j){acts.push({id:id++,n:n,h:[h],s:0,e:EMO[h][j],g:GT[h][j]})})});return{v:1,next:id,acts:acts,hs:[0,0,0,0],tl:[],todo:[]}}
export function tagLabel(k){var x=TAGS.filter(function(g){return g.k===k})[0];return x?x.e+" "+x.l:k}
export const JR={
 gr:{ico:"🙏",title:"Journal de gratitude",bg:"var(--c4)",intro:"Trois petites choses pour lesquelles je suis reconnaissante aujourd’hui.",ph:["Un moment agréable de ma journée…","Quelqu’un ou quelque chose qui m’a fait du bien…","Une toute petite chose simple…"],hint:"Pas besoin de grand-chose : un café chaud, un rayon de soleil ou un message gentil comptent.",rem:"Un petit rappel de gratitude",ok:"Page enregistrée 🌸 Merci pour ces jolies choses."},
 sl:{ico:"💖",title:"Self love",bg:"var(--c0)",intro:"Trois choses que j’apprécie chez moi.",ph:["Une qualité que j’aime en moi…","Quelque chose que j’ai bien fait récemment…","Un petit détail de moi qui me plaît…"],hint:"Parle-toi comme à une amie. Écris ce qui est vrai, même si c’est petit.",rem:"Un mot doux de toi à toi",ok:"Page enregistrée 💖 Tu as le droit d’être fière de toi."}
};

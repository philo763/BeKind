var HN=["Dopamine","Ocytocine","Sérotonine","Endorphines"];
var CN=["orange","rose","jaune","bleu"];
var SEED=[
["Faire une tâche de ma to-do list","Faire un soin (masque, crème)","Trier mes mails","Faire une courte séance de yoga ou de sport","Importer des photos sur Immich","Me faire un café","Faire mon Habibit du jour","Me doucher et m’habiller comme si je sortais","Faire le lit et aérer la pièce","Coder sur Habibit","Prendre un bain","Me préparer un thé que j’aime et le savourer sans écran","Regarder un épisode de série","Dessiner ou créer quelque chose pour le plaisir","Noter mes petites victoires de la semaine"],
["Appeler un proche","Envoyer un message à quelqu’un à qui je pense","Proposer un café ou une balade à une amie","Jouer avec mon chien","Aller dans un lieu avec du monde (café, marché)","Faire un câlin à mon chien","Me blottir sous un plaid avec une boisson chaude","Prendre une douche ou un bain chaud","Écouter une musique douce et réconfortante","Me masser les mains ou les épaules avec une crème","Écrire un petit mot gentil à quelqu’un","Regarder de belles photos ou d’anciens messages tendres","Faire un câlin à quelqu’un (20 secondes minimum)","Remercier ou féliciter quelqu’un","Écrire 3 choses que j’apprécie chez moi"],
["Méditer (10 min minimum)","Faire une respiration profonde / cohérence cardiaque (5 min)","Faire du yoga doux","Écouter de la musique calme les yeux fermés","Faire des étirements lents","Marcher dehors (20 min minimum)","Noter dans un carnet ce qui me pèse et ce qui va bien","Faire une liste de 3 gratitudes","Aller à la lumière du jour, près d’une fenêtre ou dehors","Courir doucement (20 min minimum)","Aller dans un parc ou en forêt","M’asseoir au soleil quelques minutes","Marcher pieds nus dans l’herbe","Observer le ciel et la nature sans téléphone","Faire une promenade avec mon chien"],
["Faire un entraînement court et intense (15 min)","Danser comme si personne ne regardait","Faire une marche rapide","Secouer tout mon corps pendant 2 minutes","Respirer des huiles essentielles en m’étirant","Regarder un film ou un sketch drôle","Regarder des vidéos d’animaux","Chanter à tue-tête","Appeler quelqu’un qui me fait rire","Jouer à un jeu qui me fait rire","Courir (20 min minimum)","Faire une séance de renforcement musculaire","Faire du vélo","Faire une grosse séance de danse"]
];
var EMO=[
["✅","🧴","📧","🤸","📷","☕","🎯","🚿","🛏️","💻","🛁","🍵","📺","🎨","🏆"],
["📞","💌","👯","🎾","🛍️","🐶","🛋️","🛀","🎧","💆","✍️","🖼️","🤗","🙏","💖"],
["🧘","🌬️","🧘‍♀️","🎶","🙆","🚶","📓","🌈","🌤️","🏃","🌳","☀️","🌱","☁️","🐕"],
["💪","💃","👟","🙌","🌿","🎬","🐱","🎤","😂","🎮","🏃‍♀️","🏋️","🚴","🪩"]
];
var EL=["🌼","🌸","🌷","🌻","🌿","🌳","☀️","🌈","⭐","✨","💖","💌","🤗","🙏","💪","🏃","🚶","🚴","🏊","🧘","💃","🎶","🎧","🎤","🎨","✍️","📓","📚","📷","🎮","🎬","📺","📞","💻","✅","🧹","🛏️","🚿","🛁","🧴","☕","🍵","🍎","🥗","🍫","🐶","🐱","🎾","🕯️","🌙","☁️","🌬️","🧣","🛋️","🎁","🏆","🎯"];
var TAGS=[{k:"generique",l:"Générique",e:"🌼"},{k:"perso",l:"Perso & philo",e:"🧘‍♀️"},{k:"yoga",l:"Sport · yoga",e:"🧘"},{k:"course",l:"Sport · course",e:"🏃"},{k:"velo",l:"Sport · vélo",e:"🚴"},{k:"danse",l:"Sport · danse",e:"💃"},{k:"muscu",l:"Sport · renforcement",e:"🏋️"},{k:"natation",l:"Sport · natation",e:"🏊"},{k:"marche",l:"Marche & nature",e:"🌳"},{k:"chien",l:"Chien",e:"🐶"},{k:"chat",l:"Chat",e:"🐱"},{k:"creatif",l:"Créatif",e:"🎨"},{k:"musique",l:"Musique",e:"🎶"},{k:"numerique",l:"Projets numériques",e:"💻"}];
var GT=[
["generique","generique","generique","yoga","numerique","generique","numerique","generique","generique","numerique","generique","generique","generique","creatif","perso"],
["generique","generique","generique","chien","generique","chien","generique","generique","generique","generique","perso","generique","generique","generique","perso"],
["perso","perso","yoga","generique","generique","marche","perso","perso","generique","course","marche","generique","marche","marche","chien"],
["muscu","danse","marche","generique","generique","generique","generique","musique","generique","generique","course","muscu","velo","danse"]
];
var TG_BY={};SEED.forEach(function(L,h){L.forEach(function(n,j){TG_BY[n]=GT[h][j]})});
var LINK={"Faire une liste de 3 gratitudes":"gratitude","Écrire 3 choses que j’apprécie chez moi":"selflove"};
var TICK='<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function pad(n){return(n<10?"0":"")+n}
function sod(d){var x=new Date(d);x.setHours(0,0,0,0);return x}
function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}

/* ---------- données ---------- */
function fresh(){var id=1,acts=[];SEED.forEach(function(L,h){L.forEach(function(n,j){acts.push({id:id++,n:n,h:[h],s:0,e:EMO[h][j],g:GT[h][j]})})});return{v:1,next:id,acts:acts,hs:[0,0,0,0],tl:[],todo:[]}}
var S=null;
function save(){BK.sauvegarder(S)}
S=BK.charger();
if(!S||!Array.isArray(S.acts)||!S.acts.length||!Array.isArray(S.hs)||S.hs.length!==4){S=fresh();save()}
S.tl=S.tl||[];S.todo=S.todo||[];
(function(){var EM={},ch=false;SEED.forEach(function(L,h){L.forEach(function(n,j){EM[n]=EMO[h][j]})});S.acts.forEach(function(a){if(!a.e){a.e=EM[a.n]||"🌼";ch=true}});if(ch)save()})();
function emo(a){return a.e||"🌼"}
function firstEmoji(s){s=(s||"").trim();if(!s)return"";try{if(window.Intl&&Intl.Segmenter){var it=new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(s)[Symbol.iterator]().next();return it.value.segment}}catch(e){}return Array.from(s)[0]}

/* ---------- jardin ---------- */
var gMode=null,gMsg="",selId=null,DANCE=3;
function gardenH(n){return Math.max(380,380+Math.ceil(Math.max(0,n-14)/7)*90)}
function addFlower(a,when){
 var n=S.garden.length+1,H=gardenH(n),best=null,bd=-1,i,j;
 for(i=0;i<16;i++){var x=8+Math.random()*84,y=110+Math.random()*(H-125),m=1e9;
  for(j=0;j<S.garden.length;j++){var g=S.garden[j];m=Math.min(m,Math.hypot((x-g.x)*6,y-g.y))}
  if(m>bd){bd=m;best={x:x,y:y}}}
 S.garden.push({id:S.next++,t:when||Date.now(),n:a.n,e:a.e||"🌼",h:a.h.slice(),x:Math.round(best.x*10)/10,y:Math.round(best.y),dance:false})}
if(!Array.isArray(S.garden)){S.garden=[];S.tl.forEach(function(v){addFlower({n:v.n,e:v.e,h:v.h},v.t)});save()}
if(typeof S.sun!=="number"){S.sun=S.garden.length;save()}
function flowerSVG(hs){
 var n=hs.length,p="",i;
 for(i=0;i<12;i++)p+='<ellipse cx="32" cy="17" rx="6.2" ry="13" transform="rotate('+(i*30)+' 32 32)" fill="var(--s'+hs[i%n]+')" stroke="rgba(90,74,92,.3)" stroke-width="1"/>';
 return'<svg viewBox="0 0 64 92" aria-hidden="true"><path d="M32 52C30 66 34 80 32 92" stroke="#7FB77E" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="74" rx="10" ry="4.5" fill="#9CCB9A" transform="rotate(-28 22 74)"/><ellipse cx="43" cy="68" rx="10" ry="4.5" fill="#9CCB9A" transform="rotate(28 43 68)"/>'+p+'<circle cx="32" cy="32" r="10" fill="#FFC93C" stroke="#C98A00" stroke-width="1.5"/><circle cx="28.8" cy="30" r="1.5" fill="#5A4A5C"/><circle cx="35.2" cy="30" r="1.5" fill="#5A4A5C"/><path d="M28 34.5Q32 39 36 34.5" stroke="#5A4A5C" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>'}
function garden(){
 var n=S.garden.length,H=gardenH(n),pick=gMode==="pick";
 var h='<section style="background:var(--c1)"><h2><span class="ico">🌼</span><span>Mon jardin</span><span class="sn">'+n+(n>1?" marguerites":" marguerite")+'</span><span class="sun" aria-label="'+S.sun+' soleils">☀️ '+S.sun+'</span></h2>';
 if(pick)h+='<p class="banner" role="status"><span>Touche la marguerite qui doit danser 💃</span><button type="button" class="reset sm" data-a="gcancel">Annuler</button></p>';
 else if(gMsg)h+='<p class="banner" role="status">'+esc(gMsg)+'</p>';
 h+='<div class="garden" id="garden" style="height:'+H+'px"><div class="sunb" aria-hidden="true"></div>';
 S.garden.forEach(function(f){h+='<div class="fl'+(f.dance?" dance":"")+(pick&&!f.dance?" pickable":"")+'" data-f="'+f.id+'" style="left:'+f.x+'%;top:'+f.y+'px" role="img" aria-label="Marguerite : '+esc(f.n)+'">'+flowerSVG(f.h)+(f.dance?'<span class="note" aria-hidden="true">♪</span>':'')+'</div>'});
 if(!n)h+='<p class="empty0">Ton jardin attend sa première marguerite : fais une activité pour la voir éclore 🌱</p>';
 h+='</div>';
 var sel=S.garden.filter(function(f){return f.id===selId})[0];
 h+='<p class="cap mu">'+(sel?esc((sel.e||"🌼")+" "+sel.n)+" · "+new Date(sel.t).toLocaleDateString("fr-FR",{day:"numeric",month:"long"}):(n?"Touche une fleur pour voir d’où elle vient. Fais-la glisser où tu veux.":""))+'</p></section>';
 var can=S.sun>=DANCE&&S.garden.some(function(f){return!f.dance}),why="";
 if(S.sun<DANCE)why="Il te manque "+(DANCE-S.sun)+" ☀️ : chaque activité validée en rapporte 1.";
 else if(!can)why="Toutes tes marguerites dansent déjà !";
 h+='<section style="background:var(--c4)"><h2><span class="ico">🛍️</span><span>Boutique</span></h2><div class="shopitem"><div class="si" aria-hidden="true">💃</div><div class="st"><strong>Une marguerite qui danse</strong><br><span class="mu">Tu choisis la fleur qui danse.</span></div><button type="button" class="main sm" data-a="gbuy"'+(can&&!pick?"":" disabled")+'>'+DANCE+' ☀️</button></div>'+(why?'<p class="mu" style="margin:8px 4px 2px;font-size:14px">'+esc(why)+'</p>':'')+'</section>';
 return h}
var drag=null;
document.addEventListener("pointerdown",function(e){
 var el=e.target.closest&&e.target.closest(".fl");if(!el||tab!=="garden")return;
 var f=S.garden.filter(function(k){return k.id===+el.dataset.f})[0];if(!f)return;
 drag={el:el,f:f,box:el.parentNode.getBoundingClientRect(),sx:e.clientX,sy:e.clientY,ox:f.x,oy:f.y,moved:false};
 try{el.setPointerCapture(e.pointerId)}catch(x){}
 e.preventDefault()});
document.addEventListener("pointermove",function(e){
 if(!drag)return;var dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
 if(!drag.moved){if(Math.hypot(dx,dy)<6||gMode==="pick")return;drag.moved=true;drag.el.classList.add("drag")}
 var H=drag.box.height;
 drag.f.x=Math.max(5,Math.min(95,drag.ox+dx/drag.box.width*100));
 drag.f.y=Math.max(70,Math.min(H-4,drag.oy+dy));
 drag.el.style.left=drag.f.x+"%";drag.el.style.top=drag.f.y+"px"});
function endDrag(tap){
 if(!drag)return;var d=drag;drag=null;
 if(d.moved){d.f.x=Math.round(d.f.x*10)/10;d.f.y=Math.round(d.f.y);d.el.classList.remove("drag");save();return}
 if(!tap)return;
 if(gMode==="pick"&&!d.f.dance&&S.sun>=DANCE){S.sun-=DANCE;d.f.dance=true;gMode=null;gMsg="Ta marguerite danse ! 💃";save();selId=d.f.id;render()}
 else{selId=d.f.id;render()}}
document.addEventListener("pointerup",function(){endDrag(true)});
document.addEventListener("pointercancel",function(){endDrag(false)});

/* ---------- balises, journaux, assistant ---------- */
(function(){var ch=false;S.acts.forEach(function(a){if(!a.g){a.g=TG_BY[a.n]||"generique";ch=true}if(LINK[a.n]&&a.k!==LINK[a.n]){a.k=LINK[a.n];ch=true}});if(!Array.isArray(S.gr)){S.gr=[];ch=true}if(!Array.isArray(S.sl)){S.sl=[];ch=true}if(ch)save()})();
var SUGG=[
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
function tagLabel(k){var x=TAGS.filter(function(g){return g.k===k})[0];return x?x.e+" "+x.l:k}
function tagOpts(sel){return TAGS.map(function(g){return'<option value="'+g.k+'"'+(g.k===sel?" selected":"")+'>'+g.e+" "+esc(g.l)+'</option>'}).join("")}
function tagSel(a){return'<select class="tagsel" data-a="dbtag" data-i="'+a.id+'" aria-label="Balise de l’activité">'+tagOpts(a.g)+'</select>'}
var newT="generique",dbOk="";
function dots(hs){return hs.map(function(k){return'<i class="dot" title="'+HN[k]+'" style="background:var(--s'+k+')"></i>'}).join("")}

/* --- assistant « suggestions d'ajout d'activités » --- */
var WSPORT=[["yoga","Yoga","🧘"],["course","Course à pied","🏃"],["velo","Vélo","🚴"],["danse","Danse","💃"],["muscu","Renforcement / fitness","🏋️"],["natation","Natation","🏊"],["marche","Marche / randonnée","🌳"]];
var WLOIS=[["creatif","Créatif (dessin, collage…)","🎨"],["musique","Musique (jouer, chanter…)","🎶"],["numerique","Projets numériques (code, photos…)","💻"],["perso","Introspection (méditer, écrire, philo…)","🧘‍♀️"]];
var wiz=null;
function wizOpen(){var tg=(S.prof&&S.prof.tags)||[];wiz={step:0,tg:tg.slice(),off:{},ans:{}};if(S.prof){wiz.ans.chien=tg.indexOf("chien")>-1?1:0;wiz.ans.chat=tg.indexOf("chat")>-1?1:0}}
function hasT(k){return wiz.tg.indexOf(k)>-1}
function toggleT(k){var i=wiz.tg.indexOf(k);if(i>-1)wiz.tg.splice(i,1);else wiz.tg.push(k)}
function wizCands(){return SUGG.map(function(s,i){return{s:s,i:i}}).filter(function(o){var g=o.s[0];if(g!=="generique"&&wiz.tg.indexOf(g)<0)return false;var nm=o.s[2].toLowerCase();return!S.acts.some(function(a){return a.n.toLowerCase()===nm})})}
function wizard(){
 var st=wiz.step,h='<section class="card" style="background:var(--c3)"><div class="tools" style="margin:0 0 6px;justify-content:space-between">'+(st>0?'<button type="button" class="reset sm" data-a="wizback">‹ Retour</button>':'<span></span>')+'<button type="button" class="reset sm" data-a="wizclose">Fermer</button></div>';
 function head(n,emo,q){return'<p class="kicker">Question '+n+' sur 4</p><div class="bigemo" aria-hidden="true">'+emo+'</div><h2>'+q+'</h2>'}
 function yn(tag,emo,q,n){var a=wiz.ans[tag];return head(n,emo,q)+'<div class="opts"><button type="button" class="opt" aria-pressed="'+(a===1?"true":"false")+'" data-a="wizyn" data-g="'+tag+'" data-v="1">Oui</button><button type="button" class="opt" aria-pressed="'+(a===0?"true":"false")+'" data-a="wizyn" data-g="'+tag+'" data-v="0">Non</button></div>'}
 function multi(list,emo,q,n,sub,btn){return head(n,emo,q)+'<p class="mu">'+sub+'</p><div class="opts">'+list.map(function(o){return'<button type="button" class="opt" aria-pressed="'+(hasT(o[0])?"true":"false")+'" data-a="wiztog" data-g="'+o[0]+'">'+o[2]+" "+esc(o[1])+'</button>'}).join("")+'</div><button type="button" class="main" data-a="wiznext">'+btn+'</button>'}
 if(st===0)h+=yn("chien","🐶","Tu as un chien ?",1);
 else if(st===1)h+=yn("chat","🐱","Tu as un chat ?",2);
 else if(st===2)h+=multi(WSPORT,"🏅","Quels sports aimes-tu pratiquer ?",3,"Choisis-en autant que tu veux, ou aucun.","Suivant");
 else if(st===3)h+=multi(WLOIS,"✨","Qu’est-ce qui te plaît à côté ?",4,"Là aussi, tu peux en choisir plusieurs.","Voir mes suggestions");
 else{
  var c=wizCands(),n=c.filter(function(o){return!wiz.off[o.i]}).length;
  h+='<p class="kicker">Mes suggestions</p><h2>Voici des idées pour toi</h2>';
  if(!c.length)h+='<p>Tu as déjà toutes les idées que je pouvais te proposer ! 🌼</p><button type="button" class="main" data-a="wizclose">Retour à la base</button>';
  else{h+='<p class="mu">Décoche celles qui ne te plaisent pas, puis ajoute le reste à ta base.</p><div style="text-align:left">';
   TAGS.forEach(function(g){var it=c.filter(function(o){return o.s[0]===g.k});if(!it.length)return;
    h+='<div class="sgh">'+g.e+" "+esc(g.l)+'</div>';
    it.forEach(function(o){h+='<label><input type="checkbox" data-a="wizchk" data-i="'+o.i+'"'+(wiz.off[o.i]?"":" checked")+'><span class="cb">'+TICK+'</span><span class="sgt">'+esc(o.s[1]+" "+o.s[2])+'</span><span class="dots">'+dots(o.s[3])+'</span></label>'})});
   h+='</div><div class="foot" style="margin-top:14px"><button type="button" class="main" data-a="wizadd">Ajouter la sélection (<span id="wizcount">'+n+'</span>)</button></div>'}}
 return h+'</section>'}
function wizAdd(){
 var c=wizCands().filter(function(o){return!wiz.off[o.i]}),n=0;
 c.forEach(function(o){var s=o.s;S.acts.push({id:S.next++,n:s[2],h:s[3].slice(),s:0,e:s[1],g:s[0]});n++});
 S.prof={tags:wiz.tg.slice()};save();wiz=null;
 dbOk=n?n+(n>1?" activités ajoutées":" activité ajoutée")+" à ta base 🌸":"";render()}
function db(){return wiz?wizard():dbMain()}

/* --- journaux : gratitude et self love --- */
var JR={
 gr:{ico:"🙏",title:"Journal de gratitude",bg:"var(--c4)",intro:"Trois petites choses pour lesquelles je suis reconnaissante aujourd’hui.",ph:["Un moment agréable de ma journée…","Quelqu’un ou quelque chose qui m’a fait du bien…","Une toute petite chose simple…"],hint:"Pas besoin de grand-chose : un café chaud, un rayon de soleil ou un message gentil comptent.",rem:"Un petit rappel de gratitude",ok:"Page enregistrée 🌸 Merci pour ces jolies choses."},
 sl:{ico:"💖",title:"Self love",bg:"var(--c0)",intro:"Trois choses que j’apprécie chez moi.",ph:["Une qualité que j’aime en moi…","Quelque chose que j’ai bien fait récemment…","Un petit détail de moi qui me plaît…"],hint:"Parle-toi comme à une amie. Écris ce qui est vrai, même si c’est petit.",rem:"Un mot doux de toi à toi",ok:"Page enregistrée 💖 Tu as le droit d’être fière de toi."}
};
var jd={gr:["","",""],sl:["","",""]},jmsg="",jarm="",rem={gr:null,sl:null};
function pickRem(k){var all=[];S[k].forEach(function(p){p.items.forEach(function(s){all.push(s)})});rem[k]=all.length?all[Math.floor(Math.random()*all.length)]:null}
function jSave(k){
 var it=jd[k].map(function(s){return s.trim()}).filter(Boolean);
 if(!it.length){jmsg="Écris au moins une ligne pour enregistrer ta page.";render();return}
 S[k].push({id:S.next++,t:Date.now(),items:it});jd[k]=["","",""];jmsg=JR[k].ok;save();pickRem(k);render()}
function journal(k){
 var c=JR[k],L=S[k],i;
 var d=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});d=d.charAt(0).toUpperCase()+d.slice(1);
 var h='<section style="background:'+c.bg+'"><h2><span class="ico">'+c.ico+'</span><span>'+c.title+'</span><span class="sn">'+L.length+(L.length>1?" pages":" page")+'</span></h2><p class="mu" style="margin:0 0 4px">'+c.intro+'</p><div class="page"><div class="pdate">'+esc(d)+'</div>';
 for(i=0;i<3;i++)h+='<div class="line"><span class="num" aria-hidden="true">'+(i+1)+'</span><input class="ln" data-j="'+k+'" data-n="'+i+'" placeholder="'+esc(c.ph[i])+'" aria-label="'+esc(c.title)+', ligne '+(i+1)+'" maxlength="200" value="'+esc(jd[k][i])+'"></div>';
 h+='<p class="hint">'+c.hint+'</p>'+(jmsg?'<p class="banner" role="status" style="margin:6px 0">'+esc(jmsg)+'</p>':'')+'<div class="foot" style="margin:6px 0 2px"><button type="button" class="main sm" data-a="jsave" data-j="'+k+'">Enregistrer ma page</button></div></div>';
 if(rem[k])h+='<div class="remcard"><span class="kicker">'+c.rem+'</span><p class="q">« '+esc(rem[k])+' »</p><button type="button" class="reset sm" data-a="jrem" data-j="'+k+'">Un autre</button></div>';
 h+='</section>';
 if(L.length){
  h+='<section style="background:var(--c3)"><h2><span class="ico">📖</span><span>Mes pages précédentes</span></h2>';
  L.slice().sort(function(a,b){return b.t-a.t}).forEach(function(p){
   var dt=new Date(p.t).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});dt=dt.charAt(0).toUpperCase()+dt.slice(1);
   var on=jarm===k+":"+p.id;
   h+='<div class="page old"><div class="oldhead"><span class="pdate">'+esc(dt)+'</span><button type="button" class="x'+(on?" warn":"")+'" data-a="jdel" data-j="'+k+'" data-i="'+p.id+'" aria-label="Supprimer cette page">'+(on?"Confirmer ?":"🗑")+'</button></div><ol>'+p.items.map(function(s){return'<li>'+esc(s)+'</li>'}).join("")+'</ol></div>'});
  h+='</section>'}
 return h}
function linkBtn(c){
 if(c&&c.k==="gratitude")return'<div style="margin-bottom:14px"><button type="button" class="reset" data-a="golink" data-j="gr">🙏 Ouvrir mon journal de gratitude</button></div>';
 if(c&&c.k==="selflove")return'<div style="margin-bottom:14px"><button type="button" class="reset" data-a="golink" data-j="sl">💖 Ouvrir mon self love</button></div>';
 return""}

/* ---------- logique de suggestion ---------- */
function newSess(msg){return{ph:"idle",excl:[],seen:[],cur:null,hor:null,tied:[],msg:msg||""}}
var sess=newSess();
function pool(h){return S.acts.filter(function(a){return a.h.indexOf(h)>-1&&sess.seen.indexOf(a.id)<0})}
function decide(){
 var cands=[0,1,2,3].filter(function(h){return sess.excl.indexOf(h)<0&&pool(h).length>0});
 if(!cands.length){sess.ph="empty";return}
 var mx=Math.max.apply(null,cands.map(function(h){return S.hs[h]}));
 var tied=cands.filter(function(h){return S.hs[h]===mx});
 if(tied.length>1){sess.ph="choose";sess.tied=tied}else propose(tied[0])}
function propose(h){
 var p=pool(h);
 if(!p.length){sess.excl.push(h);decide();return}
 var mx=Math.max.apply(null,p.map(function(a){return a.s}));
 var top=p.filter(function(a){return a.s===mx});
 var a=top[Math.floor(Math.random()*top.length)];
 sess.cur=a;sess.hor=h;sess.seen.push(a.id);sess.ph="propose"}

/* ---------- onglet 1 : suggestion ---------- */
function home(){
 var c=sess.cur;
 if(sess.ph==="idle")return'<section class="card" style="background:var(--c0)">'+(sess.msg?'<p class="big">'+esc(sess.msg)+'</p>':'')+'<h2>Un petit coup de mou ?</h2><p>Je te propose une activité pour te remettre d’aplomb.</p><button type="button" class="main" data-a="start">Trouver une activité</button></section>';
 if(sess.ph==="choose"){
  var b=sess.tied.map(function(h){return'<button type="button" class="bub" data-a="pick" data-h="'+h+'" aria-label="Couleur '+CN[h]+'" style="background:var(--s'+h+')"></button>'}).join("");
  return'<section class="card" style="background:var(--c4)"><h2>Choisis la couleur qui t’attire</h2><p class="mu">Fie-toi à ton instinct.</p><div class="bubbles">'+b+'</div></section>'}
 if(sess.ph==="propose")return'<section class="card" style="background:var(--h'+sess.hor+')"><div class="bigemo" aria-hidden="true">'+esc(emo(c))+'</div><p class="kicker">Ma suggestion</p><p class="act">'+esc(c.n)+'</p><div class="answers"><button type="button" class="main" data-a="yes">Oui, je fais ça</button><button type="button" class="reset" data-a="meh">Mouais…</button><button type="button" class="reset" data-a="no">Pas du tout envie</button></div></section>';
 if(sess.ph==="yes")return'<section class="card" style="background:var(--h'+sess.hor+')"><div class="bigemo" aria-hidden="true">'+esc(emo(c))+'</div><p class="kicker">C’est parti !</p><p class="act">'+esc(c.n)+'</p><p>Vas-y, tu vas te faire du bien 🌼</p><p class="mu" style="font-size:14px;margin-top:-6px">+1 ☀️ et une nouvelle marguerite dans ton jardin</p>'+linkBtn(c)+'<button type="button" class="main" data-a="done">C’est fait ✓</button></section>';
 return'<section class="card" style="background:var(--c3)"><h2>Tu as fait le tour !</h2><p>Plus rien à te proposer pour l’instant. Tu peux ajouter tes propres idées dans la base de données, ou tout reprendre depuis le début.</p><button type="button" class="main" data-a="restart">Recommencer</button></section>'}

/* ---------- onglet 2 : base de données ---------- */
var sortMode="h",newName="",newH=[],dbMsg="",armed=false,filt=[],pickFor=null,newE="🌼";
function chip(h,on,attrs){return'<button type="button" class="chip'+(on?' on':'')+'" aria-pressed="'+(on?"true":"false")+'" aria-label="'+HN[h]+'" title="'+HN[h]+'" '+attrs+' style="--k:var(--s'+h+')"></button>'}
function picker(){
 var h='<div class="picker" role="group" aria-label="Choisir un emoji">';
 EL.forEach(function(e){h+='<button type="button" class="pe" data-a="emojipick" data-e="'+e+'" aria-label="Emoji '+e+'">'+e+'</button>'});
 return h+'<div class="pown"><input class="nm" id="emojiin" placeholder="Ou colle ton emoji" aria-label="Autre emoji" maxlength="12"><button type="button" class="reset sm" data-a="emojiown">OK</button></div></div>'}
function setEmoji(e){
 if(pickFor==="new")newE=e;
 else{var a=S.acts.filter(function(k){return k.id===pickFor})[0];if(a){a.e=e;save()}}
 pickFor=null;render()}
function dbMain(){
 var h='<div style="margin:0 0 14px"><button type="button" class="main sm wide" data-a="wizopen">✨ Suggestions d’ajout d’activités</button></div>'+(dbOk?'<p class="banner" role="status" style="margin:0 0 12px">'+esc(dbOk)+'</p>':'')+'<section style="background:var(--c3)"><h2><span class="ico">🧪</span><span>Scores des hormones</span></h2><p class="mu" style="margin:0 0 4px;font-size:14px">Touche une hormone pour filtrer la liste (plusieurs possibles).</p><div class="hgrid">';
 for(var k=0;k<4;k++){var n=S.acts.filter(function(a){return a.h.indexOf(k)>-1}).length,on=filt.indexOf(k)>-1;
  h+='<button type="button" class="hc" data-a="dbfilt" data-h="'+k+'" aria-pressed="'+(on?"true":"false")+'" style="background:var(--h'+k+');--k:var(--s'+k+')"><span class="dot" style="background:var(--s'+k+')"></span><span class="hct"><strong>'+HN[k]+'</strong><br><span class="mu">'+n+' activités</span></span><span class="sc">'+S.hs[k]+'</span></button>'}
 h+='</div>'+(filt.length?'<div class="tools" style="margin:6px 0 0"><button type="button" class="reset sm" data-a="dbfiltclear">Tout afficher</button></div>':'')+'</section>';
 var rows=S.acts.map(function(a,i){return{a:a,i:i}});
 if(filt.length)rows=rows.filter(function(r){return r.a.h.some(function(k){return filt.indexOf(k)>-1})});
 if(sortMode==="s")rows.sort(function(x,y){return y.a.s-x.a.s||x.i-y.i});
 else if(sortMode==="a")rows.sort(function(x,y){return x.a.n.localeCompare(y.a.n,"fr",{sensitivity:"base"})||x.i-y.i});
 h+='<section style="background:var(--c3)"><h2><span class="ico">📋</span><span>Mes activités</span><span class="sn">'+(filt.length?rows.length+" / ":"")+S.acts.length+'</span></h2><div class="tools" style="justify-content:flex-start;margin-top:0"><span class="mu" style="font-size:14px;align-self:center">Trier :</span>'+[["h","Par hormone"],["s","Par score"],["a","A → Z"]].map(function(o){return'<button type="button" class="reset sm'+(sortMode===o[0]?" on":"")+'" aria-pressed="'+(sortMode===o[0]?"true":"false")+'" data-a="dbsort" data-v="'+o[0]+'">'+o[1]+'</button>'}).join("")+'</div><table><thead><tr><th>Activité et ses hormones</th><th class="c">Score</th><th><span class="sr">Supprimer</span></th></tr></thead><tbody>';
 if(!rows.length)h+='<tr><td colspan="3" class="mu">Aucune activité pour ce filtre.</td></tr>';
 rows.forEach(function(r){var a=r.a,c="";
  for(var k=0;k<4;k++)c+=chip(k,a.h.indexOf(k)>-1,'data-a="dbchip" data-i="'+a.id+'" data-h="'+k+'"');
  h+='<tr><td><div class="arow"><button type="button" class="emo" data-a="emojiopen" data-i="'+a.id+'" aria-label="Changer l’emoji" title="Changer l’emoji">'+esc(emo(a))+'</button><div class="aw">'+esc(a.n)+'<div class="chips">'+c+tagSel(a)+'</div></div></div></td><td class="score">'+a.s+'</td><td>'+(a.k?'<span class="lock" role="img" aria-label="Liée à un onglet : ne peut pas être supprimée" title="Liée à un onglet : ne peut pas être supprimée">🔒</span>':'<button type="button" class="x" data-a="dbdel" data-i="'+a.id+'" aria-label="Supprimer l’activité">🗑</button>')+'</td></tr>';
  if(pickFor===a.id)h+='<tr><td colspan="3">'+picker()+'</td></tr>'});
 h+='</tbody></table></section>';
 var nc="";for(var q=0;q<4;q++)nc+=chip(q,newH.indexOf(q)>-1,'data-a="dbnew" data-h="'+q+'"');
 h+='<section style="background:var(--c1)"><h2><span class="ico">➕</span><span>Ajouter mon activité</span></h2><div class="add"><button type="button" class="emo big" data-a="emojiopen" data-i="new" aria-label="Choisir un emoji" title="Choisir un emoji">'+esc(newE)+'</button><input class="nm" id="newname" placeholder="Ex. : Faire une sieste de 20 minutes" aria-label="Nouvelle activité" value="'+esc(newName)+'"></div>'+(pickFor==="new"?picker():'')+'<div class="addrow"><span class="mu">Balise :</span><select class="tagsel" id="newtag" aria-label="Balise de la nouvelle activité">'+tagOpts(newT)+'</select></div><div class="addrow"><span class="mu">Ses hormones :</span><div class="chips">'+nc+'</div><button type="button" class="reset sm" data-a="dbadd">Ajouter</button></div>'+(dbMsg?'<p class="mu" role="status" style="margin:0 0 6px">'+esc(dbMsg)+'</p>':'')+'</section>';
 h+='<div class="foot"><button type="button" class="reset" data-a="dbreset">'+(armed?"Confirmer : tout remettre à zéro":"Réinitialiser les scores")+'</button></div>';
 return h}
function dbAdd(){
 var name=newName.trim();
 if(!name){dbMsg="Écris d’abord le nom de l’activité.";render();return}
 if(!newH.length){dbMsg="Choisis au moins une couleur.";render();return}
 S.acts.push({id:S.next++,n:name,h:newH.slice().sort(),s:0,e:newE,g:newT});newName="";newH=[];newE="🌼";newT="generique";pickFor=null;dbMsg="";save();render()}

/* ---------- onglet 3 : to do list ---------- */
var todoDraft="";
function todo(){
 var open=S.todo.filter(function(t){return!t.d}).length;
 var h='<section style="background:var(--c1)"><h2><span class="ico">✅</span><span>To do list</span><span class="sn">'+(S.todo.length?open+" à faire":"")+'</span></h2>';
 if(!S.todo.length)h+='<p class="mu">Rien à faire pour l’instant. Profites-en ! 🌿</p>';
 h+='<ul>'+S.todo.map(function(t){return'<li class="trow"><label><input type="checkbox" data-a="todochk" data-i="'+t.id+'"'+(t.d?" checked":"")+'><span class="cb">'+TICK+'</span><span class="txt">'+esc(t.t)+'</span></label><button type="button" class="x" data-a="tododel" data-i="'+t.id+'" aria-label="Supprimer la tâche">🗑</button></li>'}).join("")+'</ul>';
 h+='<div class="add"><input class="nm" id="todoin" placeholder="Ajouter une tâche" aria-label="Nouvelle tâche" value="'+esc(todoDraft)+'"><button type="button" data-a="todoadd">Ajouter</button></div>';
 if(S.todo.some(function(t){return t.d}))h+='<div class="foot"><button type="button" class="reset" data-a="todoclear">Effacer les terminées</button></div>';
 return h+'</section>'}
function todoAdd(){var v=todoDraft.trim();if(!v)return;S.todo.push({id:S.next++,t:v,d:false});todoDraft="";save();render()}

/* ---------- onglet 4 : ligne du temps ---------- */
var tlView="day",tlAnchor=sod(new Date());
function dotBg(hs){var n=hs.length;if(n===1)return"var(--s"+hs[0]+")";var st=hs.map(function(h,i){return"var(--s"+h+") "+(i*100/n)+"% "+((i+1)*100/n)+"%"});return"conic-gradient("+st.join(",")+")"}
function tl(){
 var AX=70,PT=12,day=tlView==="day";
 var s=day?tlAnchor:addDays(tlAnchor,-6),e=addDays(tlAnchor,1);
 var H=day?768:700,ppm=H/(e-s);
 var f=function(d,o){return d.toLocaleDateString("fr-FR",o)};
 var title=day?f(tlAnchor,{weekday:"long",day:"numeric",month:"long"}):f(s,{day:"numeric",month:"short"})+" – "+f(tlAnchor,{day:"numeric",month:"short"});
 title=title.charAt(0).toUpperCase()+title.slice(1);
 var evs=S.tl.filter(function(v){return v.t>=+s&&v.t<+e}).sort(function(a,b){return a.t-b.t});
 var ticks="",i,y;
 if(day){for(i=0;i<24;i++){y=PT+i*H/24;ticks+='<div class="tk'+(i%3===0?" big":"")+'" style="top:'+y+'px"></div>'+(i%3===0?'<div class="tl" style="top:'+y+'px">'+pad(i)+'h</div>':'')}}
 else{for(i=0;i<7;i++){var d0=addDays(s,i),d1=addDays(s,i+1);y=PT+(d0-s)*ppm;
  ticks+='<div class="tk big" style="top:'+y+'px"></div><div class="tl b" style="top:'+y+'px">'+esc(f(d0,{weekday:"short",day:"numeric"}))+'</div>';
  for(var q=1;q<4;q++)ticks+='<div class="tk" style="top:'+(y+q*(d1-d0)*ppm/4)+'px"></div>'}}
 var last=-1e9,lab="",con="",dots="";
 evs.forEach(function(v){
  var yy=PT+(v.t-s)*ppm,lh=v.n.length>30?50:34,top=Math.max(yy-lh/2,last+4);last=top+lh;
  var dt=new Date(v.t),tm=pad(dt.getHours())+":"+pad(dt.getMinutes());
  if(!day)tm=f(dt,{weekday:"short"})+" "+tm;
  con+='<path d="M'+(AX+9)+" "+yy+"L"+(AX+30)+" "+(top+lh/2)+'"/>';
  dots+='<div class="tdot" style="top:'+yy+'px;background:'+dotBg(v.h)+'"></div>';
  lab+='<div class="ev" style="top:'+top+'px;height:'+lh+'px;background:var(--h'+v.h[0]+')"><span class="tm">'+esc(tm)+'</span><span class="en">'+esc((v.e?v.e+" ":"")+v.n)+'</span><button type="button" class="x" data-a="tldel" data-i="'+v.id+'" aria-label="Retirer de la ligne du temps">×</button></div>'});
 var total=Math.max(PT*2+H,last+PT+10);
 var now=Date.now(),nowEl="";
 if(now>=+s&&now<+e)nowEl='<div class="now" style="top:'+(PT+(now-s)*ppm)+'px"><span>maintenant</span></div>';
 var h='<section style="background:var(--c4)"><div class="tlhead"><button type="button" class="reset sm" data-a="tlprev" aria-label="Période précédente">‹</button><h2>'+esc(title)+'</h2><button type="button" class="reset sm" data-a="tlnext" aria-label="Période suivante">›</button></div>';
 h+='<div class="tools" style="margin:0 0 4px"><button type="button" class="reset sm'+(day?" on":"")+'" data-a="tlview" data-v="day">Jour</button><button type="button" class="reset sm'+(day?"":" on")+'" data-a="tlview" data-v="week">7 jours</button><button type="button" class="reset sm" data-a="tltoday">Aujourd’hui</button></div>';
 h+='<div class="tlbox" style="--ax:'+AX+'px;height:'+total+'px"><div class="axis"></div>'+ticks+nowEl+'<svg class="con" width="400" height="'+total+'" aria-hidden="true">'+con+'</svg>'+dots+lab;
 if(!evs.length)h+='<p class="empty">Rien d’inscrit sur cette période. Les activités que tu choisis apparaîtront ici 🌼</p>';
 h+='</div><div class="legend">';
 for(var k=0;k<4;k++)h+='<span><i class="dot" style="background:var(--s'+k+')"></i>'+HN[k]+'</span>';
 return h+'</div></section>'}

/* ---------- mes données : sauvegardes, export, restauration ---------- */
var dmsg="",bmsg="",rest={open:false,choix:null,erreur:"",continuer:true};
function resetRest(){rest={open:false,choix:null,erreur:"",continuer:true}}
var TXT_STATUT={inactive:"Pas encore activée",ok:"Active ✔",reconnecter:"En pause : à reconnecter",introuvable:"Fichier introuvable",erreur:"Problème à la dernière sauvegarde",conflit:"À vérifier : le fichier a plus d’historique (voir le bandeau en haut)"};
var TXT_PERSIST={inconnu:"Pas encore demandée",accorde:"Activée ✔",non:"Pas accordée par le navigateur",indisponible:"Pas disponible sur ce navigateur"};
function btn(act,label,cls){return'<button type="button" class="'+(cls||"reset sm")+'" data-a="'+act+'">'+label+'</button>'}
function plur(n,mot){return n+" "+mot+(n>1?"s":"")}
function donnees(){
 var s=BK.etat(),fd=BK.formaterDateHeure,h;
 h='<section style="background:var(--c2)"><h2><span class="ico">💾</span><span>Mes données</span></h2><p style="margin:0">Tes activités, ton jardin et tes pages sont enregistrés dans ce navigateur, sur cet appareil. Voici comment les protéger.</p>'+(dmsg?'<p class="banner" role="status" style="margin:10px 0 0">'+esc(dmsg)+'</p>':'')+'</section>';
 /* sauvegarde automatique */
 h+='<section style="background:var(--c3)"><h2><span class="ico">🔁</span><span>Sauvegarde automatique</span></h2><p style="margin:0 0 6px">Be Kind copie tes données dans un fichier que tu choisis et le met à jour tout seul à chaque changement.</p>';
 if(s.supporte){
  h+='<p style="margin:6px 0"><strong>État :</strong> '+TXT_STATUT[s.statut]+'</p>'+(s.nom?'<p style="margin:6px 0">Fichier : <strong>'+esc(s.nom)+'</strong></p>':'')+(s.derniere?'<p style="margin:6px 0">Dernière sauvegarde : '+esc(fd(s.derniere))+'</p>':'')+'<p class="mu" style="font-size:14px;margin:6px 0">Pour ta vie privée, le navigateur ne donne que le nom du fichier, pas son emplacement. Si tu le déplaces, le renommes ou le supprimes, Be Kind te prévient.</p><div class="tools" style="justify-content:flex-start">';
  if(s.statut==="inactive")h+=btn("dauto","Activer la sauvegarde automatique","main sm");
  if(s.statut==="reconnecter")h+=btn("drecon","Reconnecter","main sm");
  if(s.statut==="ok"||s.statut==="erreur"||s.statut==="introuvable")h+=btn("dauto",s.statut==="introuvable"?"Choisir un nouvel emplacement":"Changer d’emplacement","main sm");
  if(s.statut!=="inactive")h+=btn("dstop","Arrêter");
  h+='</div>';
 }else h+='<p>Ton navigateur ne sait pas faire ça (c’est le cas de Firefox et de Safari, par exemple). Pas grave : utilise l’export ci-dessous de temps en temps.</p>';
 h+='</section>';
 /* protection */
 h+='<section style="background:var(--c1)"><h2><span class="ico">🛡️</span><span>Protection contre le nettoyage</span></h2><p style="margin:0 0 6px">Quand l’appareil manque de place, il peut supprimer les données des sites sans prévenir. On demande au navigateur de ne pas toucher à celles de Be Kind.</p><p style="margin:6px 0"><strong>État :</strong> '+TXT_PERSIST[s.persistant]+'</p>';
 if(s.persistant!=="accorde"&&s.persistant!=="indisponible")h+='<div class="tools" style="justify-content:flex-start">'+btn("dpersist","Demander la protection","main sm")+'</div>';
 h+='<p class="mu" style="font-size:14px;margin:6px 0 2px">Ça ne protège pas si tu effaces toi-même les données du navigateur : pour ça, il y a la sauvegarde automatique.</p></section>';
 /* export */
 h+='<section style="background:var(--c4)"><h2><span class="ico">📤</span><span>Exporter mes données</span></h2><p style="margin:0 0 6px">Tu récupères un fichier à envoyer où tu veux : Drive, mail, ordinateur… Pratique pour changer d’appareil ou garder une copie.</p><div class="tools" style="justify-content:flex-start">'+btn("dexp","Exporter mes données","main sm")+'</div>'+(s.dernierExport?'<p class="mu" style="font-size:14px;margin:6px 0 2px">Dernier export : '+esc(fd(s.dernierExport))+'</p>':'')+'</section>';
 /* restauration */
 h+='<section style="background:var(--c0)"><h2><span class="ico">📥</span><span>Restaurer</span></h2>';
 if(!rest.open){
  h+='<div class="tools" style="justify-content:flex-start;margin-top:0">'+btn("drest","Restaurer depuis un fichier","main sm")+(BK.existeCopieAvantImport()?btn("dundo","Annuler la dernière restauration"):"")+'</div>';
 }else if(!rest.choix){
  h+='<p style="margin:0 0 6px">Choisis ton fichier de sauvegarde Be Kind (il se termine par .json).</p>'+(rest.erreur?'<p class="banner" role="alert" style="margin:6px 0">'+esc(rest.erreur)+'</p>':'')+'<div class="tools" style="justify-content:flex-start">'+(s.supporte?btn("dchoose","Choisir un fichier","main sm"):'<label class="main sm" style="display:inline-block;text-align:center">Choisir un fichier<input type="file" id="dfile" accept=".json,application/json" style="display:none"></label>')+btn("dcancel","Annuler")+'</div>';
 }else{
  var r=rest.choix.resume;
  h+='<p style="margin:0 0 4px"><strong>'+esc(rest.choix.nom)+'</strong></p><ul style="margin:4px 0 8px;padding-left:20px">'+(r.exporteLe?'<li>Enregistré le '+esc(fd(r.exporteLe))+'</li>':'')+'<li>'+plur(r.nbActivites,"activité")+'</li><li>'+plur(r.nbValides,"activité réalisée")+', '+plur(r.nbFleurs,"fleur")+' dans le jardin</li><li>'+plur(r.nbPages,"page")+' de journal</li></ul><p class="banner" style="margin:6px 0">⚠ Ça remplace les données de cet appareil. Tu pourras annuler juste après, ici même.</p>';
  if(rest.choix.handle)h+='<label><input type="checkbox" data-a="dcont"'+(rest.continuer?" checked":"")+'><span class="cb">'+TICK+'</span><span class="sgt">Continuer à sauvegarder automatiquement dans ce fichier</span></label>';
  h+='<div class="tools" style="justify-content:flex-start">'+btn("dconfirm","Remplacer mes données","main sm")+btn("dother","Choisir un autre fichier")+'</div>';
 }
 return h+'</section>'}
function recevoir(res){
 if(res.annule)return;
 if(!res.ok){rest.choix=null;rest.erreur=res.erreur}else{rest.erreur="";rest.choix=res}
 render()}
/* bandeaux en haut de l'écran + repère « sauvegarde active » */
function renderBandeau(){
 var s=BK.etat(),el=document.getElementById("bandeau"),ind=document.getElementById("ind"),h="",n;
 if(ind){
  if(s.statut==="inactive")ind.hidden=true;
  else{var pb=s.statut!=="ok";ind.hidden=false;ind.className="indic"+(pb?" alerte":"");ind.textContent=pb?"⚠ Sauvegarde à vérifier":(s.derniere?"✔ Sauvegardé "+BK.formaterCourt(s.derniere):"✔ Sauvegarde active")}}
 var zone=function(t,cls,b){return'<div class="bandeau '+cls+'" role="'+(cls==="info"?"status":"alert")+'"><p>'+t+'</p>'+(bmsg?'<p class="banner">'+esc(bmsg)+'</p>':'')+'<div class="tools" style="justify-content:flex-start;margin:0">'+b+'</div></div>'};
 if(s.stockage==="erreur")h=zone("Be Kind n’arrive pas à enregistrer sur cet appareil (stockage plein ou bloqué, navigation privée ?). Fais un export pour ne rien perdre.","alerte",btn("bnexp","Exporter mes données"));
 else if(s.statut==="reconnecter")h=zone("Ta sauvegarde automatique est en pause : le navigateur veut que tu reconfirmes l’accès au fichier « "+esc(s.nom||"")+" ».","alerte",btn("drecon","Reconnecter"));
 else if(s.statut==="introuvable")h=zone("Le fichier de sauvegarde « "+esc(s.nom||"")+" » est introuvable. Il a peut-être été déplacé, renommé ou supprimé.","alerte",btn("dauto","Choisir un nouvel emplacement"));
 else if(s.statut==="erreur")h=zone("La dernière sauvegarde n’a pas marché. Be Kind réessaiera à ta prochaine action.","alerte",btn("bnretry","Réessayer"));
 else if(s.statut==="conflit")h=zone("Le fichier « "+esc(s.nom||"")+" » contient plus d’historique que cet appareil"+(s.conflit?" ("+plur(s.conflit.nbValides,"activité réalisée")+")":"")+". Tu veux récupérer ces données ?","alerte",btn("bnrestore","Restaurer depuis le fichier")+btn("bnkeep","Garder cet appareil"));
 else if(s.statut==="inactive"&&!BK.rappelMasque()&&(n=BK.elementsSansSauvegarde(S))>=7)h=zone("Tu as fait "+n+" choses (activités, pages) depuis ta dernière sauvegarde. Fais-en une copie pour ne rien perdre.","info",btn("bnexp","Sauvegarder maintenant")+btn("bnlater","Plus tard"));
 if(el)el.innerHTML=h}

/* ---------- affichage et événements ---------- */
var tab="home";
function render(focus){
 var v=document.getElementById("view");
 document.querySelectorAll(".tab").forEach(function(b){b.setAttribute("aria-selected",b.dataset.t===tab?"true":"false")});
 v.innerHTML=tab==="home"?home():tab==="garden"?garden():tab==="db"?db():tab==="todo"?todo():tab==="data"?donnees():(tab==="gr"||tab==="sl")?journal(tab):tl();
 if(focus){var b=v.querySelector(".card button");if(b)b.focus({preventScroll:true})}}

document.addEventListener("click",function(e){
 var b=e.target.closest("[data-a],[data-t]");if(!b)return;
 if(b.dataset.t){tab=b.dataset.t;armed=false;dbMsg="";dbOk="";pickFor=null;gMode=null;gMsg="";selId=null;wiz=null;jarm="";jmsg="";dmsg="";resetRest();if(tab==="gr"||tab==="sl")pickRem(tab);render();return}
 var a=b.dataset.a,id=+b.dataset.i,h=+b.dataset.h,x,idx;
 switch(a){
  case"start":sess=newSess();decide();render(true);break;
  case"pick":propose(h);render(true);break;
  case"yes":x=sess.cur;x.s++;x.h.forEach(function(k){S.hs[k]++});S.sun++;addFlower(x);S.tl.push({id:S.next++,t:Date.now(),n:x.n,e:emo(x),h:x.h.slice()});save();sess.ph="yes";render(true);break;
  case"meh":propose(sess.hor);render(true);break;
  case"no":sess.excl.push(sess.hor);decide();render(true);break;
  case"done":sess=newSess("Bravo, une activité de plus pour prendre soin de toi 🌼");render(true);break;
  case"restart":sess.excl=[];sess.seen=[];decide();render(true);break;
  case"dbchip":x=S.acts.filter(function(k){return k.id===id})[0];if(!x)break;idx=x.h.indexOf(h);
   if(idx>-1){if(x.h.length>1)x.h.splice(idx,1)}else{x.h.push(h);x.h.sort()}save();render();break;
  case"dbdel":S.acts=S.acts.filter(function(k){return k.id!==id||k.k});save();render();break;
  case"dbsort":sortMode=b.dataset.v;render();break;
  case"dbnew":idx=newH.indexOf(h);if(idx>-1)newH.splice(idx,1);else newH.push(h);render();break;
  case"dbadd":dbAdd();break;
  case"dbreset":if(!armed){armed=true;render();break}armed=false;S.acts.forEach(function(k){k.s=0});S.hs=[0,0,0,0];save();render();break;
  case"dbfilt":idx=filt.indexOf(h);if(idx>-1)filt.splice(idx,1);else filt.push(h);render();break;
  case"dbfiltclear":filt=[];render();break;
  case"emojiopen":x=b.dataset.i==="new"?"new":id;pickFor=pickFor===x?null:x;render();break;
  case"emojipick":setEmoji(b.dataset.e);break;
  case"emojiown":x=firstEmoji((document.getElementById("emojiin")||{}).value);if(x)setEmoji(x);break;
  case"wizopen":wizOpen();dbOk="";render();break;
  case"wizclose":wiz=null;render();break;
  case"wizback":if(wiz.step>0)wiz.step--;else wiz=null;render();break;
  case"wizyn":x=b.dataset.g;wiz.ans[x]=+b.dataset.v;idx=wiz.tg.indexOf(x);if(b.dataset.v==="1"){if(idx<0)wiz.tg.push(x)}else if(idx>-1)wiz.tg.splice(idx,1);wiz.step++;render();break;
  case"wiztog":toggleT(b.dataset.g);render();break;
  case"wiznext":wiz.step++;render();break;
  case"wizadd":wizAdd();break;
  case"golink":tab=b.dataset.j;pickRem(tab);jmsg="";render();break;
  case"jsave":jSave(b.dataset.j);break;
  case"jrem":pickRem(b.dataset.j);render();break;
  case"jdel":x=b.dataset.j+":"+id;if(jarm===x){S[b.dataset.j]=S[b.dataset.j].filter(function(k){return k.id!==id});jarm="";save();pickRem(b.dataset.j)}else jarm=x;render();break;
  case"dauto":bmsg="";dmsg="";BK.activerAuto().then(function(r){if(!r.ok&&r.raison==="erreur")dmsg="Je n’ai pas réussi à créer le fichier. Réessaie ou choisis un autre dossier.";renderBandeau();render()});break;
  case"drecon":bmsg="";BK.reconnecter().then(function(r){bmsg=(!r.ok&&r.raison==="refuse")?"L’accès a été refusé. Appuie à nouveau sur « Reconnecter » et choisis « Autoriser ».":"";renderBandeau();render()});break;
  case"dstop":if(window.confirm("Arrêter la sauvegarde automatique ? Le fichier restera où il est, mais ne sera plus mis à jour."))BK.desactiverAuto().then(function(){renderBandeau();render()});break;
  case"dpersist":BK.demanderPersistant().then(render);break;
  case"dexp":BK.exporter().then(function(r){dmsg=r==="partage"?"Fichier partagé ✔":r==="telecharge"?"Fichier téléchargé ✔ Regarde dans tes téléchargements.":"";renderBandeau();render()});break;
  case"bnexp":BK.exporter().then(function(){renderBandeau()});break;
  case"bnretry":BK.sauvegarderMaintenant();break;
  case"bnrestore":BK.resoudreConflit("restaurer").then(function(r){if(r==="recharger")window.location.reload()});break;
  case"bnkeep":if(window.confirm("Le fichier de sauvegarde sera remplacé par les données de cet appareil. Continuer ?"))BK.resoudreConflit("ecraser");break;
  case"bnlater":BK.masquerRappel();renderBandeau();break;
  case"drest":resetRest();rest.open=true;render();break;
  case"dchoose":BK.choisirFichier().then(recevoir);break;
  case"dcancel":resetRest();render();break;
  case"dother":rest.choix=null;rest.erreur="";render();break;
  case"dconfirm":BK.confirmerRestauration(rest.choix,{continuerDansCeFichier:rest.continuer&&!!rest.choix.handle}).then(function(){window.location.reload()}).catch(function(){rest.choix=null;rest.erreur="La restauration n’a pas marché. Tes données actuelles n’ont pas été touchées.";render()});break;
  case"dundo":if(window.confirm("Revenir aux données d’avant la dernière restauration ?"))BK.annulerDernierImport().then(function(ok){if(ok)window.location.reload();else{dmsg="Impossible d’annuler : la copie de secours n’est pas lisible.";render()}});break;
  case"gbuy":gMode="pick";gMsg="";selId=null;render();break;
  case"gcancel":gMode=null;render();break;
  case"todoadd":todoAdd();break;
  case"tododel":S.todo=S.todo.filter(function(k){return k.id!==id});save();render();break;
  case"todoclear":S.todo=S.todo.filter(function(k){return!k.d});save();render();break;
  case"tlprev":tlAnchor=addDays(tlAnchor,tlView==="day"?-1:-7);render();break;
  case"tlnext":tlAnchor=addDays(tlAnchor,tlView==="day"?1:7);render();break;
  case"tltoday":tlAnchor=sod(new Date());render();break;
  case"tlview":tlView=b.dataset.v;render();break;
  case"tldel":S.tl=S.tl.filter(function(k){return k.id!==id});save();render();break}});
document.addEventListener("change",function(e){
 var t=e.target;
 if(t.id==="newtag"){newT=t.value;return}
 if(t.dataset.a==="dbtag"){var y=S.acts.filter(function(k){return k.id===+t.dataset.i})[0];if(y){y.g=t.value;save()}return}
 if(t.dataset.a==="wizchk"){if(t.checked)delete wiz.off[+t.dataset.i];else wiz.off[+t.dataset.i]=1;var wc=document.getElementById("wizcount");if(wc)wc.textContent=wizCands().filter(function(o){return!wiz.off[o.i]}).length;return}
 if(t.dataset.a==="dcont"){rest.continuer=t.checked;return}
 if(t.id==="dfile"){var ff=t.files&&t.files[0];t.value="";if(ff)BK.lireFichierChoisi(ff).then(recevoir);return}
 if(t.dataset.a!=="todochk")return;
 var x=S.todo.filter(function(k){return k.id===+t.dataset.i})[0];if(x){x.d=t.checked;save();render()}});
document.addEventListener("input",function(e){
 if(e.target.id==="newname")newName=e.target.value;
 else if(e.target.id==="todoin")todoDraft=e.target.value;
 else if(e.target.dataset.j&&e.target.dataset.n)jd[e.target.dataset.j][+e.target.dataset.n]=e.target.value});
document.addEventListener("keydown",function(e){
 if(e.key!=="Enter")return;
 if(e.target.id==="newname"){e.preventDefault();dbAdd()}
 else if(e.target.id==="todoin"){e.preventDefault();todoAdd()}
 else if(e.target.dataset.j&&e.target.dataset.n){e.preventDefault();var jj=e.target.dataset.j,nn=+e.target.dataset.n;if(nn<2){var nx=document.querySelector('[data-j="'+jj+'"][data-n="'+(nn+1)+'"]');if(nx)nx.focus()}else jSave(jj)}
 else if(e.target.id==="emojiin"){e.preventDefault();var fe=firstEmoji(e.target.value);if(fe)setEmoji(fe)}});
BK.abonner(function(){renderBandeau();if(tab==="data")render()});
BK.initialiser();
renderBandeau();
render();

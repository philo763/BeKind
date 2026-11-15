/* ---------------------------------------------------------------------------
   Stockage et sauvegarde des données (même principe qu'Habibits)
    - stockage dans le navigateur (localStorage), une clé par type de données
    - sauvegarde automatique dans un fichier choisi par l'utilisateur
      (API d'accès aux fichiers : Chrome, Edge, Samsung Internet)
    - export (menu de partage ou téléchargement) et restauration
    - demande de stockage persistant (anti-nettoyage automatique)
   Module ES : tout passe par l’objet BK exporté.
--------------------------------------------------------------------------- */
export const BK=(function(){
 var APP="bekind",VERSION=1;
 var PREFIXE="bekind.";
 var ANCIENNE_CLE="bekind-v1"; /* ancien format : tout dans une seule clé */
 var CLE_META="bekind.sauvegarde",CLE_ACCUEIL="bekind.accueil",CLE_AVANT="bekind.avant-import";
 var CLE_LIEN="fichier-sauvegarde";
 var CLES=["activites","hormones","jardin","timeline","todo","gratitude","selflove","journaux","profil","compteur"];
 var OPTIONS_FICHIER={types:[{description:"Sauvegarde Be Kind",accept:{"application/json":[".json"]}}]};

 /* ---------- lecture / écriture ---------- */
 function lire(cle){try{var v=localStorage.getItem(PREFIXE+cle);return v===null?null:JSON.parse(v)}catch(e){return null}}
 function ecrire(cle,valeur){try{localStorage.setItem(PREFIXE+cle,JSON.stringify(valeur===undefined?null:valeur));return true}catch(e){return false}}
 /* petits réglages (hors données : ils ne font pas partie de la sauvegarde) */
 function lireLocal(cle){try{return JSON.parse(localStorage.getItem(cle))||{}}catch(e){return {}}}
 function ecrireLocal(cle,patch){try{var o=lireLocal(cle);for(var k in patch)o[k]=patch[k];localStorage.setItem(cle,JSON.stringify(o))}catch(e){}}
 function signaler(){try{window.dispatchEvent(new Event("bekind:donnees-modifiees"))}catch(e){}}

 /* ---------- correspondance entre l'état de l'appli (S) et les clés ---------- */
 function versDonnees(S){
  return{activites:S.acts||[],hormones:S.hs||[0,0,0,0],jardin:{garden:S.garden||[],sun:S.sun||0},timeline:S.tl||[],todo:S.todo||[],gratitude:S.gr||[],selflove:S.sl||[],journaux:S.jr||{},profil:S.prof||null,compteur:S.next||1};
 }
 function maxIdDe(d){
  var m=0;
  function parcourir(l){(l||[]).forEach(function(x){if(x&&typeof x.id==="number"&&x.id>m)m=x.id})}
  parcourir(d.activites);parcourir(d.timeline);parcourir(d.todo);parcourir(d.gratitude);parcourir(d.selflove);parcourir(d.jardin&&d.jardin.garden);Object.keys(d.journaux||{}).forEach(function(k){parcourir(d.journaux[k])});
  return m;
 }
 function chargerDepuisCles(){
  var acts=lire("activites");
  if(!Array.isArray(acts))return null;
  var j=lire("jardin")||{},hs=lire("hormones");
  var S={v:1,acts:acts,
   hs:(Array.isArray(hs)&&hs.length===4)?hs:[0,0,0,0],
   tl:lire("timeline")||[],todo:lire("todo")||[],gr:lire("gratitude")||[],sl:lire("selflove")||[],jr:lire("journaux")||{}};
  if(Array.isArray(j.garden))S.garden=j.garden;
  if(typeof j.sun==="number")S.sun=j.sun;
  var p=lire("profil");if(p)S.prof=p;
  var d=versDonnees(S);
  S.next=Math.max(lire("compteur")||1,maxIdDe(d)+1);
  return S;
 }
 /* appelé une fois au lancement : renvoie l'état, ou null s'il n'y a rien d'enregistré */
 function charger(){
  var S=chargerDepuisCles();
  if(S)return S;
  /* reprise des données enregistrées avant (clé unique), sans les effacer */
  try{
   var ancien=JSON.parse(localStorage.getItem(ANCIENNE_CLE));
   if(ancien&&Array.isArray(ancien.acts)){sauvegarder(ancien);return ancien}
  }catch(e){}
  return null;
 }
 function sauvegarder(S){
  var d=versDonnees(S),ok=true;
  CLES.forEach(function(k){if(!ecrire(k,d[k]))ok=false});
  if(!ok)maj({stockage:"erreur"});else if(etat.stockage!=="ok")maj({stockage:"ok"});
  signaler();
  return ok;
 }
 /* ce qui est réellement enregistré (sert aux exports et à la sauvegarde automatique) */
 function lireDonnees(){
  var j=lire("jardin")||{};
  return{activites:lire("activites")||[],hormones:lire("hormones")||[0,0,0,0],jardin:{garden:j.garden||[],sun:j.sun||0},timeline:lire("timeline")||[],todo:lire("todo")||[],gratitude:lire("gratitude")||[],selflove:lire("selflove")||[],journaux:lire("journaux")||{},profil:lire("profil"),compteur:lire("compteur")||1};
 }
 function construire(){return{app:APP,version:VERSION,exporteLe:new Date().toISOString(),donnees:lireDonnees()}}
 function nbPagesJournaux(j){var n=0;Object.keys(j||{}).forEach(function(k){n+=(j[k]||[]).length});return n}
 function compterHistorique(d){return((d.timeline||[]).length)+((d.gratitude||[]).length)+((d.selflove||[]).length)+nbPagesJournaux(d.journaux)}

 /* ---------- format du fichier : vérification ---------- */
 function verifier(texte){
  var o;
  try{o=JSON.parse(texte)}catch(e){return{ok:false,erreur:"Ce fichier n’est pas lisible. Choisis un fichier de sauvegarde Be Kind (.json)."}}
  if(!o||o.app!==APP)return{ok:false,erreur:"Ce fichier ne vient pas de Be Kind."};
  if(typeof o.version!=="number"||o.version>VERSION)return{ok:false,erreur:"Ce fichier vient d’une version plus récente de Be Kind. Mets l’appli à jour, puis réessaie."};
  var d=o.donnees||{};
  var actsOk=Array.isArray(d.activites)&&d.activites.length>0&&d.activites.every(function(a){return a&&typeof a.id==="number"&&typeof a.n==="string"&&Array.isArray(a.h)&&a.h.every(function(k){return k===0||k===1||k===2||k===3})});
  var hsOk=Array.isArray(d.hormones)&&d.hormones.length===4&&d.hormones.every(function(x){return typeof x==="number"&&isFinite(x)});
  var jOk=d.jardin&&Array.isArray(d.jardin.garden)&&typeof d.jardin.sun==="number";
  var listesOk=["timeline","todo","gratitude","selflove"].every(function(k){return Array.isArray(d[k])});
  if(!actsOk||!hsOk||!jOk||!listesOk)return{ok:false,erreur:"Le contenu du fichier est incomplet ou abîmé. Essaie une autre sauvegarde."};
  var donnees={activites:d.activites,hormones:d.hormones,jardin:{garden:d.jardin.garden,sun:d.jardin.sun},timeline:d.timeline,todo:d.todo,gratitude:d.gratitude,selflove:d.selflove,journaux:(d.journaux&&typeof d.journaux==="object")?d.journaux:{},profil:d.profil||null};
  donnees.compteur=Math.max(typeof d.compteur==="number"?d.compteur:1,maxIdDe(donnees)+1);
  return{ok:true,
   sauvegarde:{app:APP,version:VERSION,exporteLe:o.exporteLe,donnees:donnees},
   resume:{nbActivites:d.activites.length,nbFleurs:d.jardin.garden.length,nbPages:d.gratitude.length+d.selflove.length+nbPagesJournaux(d.journaux),nbValides:d.timeline.length,exporteLe:o.exporteLe}};
 }

 /* remplace les données de l'appli (en gardant une copie pour pouvoir annuler) */
 function appliquer(sauvegarde){
  try{localStorage.setItem(CLE_AVANT,JSON.stringify(construire()))}catch(e){}
  var d=sauvegarde.donnees,ok=true;
  CLES.forEach(function(k){
   var v=k==="jardin"?{garden:d.jardin.garden,sun:d.jardin.sun}:d[k];
   if(!ecrire(k,v))ok=false;
  });
  signaler();
  if(!ok)throw new Error("stockage");
 }
 function existeCopieAvantImport(){try{return localStorage.getItem(CLE_AVANT)!==null}catch(e){return false}}
 /* annule la dernière restauration (les deux versions s'échangent : on peut annuler l'annulation) */
 async function annulerDernierImport(){
  var brut;try{brut=localStorage.getItem(CLE_AVANT)}catch(e){return false}
  if(!brut)return false;
  var v=verifier(brut);
  if(!v.ok)return false;
  appliquer(v.sauvegarde);
  return true;
 }

 /* ---------- dates d'affichage ---------- */
 function formaterDateHeure(iso){
  if(!iso)return"";
  return new Date(iso).toLocaleString("fr-FR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
 }
 function formaterCourt(iso){
  var d=new Date(iso),a=new Date();
  if(d.toDateString()===a.toDateString())return d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
  return d.toLocaleDateString("fr-FR",{day:"numeric",month:"numeric"});
 }

 /* ---------- petit coffre IndexedDB : il garde le lien vers le fichier de sauvegarde ---------- */
 function ouvrirBase(){
  return new Promise(function(resolve,reject){
   var d=indexedDB.open("bekind-sauvegarde",1);
   d.onupgradeneeded=function(){d.result.createObjectStore("coffre")};
   d.onsuccess=function(){resolve(d.result)};
   d.onerror=function(){reject(d.error)};
  });
 }
 async function coffre(mode,action){
  var base=await ouvrirBase();
  return new Promise(function(resolve,reject){
   var tr=base.transaction("coffre",mode),d=action(tr.objectStore("coffre"));
   tr.oncomplete=function(){base.close();resolve(d.result)};
   tr.onerror=function(){base.close();reject(tr.error)};
   tr.onabort=function(){base.close();reject(tr.error)};
  });
 }
 function lireCoffre(cle){return coffre("readonly",function(m){return m.get(cle)})}
 function ecrireCoffre(cle,v){return coffre("readwrite",function(m){return m.put(v,cle)})}
 function effacerCoffre(cle){return coffre("readwrite",function(m){return m.delete(cle)})}

 /* ---------- état partagé avec l'interface ----------
    statut : "inactive" | "ok" | "reconnecter" | "introuvable" | "erreur" | "conflit"
    persistant : "inconnu" | "accorde" | "non" | "indisponible"
    stockage : "ok" | "erreur" (le navigateur refuse d'enregistrer) */
 var meta0=lireLocal(CLE_META);
 var etat={
  supporte:("showSaveFilePicker" in window)&&("showOpenFilePicker" in window),
  statut:"inactive",nom:null,derniere:meta0.derniereAuto||null,dernierExport:meta0.dernierExport||null,
  persistant:"inconnu",conflit:null,stockage:"ok"
 };
 var ecouteurs=[];
 function maj(patch){for(var k in patch)etat[k]=patch[k];ecouteurs.forEach(function(f){f()})}
 function abonner(f){ecouteurs.push(f)}

 /* ---------- stockage persistant (anti-nettoyage automatique) ---------- */
 async function rafraichirPersistant(){
  if(!navigator.storage||!navigator.storage.persisted){maj({persistant:"indisponible"});return}
  try{maj({persistant:(await navigator.storage.persisted())?"accorde":"non"})}catch(e){maj({persistant:"inconnu"})}
 }
 /* memoriser = true : on se souvient que l'utilisateur est d'accord et on redemandera
    discrètement à chaque lancement tant que le navigateur n'a pas dit oui */
 async function demanderPersistant(memoriser){
  if(memoriser!==false)ecrireLocal(CLE_ACCUEIL,{persistantDemande:true});
  if(!navigator.storage||!navigator.storage.persist){maj({persistant:"indisponible"});return"indisponible"}
  try{
   var deja=await navigator.storage.persisted();
   var accorde=deja||(await navigator.storage.persist());
   maj({persistant:accorde?"accorde":"non"});
   return accorde?"accorde":"non";
  }catch(e){maj({persistant:"non"});return"non"}
 }

 /* ---------- sauvegarde automatique dans un fichier ---------- */
 var lien=null,verifie=false,minuteur=null,enCours=false,aRecommencer=false,sauvegardeEnConflit=null;
 function statutDepuisErreur(e){
  var n=e&&e.name;
  if(n==="NotFoundError")return"introuvable";
  if(n==="NotAllowedError"||n==="SecurityError")return"reconnecter";
  return"erreur";
 }
 async function ecrireDansFichier(){
  var s=construire(),flux=await lien.createWritable();
  try{await flux.write(JSON.stringify(s,null,2));await flux.close()}
  catch(e){try{await flux.abort()}catch(x){}throw e}
 }
 async function sauvegarderMaintenant(){
  if(!lien||(etat.statut!=="ok"&&etat.statut!=="erreur"))return;
  if(enCours){aRecommencer=true;return}
  enCours=true;
  try{
   var permission=await lien.queryPermission({mode:"readwrite"});
   if(permission!=="granted"){maj({statut:"reconnecter"});return}
   /* sécurité : au premier passage, on vérifie qu'on n'écrase pas un fichier plus complet */
   if(!verifie){
    var fichier=await lien.getFile();
    var v=verifier(await fichier.text());
    if(v.ok&&compterHistorique(v.sauvegarde.donnees)>compterHistorique(lireDonnees())){
     sauvegardeEnConflit=v.sauvegarde;
     maj({statut:"conflit",conflit:v.resume});
     return;
    }
    verifie=true;
   }
   await ecrireDansFichier();
   var maintenant=new Date().toISOString();
   ecrireLocal(CLE_META,{derniereAuto:maintenant});
   maj({statut:"ok",derniere:maintenant});
  }catch(e){maj({statut:statutDepuisErreur(e)})}
  finally{
   enCours=false;
   if(aRecommencer){aRecommencer=false;sauvegarderMaintenant()}
  }
 }
 async function memoriserLien(fichier){
  lien=fichier;verifie=false;
  try{await ecrireCoffre(CLE_LIEN,fichier)}catch(e){}
  ecrireLocal(CLE_META,{nom:fichier.name});
  maj({nom:fichier.name});
 }
 /* à appeler une fois au lancement de l'appli */
 var initialise=false;
 async function initialiser(){
  if(initialise)return;
  initialise=true;
  /* écriture regroupée : on attend un court instant après la dernière modification */
  window.addEventListener("bekind:donnees-modifiees",function(){
   clearTimeout(minuteur);
   minuteur=setTimeout(sauvegarderMaintenant,1500);
  });
  /* si l'appli passe en arrière-plan, on écrit tout de suite */
  document.addEventListener("visibilitychange",function(){
   if(document.visibilityState==="hidden"){clearTimeout(minuteur);sauvegarderMaintenant()}
  });
  if(lireLocal(CLE_ACCUEIL).persistantDemande)demanderPersistant(false);else rafraichirPersistant();
  if(!etat.supporte)return;
  try{
   var fichier=await lireCoffre(CLE_LIEN);
   if(!fichier)return;
   lien=fichier;
   maj({nom:fichier.name});
   var permission=await fichier.queryPermission({mode:"readwrite"});
   if(permission==="granted"){maj({statut:"ok"});await sauvegarderMaintenant()}
   else maj({statut:"reconnecter"});
  }catch(e){/* coffre indisponible (navigation privée, par exemple) : pas de sauvegarde automatique */}
 }
 /* l'utilisateur choisit où créer son fichier (à appeler depuis un bouton) */
 async function activerAuto(){
  if(!etat.supporte)return{ok:false,raison:"non-supporte"};
  try{
   var fichier=await window.showSaveFilePicker({suggestedName:"bekind-sauvegarde.json",types:OPTIONS_FICHIER.types});
   await memoriserLien(fichier);
   verifie=true; /* fichier choisi à l'instant : on peut écrire sans comparer */
   maj({statut:"ok",conflit:null});
   await sauvegarderMaintenant();
   return{ok:true};
  }catch(e){
   if(e&&e.name==="AbortError")return{ok:false,raison:"annule"};
   return{ok:false,raison:"erreur"};
  }
 }
 /* l'utilisateur reconfirme l'accès au fichier (à appeler depuis un bouton) */
 async function reconnecter(){
  if(!lien)return activerAuto();
  try{
   var permission=await lien.requestPermission({mode:"readwrite"});
   if(permission!=="granted")return{ok:false,raison:"refuse"};
   maj({statut:"ok"});
   await sauvegarderMaintenant();
   return{ok:true};
  }catch(e){return{ok:false,raison:"erreur"}}
 }
 async function desactiverAuto(){
  lien=null;verifie=false;sauvegardeEnConflit=null;
  try{await effacerCoffre(CLE_LIEN)}catch(e){}
  ecrireLocal(CLE_META,{nom:null,derniereAuto:null});
  maj({statut:"inactive",nom:null,derniere:null,conflit:null});
 }
 /* le fichier contient plus d'historique que l'appareil : on récupère le fichier, ou on garde l'appareil */
 async function resoudreConflit(choix){
  if(choix==="restaurer"&&sauvegardeEnConflit){
   appliquer(sauvegardeEnConflit);
   sauvegardeEnConflit=null;verifie=true;
   maj({statut:"ok",conflit:null});
   return"recharger";
  }
  sauvegardeEnConflit=null;verifie=true;
  maj({statut:"ok",conflit:null});
  await sauvegarderMaintenant();
  return"ok";
 }

 /* ---------- export ---------- */
 async function exporter(){
  var d=new Date(),nom="bekind-"+d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+".json";
  var fichier=new File([JSON.stringify(construire(),null,2)],nom,{type:"application/json"});
  function noter(){var m=new Date().toISOString();ecrireLocal(CLE_META,{dernierExport:m});maj({dernierExport:m})}
  /* sur téléphone : menu de partage (Fichiers, Drive, mail...) */
  if(navigator.canShare&&navigator.canShare({files:[fichier]})){
   try{await navigator.share({files:[fichier],title:"Sauvegarde Be Kind"});noter();return"partage"}
   catch(e){if(e&&e.name==="AbortError")return"annule"}
  }
  /* sinon : téléchargement classique */
  var url=URL.createObjectURL(fichier),a=document.createElement("a");
  a.href=url;a.download=nom;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url)},1000);
  noter();
  return"telecharge";
 }

 /* ---------- restauration ---------- */
 /* étape 1 : l'utilisateur choisit un fichier. Rien n'est modifié. */
 async function choisirFichier(){
  try{
   var r=await window.showOpenFilePicker({types:OPTIONS_FICHIER.types,multiple:false});
   var fichier=r[0],contenu=await(await fichier.getFile()).text(),v=verifier(contenu);
   v.handle=fichier;v.nom=fichier.name;return v;
  }catch(e){
   if(e&&e.name==="AbortError")return{annule:true};
   return{ok:false,erreur:"Je n’ai pas réussi à ouvrir ce fichier. Réessaie ou choisis-en un autre."};
  }
 }
 /* même chose pour les navigateurs sans accès aux fichiers (sélecteur classique) */
 async function lireFichierChoisi(fichier){
  try{var v=verifier(await fichier.text());v.handle=null;v.nom=fichier.name;return v}
  catch(e){return{ok:false,erreur:"Je n’ai pas réussi à lire ce fichier. Réessaie ou choisis-en un autre."}}
 }
 /* étape 2 : l'utilisateur confirme. Les données sont remplacées. */
 async function confirmerRestauration(choix,opts){
  var lienChoisi=null;
  if(opts&&opts.continuerDansCeFichier&&choix.handle){
   try{
    /* doit venir directement du clic de l'utilisateur : on le fait en premier */
    var p=await choix.handle.requestPermission({mode:"readwrite"});
    if(p==="granted")lienChoisi=choix.handle;
   }catch(e){/* on restaure quand même, sans lien automatique */}
  }
  appliquer(choix.sauvegarde);
  if(lienChoisi){await memoriserLien(lienChoisi);verifie=true;maj({statut:"ok",conflit:null})}
 }

 /* ---------- rappel de sauvegarde manuelle ---------- */
 /* nombre de choses faites (activités validées, pages écrites) depuis la dernière copie */
 function elementsSansSauvegarde(S){
  var dates=[etat.derniere,etat.dernierExport].filter(Boolean).map(function(x){return Date.parse(x)||0}),dernier=dates.length?Math.max.apply(null,dates):0;
  var n=0;
  [S.tl,S.gr,S.sl].concat(Object.keys(S.jr||{}).map(function(k){return S.jr[k]})).forEach(function(l){(l||[]).forEach(function(x){if(x&&x.t>dernier)n++})});
  return n;
 }
 function rappelMasque(){return lireLocal(CLE_META).rappelMasqueLe===new Date().toDateString()}
 function masquerRappel(){ecrireLocal(CLE_META,{rappelMasqueLe:new Date().toDateString()})}

 return{charger:charger,sauvegarder:sauvegarder,etat:function(){return etat},abonner:abonner,initialiser:initialiser,
  activerAuto:activerAuto,reconnecter:reconnecter,desactiverAuto:desactiverAuto,sauvegarderMaintenant:sauvegarderMaintenant,resoudreConflit:resoudreConflit,
  exporter:exporter,choisirFichier:choisirFichier,lireFichierChoisi:lireFichierChoisi,confirmerRestauration:confirmerRestauration,
  existeCopieAvantImport:existeCopieAvantImport,annulerDernierImport:annulerDernierImport,demanderPersistant:demanderPersistant,
  formaterDateHeure:formaterDateHeure,formaterCourt:formaterCourt,elementsSansSauvegarde:elementsSansSauvegarde,rappelMasque:rappelMasque,masquerRappel:masquerRappel,
  verifier:verifier,construire:construire};
})();

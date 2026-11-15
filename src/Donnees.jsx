import { useState } from "react";
import { BK } from "./storage.js";
import { S } from "./store.js";
import { plur, Tick } from "./ui.jsx";

const TXT_STATUT = { inactive: "Pas encore activée", ok: "Active ✔", reconnecter: "En pause : à reconnecter", introuvable: "Fichier introuvable", erreur: "Problème à la dernière sauvegarde", conflit: "À vérifier : le fichier a plus d’historique (voir le bandeau en haut)" };
const TXT_PERSIST = { inconnu: "Pas encore demandée", accorde: "Activée ✔", non: "Pas accordée par le navigateur", indisponible: "Pas disponible sur ce navigateur" };
const Btn = ({ onClick, children, cls = "reset sm" }) => <button type="button" className={cls} onClick={onClick}>{children}</button>;
const left = { justifyContent: "flex-start" };
const REST0 = { open: false, choix: null, erreur: "", continuer: true };

/* ---------- repère « sauvegarde active » + bandeaux d'alerte ---------- */
export function Indicateur({ onClick }) {
  const s = BK.etat();
  if (s.statut === "inactive") return null;
  const pb = s.statut !== "ok";
  return (
    <button type="button" className={"indic" + (pb ? " alerte" : "")} onClick={onClick}>
      {pb ? "⚠ Sauvegarde à vérifier" : s.derniere ? "✔ Sauvegardé " + BK.formaterCourt(s.derniere) : "✔ Sauvegarde active"}
    </button>
  );
}

export function Bandeau() {
  const [bmsg, setBmsg] = useState("");
  const [, setT] = useState(0);
  const s = BK.etat();
  const zone = (t, cls, b) => (
    <div className={"bandeau " + cls} role={cls === "info" ? "status" : "alert"}>
      <p>{t}</p>{bmsg && <p className="banner">{bmsg}</p>}
      <div className="tools" style={{ ...left, margin: 0 }}>{b}</div>
    </div>
  );
  const nom = s.nom || "";
  const exp = <Btn onClick={() => BK.exporter()}>Exporter mes données</Btn>;
  const choisir = <Btn onClick={() => { setBmsg(""); BK.activerAuto(); }}>Choisir un nouvel emplacement</Btn>;
  let n;
  if (s.stockage === "erreur") return zone("Be Kind n’arrive pas à enregistrer sur cet appareil (stockage plein ou bloqué, navigation privée ?). Fais un export pour ne rien perdre.", "alerte", exp);
  if (s.statut === "reconnecter") return zone(`Ta sauvegarde automatique est en pause : le navigateur veut que tu reconfirmes l’accès au fichier « ${nom} ».`, "alerte",
    <Btn onClick={() => { setBmsg(""); BK.reconnecter().then((r) => setBmsg(!r.ok && r.raison === "refuse" ? "L’accès a été refusé. Appuie à nouveau sur « Reconnecter » et choisis « Autoriser »." : "")); }}>Reconnecter</Btn>);
  if (s.statut === "introuvable") return zone(`Le fichier de sauvegarde « ${nom} » est introuvable. Il a peut-être été déplacé, renommé ou supprimé.`, "alerte", choisir);
  if (s.statut === "erreur") return zone("La dernière sauvegarde n’a pas marché. Be Kind réessaiera à ta prochaine action.", "alerte", <Btn onClick={() => BK.sauvegarderMaintenant()}>Réessayer</Btn>);
  if (s.statut === "conflit") return zone(`Le fichier « ${nom} » contient plus d’historique que cet appareil${s.conflit ? " (" + plur(s.conflit.nbValides, "activité réalisée") + ")" : ""}. Tu veux récupérer ces données ?`, "alerte",
    <>
      <Btn onClick={() => BK.resoudreConflit("restaurer").then((r) => { if (r === "recharger") window.location.reload(); })}>Restaurer depuis le fichier</Btn>
      <Btn onClick={() => { if (window.confirm("Le fichier de sauvegarde sera remplacé par les données de cet appareil. Continuer ?")) BK.resoudreConflit("ecraser"); }}>Garder cet appareil</Btn>
    </>);
  if (s.statut === "inactive" && !BK.rappelMasque() && (n = BK.elementsSansSauvegarde(S)) >= 7) return zone(`Tu as fait ${n} choses (activités, pages) depuis ta dernière sauvegarde. Fais-en une copie pour ne rien perdre.`, "info",
    <>
      <Btn onClick={() => BK.exporter()}>Sauvegarder maintenant</Btn>
      <Btn onClick={() => { BK.masquerRappel(); setT((x) => x + 1); }}>Plus tard</Btn>
    </>);
  return null;
}

/* ---------- onglet « Mes données » ---------- */
export default function Donnees() {
  const [dmsg, setDmsg] = useState("");
  const [rest, setRest] = useState(REST0);
  const [, setT] = useState(0);
  const s = BK.etat(), fd = BK.formaterDateHeure;
  const refresh = () => setT((x) => x + 1);
  const recevoir = (res) => {
    if (res.annule) return;
    setRest((r) => (res.ok ? { ...r, erreur: "", choix: res } : { ...r, choix: null, erreur: res.erreur }));
  };

  return (
    <>
      <section style={{ background: "var(--c2)" }}>
        <h2><span className="ico">💾</span><span>Mes données</span></h2>
        <p style={{ margin: 0 }}>Tes activités, ton jardin et tes pages sont enregistrés dans ce navigateur, sur cet appareil. Voici comment les protéger.</p>
        {dmsg && <p className="banner" role="status" style={{ margin: "10px 0 0" }}>{dmsg}</p>}
      </section>

      <section style={{ background: "var(--c3)" }}>
        <h2><span className="ico">🔁</span><span>Sauvegarde automatique</span></h2>
        <p style={{ margin: "0 0 6px" }}>Be Kind copie tes données dans un fichier que tu choisis et le met à jour tout seul à chaque changement.</p>
        {s.supporte ? (
          <>
            <p style={{ margin: "6px 0" }}><strong>État :</strong> {TXT_STATUT[s.statut]}</p>
            {s.nom && <p style={{ margin: "6px 0" }}>Fichier : <strong>{s.nom}</strong></p>}
            {s.derniere && <p style={{ margin: "6px 0" }}>Dernière sauvegarde : {fd(s.derniere)}</p>}
            <p className="mu" style={{ fontSize: 14, margin: "6px 0" }}>Pour ta vie privée, le navigateur ne donne que le nom du fichier, pas son emplacement. Si tu le déplaces, le renommes ou le supprimes, Be Kind te prévient.</p>
            <div className="tools" style={left}>
              {s.statut === "inactive" && <Btn cls="main sm" onClick={() => { setDmsg(""); BK.activerAuto().then((r) => { if (!r.ok && r.raison === "erreur") setDmsg("Je n’ai pas réussi à créer le fichier. Réessaie ou choisis un autre dossier."); refresh(); }); }}>Activer la sauvegarde automatique</Btn>}
              {s.statut === "reconnecter" && <Btn cls="main sm" onClick={() => BK.reconnecter().then(refresh)}>Reconnecter</Btn>}
              {["ok", "erreur", "introuvable"].includes(s.statut) && <Btn cls="main sm" onClick={() => BK.activerAuto().then(refresh)}>{s.statut === "introuvable" ? "Choisir un nouvel emplacement" : "Changer d’emplacement"}</Btn>}
              {s.statut !== "inactive" && <Btn onClick={() => { if (window.confirm("Arrêter la sauvegarde automatique ? Le fichier restera où il est, mais ne sera plus mis à jour.")) BK.desactiverAuto().then(refresh); }}>Arrêter</Btn>}
            </div>
          </>
        ) : <p>Ton navigateur ne sait pas faire ça (c’est le cas de Firefox et de Safari, par exemple). Pas grave : utilise l’export ci-dessous de temps en temps.</p>}
      </section>

      <section style={{ background: "var(--c1)" }}>
        <h2><span className="ico">🛡️</span><span>Protection contre le nettoyage</span></h2>
        <p style={{ margin: "0 0 6px" }}>Quand l’appareil manque de place, il peut supprimer les données des sites sans prévenir. On demande au navigateur de ne pas toucher à celles de Be Kind.</p>
        <p style={{ margin: "6px 0" }}><strong>État :</strong> {TXT_PERSIST[s.persistant]}</p>
        {s.persistant !== "accorde" && s.persistant !== "indisponible" && <div className="tools" style={left}><Btn cls="main sm" onClick={() => BK.demanderPersistant().then(refresh)}>Demander la protection</Btn></div>}
        <p className="mu" style={{ fontSize: 14, margin: "6px 0 2px" }}>Ça ne protège pas si tu effaces toi-même les données du navigateur : pour ça, il y a la sauvegarde automatique.</p>
      </section>

      <section style={{ background: "var(--c4)" }}>
        <h2><span className="ico">📤</span><span>Exporter mes données</span></h2>
        <p style={{ margin: "0 0 6px" }}>Tu récupères un fichier à envoyer où tu veux : Drive, mail, ordinateur… Pratique pour changer d’appareil ou garder une copie.</p>
        <div className="tools" style={left}><Btn cls="main sm" onClick={() => BK.exporter().then((r) => { setDmsg(r === "partage" ? "Fichier partagé ✔" : r === "telecharge" ? "Fichier téléchargé ✔ Regarde dans tes téléchargements." : ""); refresh(); })}>Exporter mes données</Btn></div>
        {s.dernierExport && <p className="mu" style={{ fontSize: 14, margin: "6px 0 2px" }}>Dernier export : {fd(s.dernierExport)}</p>}
      </section>

      <section style={{ background: "var(--c0)" }}>
        <h2><span className="ico">📥</span><span>Restaurer</span></h2>
        {!rest.open ? (
          <div className="tools" style={{ ...left, marginTop: 0 }}>
            <Btn cls="main sm" onClick={() => setRest({ ...REST0, open: true })}>Restaurer depuis un fichier</Btn>
            {BK.existeCopieAvantImport() && <Btn onClick={() => { if (window.confirm("Revenir aux données d’avant la dernière restauration ?")) BK.annulerDernierImport().then((ok) => { if (ok) window.location.reload(); else setDmsg("Impossible d’annuler : la copie de secours n’est pas lisible."); }); }}>Annuler la dernière restauration</Btn>}
          </div>
        ) : !rest.choix ? (
          <>
            <p style={{ margin: "0 0 6px" }}>Choisis ton fichier de sauvegarde Be Kind (il se termine par .json).</p>
            {rest.erreur && <p className="banner" role="alert" style={{ margin: "6px 0" }}>{rest.erreur}</p>}
            <div className="tools" style={left}>
              {s.supporte ? <Btn cls="main sm" onClick={() => BK.choisirFichier().then(recevoir)}>Choisir un fichier</Btn>
                : <label className="main sm" style={{ display: "inline-block", textAlign: "center" }}>Choisir un fichier
                  <input type="file" id="dfile" accept=".json,application/json" style={{ display: "none" }}
                    onChange={(e) => { const ff = e.target.files && e.target.files[0]; e.target.value = ""; if (ff) BK.lireFichierChoisi(ff).then(recevoir); }} /></label>}
              <Btn onClick={() => setRest(REST0)}>Annuler</Btn>
            </div>
          </>
        ) : (() => {
          const r = rest.choix.resume;
          return (
            <>
              <p style={{ margin: "0 0 4px" }}><strong>{rest.choix.nom}</strong></p>
              <ul style={{ margin: "4px 0 8px", paddingLeft: 20 }}>
                {r.exporteLe && <li>Enregistré le {fd(r.exporteLe)}</li>}
                <li>{plur(r.nbActivites, "activité")}</li>
                <li>{plur(r.nbValides, "activité réalisée")}, {plur(r.nbFleurs, "fleur")} dans le jardin</li>
                <li>{plur(r.nbPages, "page")} de journal</li>
              </ul>
              <p className="banner" style={{ margin: "6px 0" }}>⚠ Ça remplace les données de cet appareil. Tu pourras annuler juste après, ici même.</p>
              {rest.choix.handle && (
                <label><input type="checkbox" checked={rest.continuer} onChange={(e) => setRest({ ...rest, continuer: e.target.checked })} />
                  <span className="cb"><Tick /></span><span className="sgt">Continuer à sauvegarder automatiquement dans ce fichier</span></label>
              )}
              <div className="tools" style={left}>
                <Btn cls="main sm" onClick={() => BK.confirmerRestauration(rest.choix, { continuerDansCeFichier: rest.continuer && !!rest.choix.handle }).then(() => window.location.reload()).catch(() => setRest({ ...rest, choix: null, erreur: "La restauration n’a pas marché. Tes données actuelles n’ont pas été touchées." }))}>Remplacer mes données</Btn>
                <Btn onClick={() => setRest({ ...rest, choix: null, erreur: "" })}>Choisir un autre fichier</Btn>
              </div>
            </>
          );
        })()}
      </section>
    </>
  );
}

import { useState } from "react";
import { FLOREAL_URL, HABIBITS_URL } from "./data.js";

const ICONE_FLOREAL = "https://splendorous-axolotl-8382a7.netlify.app/logo.png";

function Icone({ src, repli }) {
  const [ko, setKo] = useState(false);
  return ko
    ? <span className="appico repli" aria-hidden="true">{repli}</span>
    : <img className="appico" src={src} alt="" width="52" height="52" onError={() => setKo(true)} />;
}

export default function Apropos() {
  return (
    <>
      <section style={{ background: "var(--c4)" }}>
        <h2><span className="ico">🌼</span><span>À propos</span></h2>
        <p style={{ margin: "0 0 8px" }}><strong>Be Kind : An app to hack your brain into making your body feel good.</strong></p>
        <p style={{ margin: "0 0 8px" }}>Cette appli est pensée pour s’aider soi-même et faire des actions pour se sentir mieux au quotidien. Elle a été imaginée pour soigner ses coups de cafards, mes coups de mou.</p>
        <p style={{ margin: 0 }}>Tous nos cerveaux ne sont pas câblés exactement de la même manière, alors adaptons-nous d’abord à nous-même !</p>
      </section>
      <section style={{ background: "var(--c2)" }}>
        <h2><span className="ico">🔗</span><span>Boîte à outils</span></h2>
        <ul className="apps">
          <li>
            <a href={HABIBITS_URL} target="_blank" rel="noreferrer">
              <Icone src={import.meta.env.BASE_URL + "habibits-icone.png"} repli="🎯" />
              <span><strong>Habibits</strong><br /><span className="mu">Des petits défis pour ancrer des habitudes.</span></span>
            </a>
          </li>
          <li>
            <a href={FLOREAL_URL} target="_blank" rel="noreferrer">
              <Icone src={ICONE_FLOREAL} repli="🌸" />
              <span><strong>Floreal Fitness Tracker</strong><br /><span className="mu">Suivre mes séances de sport.</span></span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

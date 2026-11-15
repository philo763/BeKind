import { useRef, useState } from "react";
import { DANCE, gardenH } from "./data.js";
import { S, commit } from "./store.js";

function Flower({ hs }) {
  const n = hs.length;
  return (
    <svg viewBox="0 0 64 92" aria-hidden="true">
      <path d="M32 52C30 66 34 80 32 92" stroke="#7FB77E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="74" rx="10" ry="4.5" fill="#9CCB9A" transform="rotate(-28 22 74)" />
      <ellipse cx="43" cy="68" rx="10" ry="4.5" fill="#9CCB9A" transform="rotate(28 43 68)" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="32" cy="17" rx="6.2" ry="13" transform={`rotate(${i * 30} 32 32)`}
          fill={`var(--s${hs[i % n]})`} stroke="rgba(90,74,92,.3)" strokeWidth="1" />
      ))}
      <circle cx="32" cy="32" r="10" fill="#FFC93C" stroke="#C98A00" strokeWidth="1.5" />
      <circle cx="28.8" cy="30" r="1.5" fill="#5A4A5C" />
      <circle cx="35.2" cy="30" r="1.5" fill="#5A4A5C" />
      <path d="M28 34.5Q32 39 36 34.5" stroke="#5A4A5C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Garden() {
  const [mode, setMode] = useState(null); // null | "pick"
  const [msg, setMsg] = useState("");
  const [selId, setSelId] = useState(null);
  const drag = useRef(null);
  const n = S.garden.length, H = gardenH(n), pick = mode === "pick";

  const down = (e, f) => {
    const el = e.currentTarget;
    drag.current = { el, f, box: el.parentNode.getBoundingClientRect(), sx: e.clientX, sy: e.clientY, ox: f.x, oy: f.y, moved: false };
    try { el.setPointerCapture(e.pointerId); } catch { /* ignoré */ }
    e.preventDefault();
  };
  const move = (e) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6 || pick) return;
      d.moved = true; d.el.classList.add("drag");
    }
    d.f.x = Math.max(5, Math.min(95, d.ox + dx / d.box.width * 100));
    d.f.y = Math.max(70, Math.min(d.box.height - 4, d.oy + dy));
    d.el.style.left = d.f.x + "%"; d.el.style.top = d.f.y + "px";
  };
  const end = (tap) => {
    const d = drag.current; if (!d) return;
    drag.current = null;
    if (d.moved) {
      d.f.x = Math.round(d.f.x * 10) / 10; d.f.y = Math.round(d.f.y);
      d.el.classList.remove("drag"); commit(); return;
    }
    if (!tap) return;
    if (pick && !d.f.dance && S.sun >= DANCE) {
      S.sun -= DANCE; d.f.dance = true; setMode(null); setMsg("Ta marguerite danse ! 💃"); setSelId(d.f.id); commit();
    } else setSelId(d.f.id);
  };

  const sel = S.garden.find((f) => f.id === selId);
  const can = S.sun >= DANCE && S.garden.some((f) => !f.dance);
  const why = S.sun < DANCE ? `Il te manque ${DANCE - S.sun} ☀️ : chaque gratitude en rapporte 1.`
    : !can ? "Toutes tes marguerites dansent déjà !" : "";

  return (
    <>
      <section style={{ background: "var(--c1)" }}>
        <h2>
          <span className="ico">🌷</span><span>Mon jardin de gratitude</span>
          <span className="sn">{n + (n > 1 ? " marguerites" : " marguerite")}</span>
          <span className="sun" aria-label={S.sun + " soleils"}>☀️ {S.sun}</span>
        </h2>
        {pick && (
          <p className="banner" role="status"><span>Touche la marguerite qui doit danser 💃</span>
            <button type="button" className="reset sm" onClick={() => setMode(null)}>Annuler</button></p>
        )}
        {!pick && msg && <p className="banner" role="status">{msg}</p>}
        <div className="garden" id="garden" style={{ height: H }}>
          <div className="sunb" aria-hidden="true" />
          {S.garden.map((f) => (
            <div key={f.id} data-f={f.id} role="img" aria-label={"Marguerite : " + f.n}
              className={"fl" + (f.dance ? " dance" : "") + (pick && !f.dance ? " pickable" : "")}
              style={{ left: f.x + "%", top: f.y + "px" }}
              onPointerDown={(e) => down(e, f)} onPointerMove={move}
              onPointerUp={() => end(true)} onPointerCancel={() => end(false)}>
              <Flower hs={f.h} />
              {f.dance && <span className="note" aria-hidden="true">♪</span>}
            </div>
          ))}
          {!n && <p className="empty0">Ton jardin attend sa première marguerite : écris une gratitude pour la voir éclore 🌱</p>}
        </div>
        <p className="cap mu">
          {sel ? (sel.e || "🌼") + " " + sel.n + " · " + new Date(sel.t).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
            : n ? "Touche une fleur pour relire ta gratitude. Fais-la glisser où tu veux." : ""}
        </p>
      </section>
      <section style={{ background: "var(--c4)" }}>
        <h2><span className="ico">🛍️</span><span>Boutique</span></h2>
        <div className="shopitem">
          <div className="si" aria-hidden="true">💃</div>
          <div className="st"><strong>Une marguerite qui danse</strong><br /><span className="mu">Tu choisis la fleur qui danse.</span></div>
          <button type="button" className="main sm" disabled={!can || pick} onClick={() => { setMode("pick"); setMsg(""); setSelId(null); }}>{DANCE} ☀️</button>
        </div>
        {why && <p className="mu" style={{ margin: "8px 4px 2px", fontSize: 14 }}>{why}</p>}
      </section>
    </>
  );
}

import { useState } from "react";
import { HN, JR, addDays, pad, sod } from "./data.js";
import { S, commit } from "./store.js";
import { cap } from "./ui.jsx";

const dotBg = (hs) => {
  const n = hs.length;
  if (n === 1) return `var(--s${hs[0]})`;
  return "conic-gradient(" + hs.map((h, i) => `var(--s${h}) ${i * 100 / n}% ${(i + 1) * 100 / n}%`).join(",") + ")";
};
const f = (d, o) => d.toLocaleDateString("fr-FR", o);

/* Activités faites qui n'ont pas déjà leur page dans le carnet (carnets, to do list, pellicule) */
export function entreesLigne() {
  const dansCarnet = new Set(S.acts.filter((a) => a.k && (a.k === "todo" || JR[a.k])).map((a) => a.n));
  return S.tl.filter((v) => !dansCarnet.has(v.n));
}

export default function Timeline() {
  const [view, setView] = useState("day");
  const [anchor, setAnchor] = useState(() => sod(new Date()));
  const AX = 70, PT = 12, day = view === "day";
  const s = day ? anchor : addDays(anchor, -6), e = addDays(anchor, 1);
  const H = day ? 768 : 700, ppm = H / (e - s);
  const title = cap(day ? f(anchor, { weekday: "long", day: "numeric", month: "long" })
    : f(s, { day: "numeric", month: "short" }) + " – " + f(anchor, { day: "numeric", month: "short" }));
  const evs = entreesLigne().filter((v) => v.t >= +s && v.t < +e).sort((a, b) => a.t - b.t);

  const ticks = [];
  if (day) {
    for (let i = 0; i < 24; i++) {
      const y = PT + i * H / 24;
      ticks.push(<div key={"t" + i} className={"tk" + (i % 3 === 0 ? " big" : "")} style={{ top: y }} />);
      if (i % 3 === 0) ticks.push(<div key={"l" + i} className="tl" style={{ top: y }}>{pad(i)}h</div>);
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const d0 = addDays(s, i), d1 = addDays(s, i + 1), y = PT + (d0 - s) * ppm;
      ticks.push(<div key={"t" + i} className="tk big" style={{ top: y }} />,
        <div key={"l" + i} className="tl b" style={{ top: y }}>{f(d0, { weekday: "short", day: "numeric" })}</div>);
      for (let q = 1; q < 4; q++) ticks.push(<div key={`q${i}${q}`} className="tk" style={{ top: y + q * (d1 - d0) * ppm / 4 }} />);
    }
  }
  let last = -1e9;
  const paths = [], dots = [], labels = [];
  evs.forEach((v) => {
    const yy = PT + (v.t - s) * ppm, lh = v.n.length > 30 ? 50 : 34, top = Math.max(yy - lh / 2, last + 4);
    last = top + lh;
    const dt = new Date(v.t);
    let tm = pad(dt.getHours()) + ":" + pad(dt.getMinutes());
    if (!day) tm = f(dt, { weekday: "short" }) + " " + tm;
    paths.push(<path key={v.id} d={`M${AX + 9} ${yy}L${AX + 30} ${top + lh / 2}`} />);
    dots.push(<div key={v.id} className="tdot" style={{ top: yy, background: dotBg(v.h) }} />);
    labels.push(
      <div key={v.id} className="ev" style={{ top, height: lh, background: `var(--h${v.h[0]})` }}>
        <span className="tm">{tm}</span><span className="en">{(v.e ? v.e + " " : "") + v.n}</span>
        <button type="button" className="x" aria-label="Retirer de la ligne du temps" onClick={() => { S.tl = S.tl.filter((k) => k.id !== v.id); commit(); }}>×</button>
      </div>);
  });
  const total = Math.max(PT * 2 + H, last + PT + 10);
  const now = Date.now();
  const step = day ? 1 : 7;

  return (
    <section style={{ background: "var(--c4)" }}>
      <div className="tlhead">
        <button type="button" className="reset sm" aria-label="Période précédente" onClick={() => setAnchor(addDays(anchor, -step))}>‹</button>
        <h2>{title}</h2>
        <button type="button" className="reset sm" aria-label="Période suivante" onClick={() => setAnchor(addDays(anchor, step))}>›</button>
      </div>
      <div className="tools" style={{ margin: "0 0 4px" }}>
        <button type="button" className={"reset sm" + (day ? " on" : "")} onClick={() => setView("day")}>Jour</button>
        <button type="button" className={"reset sm" + (day ? "" : " on")} onClick={() => setView("week")}>7 jours</button>
        <button type="button" className="reset sm" onClick={() => setAnchor(sod(new Date()))}>Aujourd’hui</button>
      </div>
      <div className="tlbox" style={{ "--ax": AX + "px", height: total }}>
        <div className="axis" />
        {ticks}
        {now >= +s && now < +e && <div className="now" style={{ top: PT + (now - s) * ppm }}><span>maintenant</span></div>}
        <svg className="con" width="400" height={total} aria-hidden="true">{paths}</svg>
        {dots}{labels}
        {!evs.length && <p className="empty">Rien d’inscrit sur cette période. Les activités que tu choisis apparaîtront ici 🌼</p>}
      </div>
      <div className="legend">{[0, 1, 2, 3].map((k) => <span key={k}><i className="dot" style={{ background: `var(--s${k})` }} />{HN[k]}</span>)}</div>
    </section>
  );
}

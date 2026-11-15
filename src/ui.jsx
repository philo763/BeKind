import { BALISES, HN, SUBS } from "./data.js";

export const Tick = () => (
  <svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
);

export const Dots = ({ hs }) => hs.map((k) => (
  <i key={k} className="dot" title={HN[k]} style={{ background: `var(--s${k})` }} />
));

export const Chip = ({ h, on, onClick }) => (
  <button type="button" className={"chip" + (on ? " on" : "")} aria-pressed={on ? "true" : "false"}
    aria-label={HN[h]} title={HN[h]} onClick={onClick} style={{ "--k": `var(--s${h})` }} />
);

/* Choix de la balise, puis de la sous-balise pour Sport / Animaux */
export function BalisePick({ g, sg, onChange, label }) {
  const subs = SUBS.filter((s) => s.cat === g);
  return (
    <>
      <select className="tagsel" aria-label={"Balise" + (label || "")} value={g}
        onChange={(e) => onChange(e.target.value, SUBS.find((s) => s.cat === e.target.value)?.k || "")}>
        {BALISES.filter((b) => b.k !== "onglet").map((b) => <option key={b.k} value={b.k}>{b.l}</option>)}
      </select>
      {subs.length > 0 && (
        <select className="tagsel" aria-label={"Sous-balise" + (label || "")} value={sg || subs[0].k} onChange={(e) => onChange(g, e.target.value)}>
          {subs.map((s) => <option key={s.k} value={s.k}>{s.e + " " + s.l}</option>)}
        </select>
      )}
    </>
  );
}

export const plur = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

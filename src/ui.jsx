import { HN, TAGS } from "./data.js";

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

export const TagOptions = () => TAGS.map((g) => (
  <option key={g.k} value={g.k}>{g.e + " " + g.l}</option>
));

export const plur = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

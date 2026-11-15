/* Thème clair / sombre : "auto" suit le réglage du téléphone ou du navigateur.
   Le choix est propre à l'appareil : il est gardé dans localStorage mais ne fait pas
   partie des sauvegardes. index.html applique déjà le thème avant l'affichage. */
const CLE = "bekind.theme";
const FONDS = { light: "#FFF8EE", dark: "#2B2431" };
const sombre = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

export function lireTheme() {
  try {
    const t = localStorage.getItem(CLE);
    return t === "light" || t === "dark" ? t : "auto";
  } catch {
    return "auto";
  }
}

/* Couleur de la barre du téléphone, accordée au thème réellement affiché */
function majBarre(t) {
  const reel = t === "auto" ? (sombre && sombre.matches ? "dark" : "light") : t;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", FONDS[reel]);
}

export function appliquerTheme(t) {
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  majBarre(t);
}

export function choisirTheme(t) {
  try {
    if (t === "auto") localStorage.removeItem(CLE);
    else localStorage.setItem(CLE, t);
  } catch { /* stockage indisponible : le choix vaut pour cette visite */ }
  appliquerTheme(t);
}

if (sombre) sombre.addEventListener("change", () => majBarre(lireTheme()));
appliquerTheme(lireTheme());

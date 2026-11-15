# BeKind

An app to hack your brain into making your body feel good.

Be Kind propose une activité qui fait du bien selon les quatre hormones du bonheur
(dopamine, ocytocine, sérotonine, endorphines). On répond « Oui, je fais ça »,
« Mouais… » ou « Pas du tout envie », et l'appli apprend ce qui marche pour toi.

## Ce que contient l'appli

- **Ma suggestion** : propose une activité (scores par activité et par hormone).
- **Mon jardin** : une marguerite par activité validée, déplaçable ; les soleils
  gagnés s'échangent dans la boutique contre une danse.
- **Base de données** : activités, scores, emojis, balises, filtres, tri A→Z et
  assistant de suggestions d'ajout.
- **Ligne du temps**, **Gratitude**, **Self love**, **To do list**.

## Structure

React 19 + Vite, comme Habibits.

| Fichier | Rôle |
|---|---|
| `index.html` | page d'entrée Vite (icônes, couleur du thème) |
| `src/main.jsx` | point d'entrée (polices Fontsource, styles) |
| `src/App.jsx` | en-tête, onglets, bandeaux |
| `src/Home.jsx`, `Garden.jsx`, `Database.jsx`, `Timeline.jsx`, `Journal.jsx`, `Todo.jsx`, `Donnees.jsx` | un fichier par onglet |
| `src/store.js` | état de l'appli (objet `S`), migrations, redessin |
| `src/storage.js` | stockage, sauvegarde automatique, export et restauration (objet `BK`) |
| `src/data.js` | hormones, activités de départ, emojis, balises, suggestions |
| `src/style.css` | styles et thèmes clair / sombre |
| `vite.config.js` | build + PWA (manifest, service worker) |
| `public/` | icônes de l'appli (`npm run icons` les régénère depuis `favicon.svg`) |

## Lancer en local

```powershell
npm install
npm run dev
```

`npm run build` produit le dossier `dist/`, `npm run preview` le sert, `npm run lint`
lance Oxlint.

## PWA

Be Kind est une PWA : `vite-plugin-pwa` génère le manifeste et un service worker
(mise à jour automatique). Une fois la page ouverte sur le téléphone, on peut
« Ajouter à l'écran d'accueil » : l'appli s'ouvre en plein écran et fonctionne
sans connexion.

## Publier avec GitHub Pages

À chaque push sur `main`, `.github/workflows/deploy.yml` installe les dépendances
(`npm ci`), construit le site avec `VITE_BASE=/BeKind/` et le déploie.

À faire une seule fois sur GitHub : **Settings → Pages → Build and deployment →
Source : GitHub Actions**. Le site apparaît à `https://<pseudo>.github.io/BeKind/`.
Le workflow a besoin d'un `package-lock.json` (créé par `npm install`, à committer).

## Stockage et sauvegardes

Même principe que l'appli Habibits : pas de compte, pas de serveur, les données
restent **dans le navigateur** (`localStorage`). L'onglet **Mes données** regroupe :

- **Sauvegarde automatique** : copie des données dans un fichier choisi par
  l'utilisateur (API d'accès aux fichiers, lien conservé dans IndexedDB), mise à
  jour à chaque changement. Si le fichier contient plus d'historique que
  l'appareil, Be Kind propose de le restaurer plutôt que de l'écraser.
- **Protection contre le nettoyage** : demande de stockage persistant au navigateur.
- **Export** : fichier JSON partagé (menu de partage) ou téléchargé.
- **Restauration** : choix d'un fichier, résumé affiché, confirmation, puis
  possibilité d'**annuler** la dernière restauration (copie de secours gardée).
- Bandeaux d'alerte en haut de l'écran (fichier à reconnecter, introuvable,
  stockage refusé) et rappel de faire une copie après 7 choses sans sauvegarde.

Chaque navigateur et chaque appareil a son propre stockage : pour changer
d'appareil, exporter puis restaurer un fichier. Le stockage persistant ne protège
pas contre l'effacement manuel des données du navigateur ; la sauvegarde
automatique n'existe que dans les navigateurs compatibles (Chrome, Edge, Samsung
Internet), pas Firefox ni Safari : il faut alors exporter de temps en temps.

### Format des données

Clés `localStorage` : `bekind.activites`, `bekind.hormones`, `bekind.jardin`
(`{ garden, sun }`), `bekind.timeline`, `bekind.todo`, `bekind.gratitude`,
`bekind.selflove`, `bekind.profil` et `bekind.compteur` (prochain identifiant).
L'ancienne clé unique `bekind-v1` est reprise au premier lancement (sans être effacée).

Le fichier de sauvegarde JSON contient ces données dans `donnees`, avec
`{ app: "bekind", version: 1, exporteLe }`. Toute modification de la structure
doit prévoir une migration et un changement de `VERSION` dans `src/storage.js`.

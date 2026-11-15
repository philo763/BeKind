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

| Fichier | Rôle |
|---|---|
| `index.html` | structure de la page et barre d'onglets |
| `style.css` | styles et thèmes clair / sombre |
| `donnees.js` | stockage, sauvegarde automatique, export et restauration (objet global `BK`) |
| `app.js` | toute la logique de l'appli |

Aucune installation ni dépendance : c'est un site statique (seules les polices
Google Fonts sont chargées depuis internet).

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou, depuis PowerShell dans le dossier :

```powershell
py -m http.server 8000
```

puis aller sur http://localhost:8000.

## Publier avec GitHub Pages

La publication est automatique à chaque push sur `main`, grâce au workflow
`.github/workflows/deploy.yml` (pas de build : il copie `index.html`, `style.css`,
`app.js` et `donnees.js`, puis les déploie).

À faire une seule fois sur GitHub : **Settings → Pages → Build and deployment →
Source : GitHub Actions**. Le site apparaît ensuite à l'adresse
`https://<pseudo>.github.io/BeKind/` ; l'avancement se suit dans l'onglet **Actions**,
et on peut aussi relancer le déploiement à la main (« Run workflow »).

Si tu ajoutes un nouveau fichier à l'appli (une image, un second script…), pense à
l'ajouter à la ligne `cp` du workflow, sinon il ne sera pas publié.

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
doit prévoir une migration et un changement de `VERSION` dans `donnees.js`.

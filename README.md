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

1. Sur GitHub : **Settings → Pages**.
2. Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Enregistrer : le site apparaît à l'adresse `https://<pseudo>.github.io/BeKind/`.

## Tes données

Tout est sauvegardé dans le navigateur de l'appareil utilisé (`localStorage`) :
rien n'est envoyé nulle part. Conséquences : les données ne se synchronisent pas
entre ordinateur et téléphone, et elles sont séparées de celles de la version
publiée dans Claude. Une synchronisation (base de données en ligne) pourra être
ajoutée plus tard.

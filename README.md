# FICH Team — Site Web

## Structure des fichiers

```
fich-team/
├── index.html                  ← SPA principale (toutes les pages)
├── 404.html                    ← Page 404 serveur (Netlify)
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── script.js
    ├── data/
    │   ├── channels.json       ← ✏️ Partenaires (modifiable)
    │   └── projects.json       ← ✏️ Projets images + vidéos (modifiable)
    ├── img/
    │   ├── logo.png
    │   ├── leratsolitaire.png
    │   ├── lebuilderoff.png
    │   └── king_capybara_officiel.png
    └── favicon/
        └── favicon.ico, ...
```

---

## 📝 Modifier les partenaires — `channels.json`

```json
[
  {
    "name": "Nom de la chaîne",
    "description": "Description courte.",
    "url": "https://www.youtube.com/@nomchaîne",
    "avatar": "assets/img/nom-image.png"
  }
]
```

→ Ajoute autant d'objets que tu veux.
→ Place les avatars dans `assets/img/`.

---

## 📝 Modifier les projets — `projects.json`

```json
{
  "images": [
    {
      "src": "assets/img/mon-image.png",
      "title": "Titre affiché",
      "description": "Description dans la lightbox."
    }
  ],
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Titre de la vidéo",
      "creator": "Nom du créateur",
      "thumbnail": ""
    }
  ]
}
```

→ **`id`** = l'ID YouTube (la partie après `?v=` dans l'URL).
→ **`thumbnail`** = laisse vide (`""`) pour utiliser la miniature YouTube automatique,
  ou mets un chemin vers une image custom (`"assets/img/thumb.png"`).
→ Place tes images dans `assets/img/`.

---

## Navigation

| URL | Page |
|---|---|
| `/?page=home` | Accueil |
| `/?page=partners` | Partenaires |
| `/?page=projects` | Projets |
| `/?page=join` | Rejoindre |
| `/?page=trucbidon` | 404 (dans la SPA) |
| `/n-importe-quoi` | 404 (page Netlify) |

---

## Déploiement Netlify

Aucune config spéciale. Le fichier `404.html` à la racine est détecté automatiquement par Netlify pour les URLs inconnues.

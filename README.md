# WAIRYU

Reprise à zéro — décision fondateur du 2026-10-05.

- Historique complet v1 : branche `archive/v1-2026-10-05` (état final `c3f9d2c20e68…`) + bundles locaux hors dépôt
- Identité visuelle v2 : logo fondateur + palette **crème #F5F1E6 · bleu nuit #172C3D · turquoise #45C0C6 · corail #FA6249**

## Nouvelle application (v2)

Socle construit à neuf — PWA React 18 + Vite + TypeScript strict :

```
apps/web/
├── index.html                 # meta, favicon, theme-color #172C3D
├── public/
│   ├── icons/                 # icônes générées depuis le logo fondateur
│   │   ├── favicon-16/32/48   # motif « bulles » seul
│   │   ├── icon-192/512       # logo complet (PWA)
│   │   ├── icon-maskable-512  # zone safe Android
│   │   └── apple-touch-icon   # 180
│   ├── fonts/nunito-latin-var.v1.woff2   # auto-hébergée (héritage v1)
│   └── manifest.webmanifest   # fond crème, thème bleu nuit
└── src/
    ├── styles.css             # design system — tokens = palette validée
    ├── App.tsx                # navigation Welcome → TabBar (3 onglets)
    ├── components/TabBar.tsx  # barre sticky bottom + safe-area iOS
    └── screens/               # Welcome · Voyage · Mondes · Quête · Récolte · Portrait · Rencontres · Auth · Masque
```

- Espaces dating (#/decouvrir, #/messages, #/profil) : page d'attente « Masque » (« Cet espace n'est pas encore ouvert ») — ouverture progressive par étages, jamais de cul-de-sac. (FE-006 : les anciens écrans de démonstration Discover/Messages/Profile, jamais rendus, ont été supprimés.)
- Déploiement : cible Cloudflare (à documenter dans une prochaine vague).
- Éthique de marque conservée : photos consenties · matching explicable · la rencontre n'est jamais payante.

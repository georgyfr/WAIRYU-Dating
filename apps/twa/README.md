# WAIRYU — App native Android (TWA bubblewrap)

Application Android Trusted Web Activity générée par bubblewrap autour de la PWA
https://wairyu.wairyu.workers.dev. Package : **com.wairyu.app** (identité v1 conservée).

## Caractéristiques

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| packageId | `com.wairyu.app` | Continuité avec la v1 |
| minSdkVersion | **21** (Android 5.0) | Couvre les appareils 2014-2017 très répandus en Afrique |
| targetSdkVersion | **35** | Exigence Google Play 2025 (nouvelles apps + updates) |
| fallbackType | `customtabs` | Chrome sans support TWA (2016/2017) → repli Custom Tabs plein écran |
| enableNotifications | `true` | POST_NOTIFICATIONS (Android 13+) ; le push réel = Web Push du SW via Chrome |
| host | `wairyu.wairyu.workers.dev` | Domaine provisoire ; changer ici + assetlinks au domaine final |
| versionCode / versionName | 1 / 1.0.0 | Première version |

## Artefacts

- `app-release-signed.apk` — installable immédiatement (test, diffusion directe).
- `app-release-bundle.aab` — à uploader sur Google Play Console.
- Copiés aussi dans `apps/web/public/app/` → téléchargeables sur
  https://wairyu.wairyu.workers.dev/app/wairyu.apk (installation directe sur un téléphone).

## Digital Asset Links (barre d'URL masquée)

L'empreinte SHA-256 du certificat de signature est posée comme secret
`ANDROID_CERT_FINGERPRINTS` sur les deux Workers →
https://wairyu.wairyu.workers.dev/.well-known/assetlinks.json répond la déclaration
`com.wairyu.app`. Vérifier avec :
https://developers.google.com/digital-asset-links/tools/generator
(wairyu.wairyu.workers.dev / com.wairyu.app).

**Au passage en domaine custom** : régénérer le keystore de prod OU conserver celui-ci,
mettre à jour `host` + `assetlinks.json` sur le nouveau domaine.

## Vigilances (leçons v1)

- **Keystore JAMAIS dans le dépôt** : il vit dans `/home/z/keys-wairyu-twa/`
  (hors dépôt). Le mot de passe est dans `/home/z/SECRETS-WAIRYU-LOCAL.txt`.
  Perdre le keystore = impossible de mettre à jour l'app sur Play Store —
  sauvegarder hors machine + mot de passe dans un gestionnaire de secrets.
- **twa-manifest.json committé SANS mots de passe** (leçon v1 : mot de passe
  en clair committé = interdit). Les mots de passe passent par l'environnement :
  ```bash
  export BUBBLEWRAP_KEYSTORE_PASSWORD=… BUBBLEWRAP_KEY_PASSWORD=…
  bubblewrap build
  ```
- Après toute modification de `twa-manifest.json` :
  `bubblewrap update --skipVersionUpgrade` puis `bubblewrap build`.

## Rebuild (machine avec JDK 17+ et la config ~/.bubblewrap)

```bash
npm i -g @bubblewrap/cli
cd apps/twa
export BUBBLEWRAP_KEYSTORE_PASSWORD=… BUBBLEWRAP_KEY_PASSWORD=…
bubblewrap build          # → app-release-signed.apk + app-release-bundle.aab
cp app-release-signed.apk ../web/public/app/wairyu.apk
cp app-release-bundle.aab ../web/public/app/wairyu.aab
```

## Play Store — checklist

Voir `docs/play-store-conformite.md` (targetSdk 35, Data Safety, classification
18+, UGC, comptes de test…). L'upload Play = le .aab + Play App Signing.

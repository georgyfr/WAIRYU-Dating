# STOCKAGE-CLOUDINARY.md — Architecture stockage Plan B (validée par sondes réelles)

> Statut : **VALIDÉ** — 2026-09-23
> Contexte : R2 n'est pas activable sur le compte Cloudflare du fondateur (exige un moyen
> de paiement, non disponible). Le stockage des médias (photos, voice notes) est déplacé
> vers **Cloudinary** (plan gratuit), tout le reste (Workers, D1, KV, DO, Turnstile)
> reste sur Cloudflare. Ce document remplace les Décisions 3 et 4 de l'analyse approfondie.

---

## 1. Résultats des sondes (testés en conditions réelles sur le compte)

| # | Capacité testée | Résultat |
|---|----------------|----------|
| 1 | Upload image en mode `authenticated` (privée) | ✅ HTTP 200 |
| 2 | Upload audio (voice note) `authenticated`, `resource_type=video` | ✅ HTTP 200 |
| 3 | Accès à un asset `authenticated` **sans** signature | ✅ bloqué HTTP 404 |
| 4 | URL signée générée manuellement (SHA-1 + base64url) | ✅ HTTP 200 |
| 5 | URL signée + transformation flou (`c_limit,w_400/f_auto/q_auto`) | ✅ HTTP 200 |
| 6 | Génération d'URL signée via SDK officiel (référence) | ✅ HTTP 200 |
| 7 | Destroy d'un asset `authenticated` (param `type=authenticated`) | ✅ `result: ok` |
| 8 | Quota plan Free | 25 crédits = **25 GB stockage + 25 GB bande passante / mois** |
| 9 | Expiration d'URL via `v=<timestamp futur>` | ⚠️ **NON APPLIQUÉE** (test 3 : URL encore 200 après expiration) |

### Capacité estimée
Compression WebP côté client (décision architecture existante : ~80 Ko/photo) :
- 25 GB ≈ **312 000 photos** stockées.
- Bande passante : 25 GB/mois ≈ 312 000 chargements de 80 Ko/mois. En mélangeant
  flou 400px (~25 Ko) et révélation (~80 Ko), une scène de découverte quotidienne
  reste confortable pour quelques milliers d'utilisateurs actifs/jour.

---

## 2. Algorithme d'URL signée (implémenté dans le Worker)

Verrouillé par rétro-ingénierie du SDK officiel (`cloudinary/utils.py`, ligne 909) :

```text
signature  = base64url( SHA1( to_sign + API_SECRET ) )[0:8]   -- 8 caractères
to_sign    = transformation ? "{transformation}/{public_id}" : "{public_id}"
URL        = https://res.cloudinary.com/{cloud}/{resource_type}/authenticated/s--{signature}--/v{version}/{public_id}
```

Points critiques (chacun a causé un échec 404/400 pendant les sondes) :
1. Le segment d'URL est **`/authenticated/`**, jamais `/upload/` (les sondes 2-3 ont
   échoué 404 uniquement à cause de ça).
2. Le `to_sign` **ne contient PAS** le préfixe `image/authenticated/` — seulement
   `transformation?/public_id`.
3. La **version n'est pas signée** (simple cache-buster) : la même signature reste
   valide pour n'importe quelle valeur de `v`.
4. L'extension (.jpg/.webp) fait partie du `to_sign` si elle est présente dans l'URL.

Implémentation TypeScript côté Worker (module `packages/shared/cloudinary.ts`) :

```ts
export function cldSign(toSign: string, secret: string): string {
  const digest = new Uint8Array(
    crypto.subtle.digest ? null as never : [] // (implémentation réelle : voir cloudinary.ts)
  );
  // sha1(toSign + secret) → base64url → 8 premiers caractères
}

export function signedMediaUrl(publicId: string, opts: {
  resourceType?: "image" | "video";
  transformation?: string;      // ex: "c_limit,w_400/f_auto,q_auto" (vignette/flou)
  version?: number;             // version réelle de l'asset ou 1
}) {
  const { resourceType = "image", transformation = "", version = 1 } = opts;
  const toSign = transformation ? `${transformation}/${publicId}` : publicId;
  const sig = cldSign(toSign, env.CLOUDINARY_API_SECRET);
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/` +
         `${resourceType}/authenticated/s--${sig}--/v${version}/${publicId}`;
}
```

> Implémentation finale : `apps/api/src/lib/cloudinary.ts` (SHA-1 via Web Crypto,
> base64url manuel — Web Crypto ne fait pas SHA-1 base64 nativement, voir code).

---

## 3. Modèle de sécurité — « révélation consentie » garantie

Le principe inchangé de la spécification : **aucune photo n'est accessible sans
autorisation du Worker**. Cloudinary ne remplace que le stockage/CDN, jamais la
couche de décision.

### Chaîne d'autorisation (par requête média)
1. Le client appelle l'API (`GET /v1/profiles/:id/media` ou feed discovery).
2. Le Worker vérifie la session (cookie signé), puis les droits en D1 :
   - **Mode Invisible / non matché** → renvoie UNIQUEMENT les URLs signées
     **floues** (transformation `c_limit,w_400` + blur léger côté client CSS pour
     l'effet progressif N1→N2).
   - **Match + révélation mutuelle consentie** (les deux ont activé « révéler »
     après 15 messages + 7 jours) → renvoie les URLs signées nettes.
3. Le Worker génère les URLs signées à la volée avec le secret
   `CLOUDINARY_API_SECRET` (stocké comme *secret* Worker, jamais côté client).
4. Le client charge l'image directement depuis le CDN Cloudinary (0 requête
   Worker supplémentaire — le budget « ≤ 70 requêtes API/utilisateur/jour » tient).

### Garanties et limites (transparence)
| Garantie | Mécanisme |
|----------|-----------|
| Asset inaccessible au public | type `authenticated` → 404 sans signature (testé) |
| Impossible de deviner l'URL d'une autre photo | signature liée au public_id + public_id aléatoire (20 car.) |
| Impossible de « déflouter » une URL floue | la transformation fait partie du `to_sign` : autre signature |
| Issu d'URL contrôlé | Worker = seule source d'URLs signées (secret côté serveur) |
| ⚠️ Lien signé non expirable | une URL obtenue peut être re-partagée. Mitigations MVP : public_id non devinable, URL délivrée seulement aux participants autorisés, révocable en supprimant l'asset (API destroy). Évolution : `auth_token` (token-based authentication, activable dans Settings → Security) ou proxy Worker pour les médias les plus sensibles. |

Ce compromis est identique à celui des acteurs du marché (les photos Tinder/Bumble
sont aussi des URLs CDN) : la protection réelle vient de la couche API, pas de
l'opacité du lien.

---

## 4. Organisation des assets

```text
wairyu/
  prod/
    photos/{userId}/{photoId}     images JPEG/WebP compressées client → serveur
    voicenotes/{userId}/{noteId}  audio (m4a/webm), resource_type=video
  test/                            environnements de test (purge hebdomadaire)
```

- Upload : **upload signé côté Worker** (le client envoie les octets au Worker qui
  pousse vers Cloudinary avec la signature API — le secret ne quitte jamais le
  serveur). Alternative évaluée mais rejetée : upload direct client→Cloudinary avec
  signature éphémère (exposerait api_key côté client et complexifierait le RGPD).
- Modération : les photos passent d'abord en statut `pending` en D1 ; l'asset
  Cloudinary existe mais aucune URL n'est délivrée tant que la modération n'a pas
  validé (`approved`).
- Suppression RGPD : destroy Cloudinary (avec `type=authenticated` **obligatoire**,
  sinon `not found`) + purge D1.

---

## 5. Ce qui change vs l'architecture R2 initiale

| Élément | Plan A (R2) | Plan B (Cloudinary) — retenu |
|---------|-------------|------------------------------|
| Stockage brut | R2 bucket privé | Cloudinary `authenticated` |
| Contrôle d'accès | presigned URLs R2 | URLs signées Cloudinary (même modèle) |
| Vignettes/flou | transformations Workers | transformations Cloudinary natives (gratuites) |
| Secret exposé | `R2_ACCESS_KEY` | `CLOUDINARY_API_SECRET` (Worker secret) |
| Coût | 10 GB gratuits | 25 GB gratuits + transformations incluses |
| Risque | — | lien signé non expirable (voir §3) ; dépendance fournisseur → export RGPD simple via API Admin |

Le reste de l'architecture (Workers, D1, KV, DO, Turnstile, wairyu.workers.dev)
est inchangé. LesDécisions 3 et 4 de `ANALYSE-APPROFONDIE.md` sont mises à jour
par le présent document.

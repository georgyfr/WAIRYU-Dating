#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# PUSH-CANON — publication vérifiée du dépôt canon (Constitution [11])
#
# Trois verrous :
#   ① CI verte AVANT push — aucun dépôt rouge ne part
#   ② jeton lu dans GITHUB_TOKEN (env) SEULEMENT — helper d'identifiants
#      éphémère en mémoire : jamais sur disque, jamais dans .git/config,
#      jamais en argument de commande
#   ③ vérification RÉELLE après push : ls-remote comparé au HEAD local —
#      « poussé » = « la remote pointe sur notre commit »
#
# Usage :  GITHUB_TOKEN=... ./scripts/push-canon.sh [branche]
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail
BRANCHE="${1:-main}"
HELPER='!f() { echo "username=x-access-token"; echo "password=$GITHUB_TOKEN"; }; f'

# ── Verrou ① : CI verte avant push ──
echo "── Verrou ① : CI du contrat d'inventaire ──"
python3 ci/test_contrat_inventaire.py

# ── Verrou ② : jeton en env SEULEMENT ──
echo "── Verrou ② : jeton ──"
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "REFUS : GITHUB_TOKEN absent de l'environnement (Constitution [11])."
  echo "Le concepteur fournit un fine-grained PAT périmètre minimal (Contents: R/W, durée courte),"
  echo "l'exécuteur le passe en variable d'environnement éphémère — jamais dans un fichier."
  echo "Révocation obligatoire en fin de session."
  exit 1
fi

LOCAL=$(git rev-parse HEAD)
echo "── Push de $BRANCHE (${LOCAL:0:12}) ──"
git -c credential.helper="$HELPER" push origin "$BRANCHE"

# ── Verrou ③ : la remote pointe sur notre commit ──
echo "── Verrou ③ : vérification réelle ──"
REMOTE=$(git -c credential.helper="$HELPER" ls-remote origin "refs/heads/$BRANCHE" | cut -f1)
if [ "$REMOTE" = "$LOCAL" ]; then
  echo "✅ POUSSÉ ET VÉRIFIÉ : origin/$BRANCHE pointe sur ${REMOTE:0:12}."
  echo "   Rappel Constitution [11] : révoquer le jeton en fin de session."
  exit 0
else
  echo "🔴 ÉCHEC DE VÉRIFICATION : origin/$BRANCHE = ${REMOTE:-absent} ≠ local ${LOCAL:0:12}."
  exit 1
fi

/**
 * Task 65 — ancre PostCSS du dépôt wairyu : la recherche de configuration
 * remonte les dossiers parents et tombait sur le postcss.config.mjs du
 * scaffold voisin (@tailwindcss/postcss, plugin absent d'ici) → build cassé.
 * wairyu n'utilise AUCUN transform PostCSS : config vide = comportement
 * historique (CSS servi tel quel). Aucune règle existante n'est modifiée.
 */
module.exports = { plugins: [] };

// apps/web — config PostCSS minimale : empêche la remontée au postcss.config.mjs
// du projet hôte (plugin Next.js invalide ici) quand le worktree vit sous /home/z/my-project/.
// Le front est en CSS vanilla — aucun plugin PostCSS n'est nécessaire.
export default { plugins: [] }

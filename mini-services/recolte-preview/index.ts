// Sert apps/web/dist en statique (SPA fallback #/) — E2E local de la Récolte.
const DIST = new URL("../../apps/web/dist/", import.meta.url).pathname;
const index = await Bun.file(DIST + "index.html").text();
const seed = await Bun.file(DIST + "seed.html").text();
Bun.serve({
  port: 4173,
  async fetch(req) {
    const url = new URL(req.url);
    const chemin = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, "");
    if (chemin === "seed.html") return new Response(seed, { headers: { "content-type": "text/html; charset=utf-8" } });
    const f = Bun.file(DIST + chemin);
    if (chemin && (await f.exists())) {
      const types: Record<string, string> = {
        js: "text/javascript", css: "text/css", html: "text/html",
        svg: "image/svg+xml", png: "image/png", webmanifest: "application/manifest+json",
      };
      const ext = chemin.split(".").pop() ?? "";
      return new Response(f, { headers: { "content-type": types[ext] ?? "application/octet-stream" } });
    }
    return new Response(index, { headers: { "content-type": "text/html; charset=utf-8" } });
  },
});
console.log("recolte-preview :4173 — sert", DIST);

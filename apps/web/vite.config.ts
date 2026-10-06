import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Compatibilité appareils 2016/2017 (Chrome 50-60, mission anciens
    // téléphones d'Afrique) : transpilation ES2015 + pas d'API récentes.
    target: 'es2015',
  },
});

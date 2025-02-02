import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  base: '/Reservationstatus/',  // ✅ Matches repo name for GitHub Pages
  build: {
    outDir: 'dist',  // ✅ Ensure Vite builds to `dist`
  },
});

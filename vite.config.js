import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// Determine if we are in production (GitHub Pages) or local development
const isGitHubPages = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  base: isGitHubPages ? '/Reservationstatus/' : './',  // ✅ Relative base path locally
  build: {
    outDir: 'dist',  // ✅ Ensures build files go to `dist`
  },
});

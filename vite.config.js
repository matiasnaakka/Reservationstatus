import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // SVGR options: customize here if needed
        icon: true,
      },
    }),
  ],
  base: '/Reservationstatus/', // Set base path if deploying to GitHub Pages
});

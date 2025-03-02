import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

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
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    ViteImageOptimizer({
      // Image optimization options
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
        lossless: false,
      },
      avif: {
        quality: 5, // Lower quality for smaller file size
        lossless: false,
      },
      // Cache optimized images for better rebuild performance
      cache: true,
      // Enable logging for debugging
      logStats: true,
      // Specify a valid cache directory
      cacheLocation: path.resolve(__dirname, 'node_modules/.cache/vite-plugin-image-optimizer'), // Use path.resolve
    }),
  ],
  base: isGitHubPages ? '/Reservationstatus/' : './',
  build: {
    outDir: 'dist',
    // Configure asset handling for images
    assetsInlineLimit: 4096, // 4kb - files smaller than this will be inlined as base64
    rollupOptions: {
      output: {
        // Use chunking for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext)) {
              return `assets/images/[name]-[hash].[ext]`;
            }
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
  },
});
/// <reference types="vitest" />
import path from 'node:path';

import react from '@vitejs/plugin-react';
import * as sass from 'sass';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  resolve: {
    alias: {
      '~styles': path.join(__dirname, './src/styles'),
      '@laser-ui/themes': path.join(__dirname, '../../libs/themes'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        logger: sass.Logger.silent,
      },
    },
  },

  cacheDir: '../../node_modules/.vite/site',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    svgr(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});

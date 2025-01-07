const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const path = require('path');

module.exports = defineConfig({
  base: './',
  resolve: {
    alias: {
      '#minpath': path.resolve(__dirname, 'node_modules/vfile/lib/minpath.js'),
      '#minproc': path.resolve(__dirname, 'node_modules/vfile/lib/minproc.js'),
      '#minurl': path.resolve(__dirname, 'src/utils/minurl.mock.js'), // Resolve o #minurl corretamente
    },
  },
  /*
  optimizeDeps: {
    include: ['#minurl', 'vfile'],
  },*/
  define: {
    'process.env': {}, // Define `process.env` para evitar erros em ambientes de navegador
  },
  
  build: {
    rollupOptions: {
      // Remova o filtro para aliases internos e apenas externalize dependências que precisam
      external: [],
      plugins: [nodePolyfills()],
    },
    chunkSizeWarningLimit: 1600,
  },
  plugins: [
    react(),
  ],
});

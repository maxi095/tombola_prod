import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // Agregamos esta línea para que Vite encuentre el bundle correcto de html2pdf.js
      'html2pdf.js$': path.resolve(
        __dirname,
        'node_modules/html2pdf.js/dist/html2pdf.bundle.min.js'
      ),
    },
  },
  optimizeDeps: {
    include: ['html2pdf.js'],
  },
});

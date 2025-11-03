import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@syncfusion/ej2-react-richtexteditor',
      '@syncfusion/ej2-base',
      '@syncfusion/ej2-buttons',
      '@syncfusion/ej2-data',
      '@syncfusion/ej2-inputs',
      '@syncfusion/ej2-lists',
      '@syncfusion/ej2-popups',
      '@syncfusion/ej2-navigations',
      '@syncfusion/ej2-splitbuttons',
      '@syncfusion/ej2-rich-texteditor'
    ]
  },
  server: {
    port: 3300,
    host: true,
    open: true, // This will automatically open the browser
  },
  base:'/',
  resolve: {
   alias: {
     moment: 'moment/moment.js'
    },
   },
  build: {
    outDir: 'dist',
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Permite conexões externas ao container
    proxy: {
      '/api': {
        target: 'http://backend:80', // Aponta para o nome do container do Laravel
        changeOrigin: true,          // Altera a origem do cabeçalho HTTP para o container aceitar
        rewrite: (path) => path      // Mantém o prefixo /api intacto
      }
    }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'VueClicaptcha',
      fileName: 'hikari-vue3-clicaptcha'
    },
    rollupOptions: {
      external: ['vue', 'axios', 'qs'],
      output: {
        globals: {
          vue: 'Vue',
          axios: 'axios',
          qs: 'Qs'
        }
      }
    }
  }
})

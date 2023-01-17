import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        task1: resolve(__dirname, 'task1/index.html'),
      },
    },
  },
  appType: 'mpa',
  base: '/'
})
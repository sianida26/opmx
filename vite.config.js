import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        s1t1: resolve(__dirname, 'session_1/task_1/index.html'),
        s1t2: resolve(__dirname, 'session_1/task_2/index.html'),
      },
    },
  },
  appType: 'mpa',
  base: '/opmx/'
})
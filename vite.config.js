import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        s1t1: resolve(__dirname, 'session_1/task_1/index.html'),
        s1t2: resolve(__dirname, 'session_1/task_2/index.html'),
        s1t5: resolve(__dirname, 'session_1/task_5/index.html'),
        s1t8: resolve(__dirname, 'session_1/task_8/index.html'),
        s3t3: resolve(__dirname, 'session_3/task_3/index.html'),
      },
    },
  },
  appType: 'mpa',
  base: '/opmx/'
})
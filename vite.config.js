import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateSetsPlugin from './vite-plugin-generate-sets.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateSetsPlugin()],
  base: './', // GitHub Pagesなどのサブディレクトリデプロイに対応
})

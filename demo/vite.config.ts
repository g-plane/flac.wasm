import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [preact(), WindiCSS()],
})

import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [preact(), WindiCSS()],
})

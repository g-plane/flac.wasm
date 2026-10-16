import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [preact(), WindiCSS()],
  build: {
    rolldownOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return assetInfo.names?.some((name) => name.endsWith('.wasm'))
            ? 'assets/[name][extname]'
            : 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})

import * as path from 'node:path'
import * as process from 'node:process'
import { defineConfig } from 'rollup'
import swc from 'rollup-plugin-swc3'

export default defineConfig({
  input: './index.ts',
  output: {
    file: './workerized.js',
    format: 'iife',
  },
  plugins: [
    swc({
      jsc: {
        target: 'es2018',
      },
    }),
    {
      name: 'replace-import-meta-url',
      resolveImportMeta(prop, { moduleId }) {
        if (prop === 'url') {
          return `new URL('${path.relative(process.cwd(), moduleId)}', self.location).href`
        }
        return null
      },
    },
  ],
  onwarn(warning, warn) {
    if (warning.code !== 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
      warn(warning)
    }
  },
})

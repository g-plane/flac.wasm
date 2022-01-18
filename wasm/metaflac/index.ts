// @ts-expect-error
import loadModule from './metaflac.js'
import type { Options, Output } from './types'

/**
 * @param args CLI arguments passed to the `metaflac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: Options): Promise<Output> {
  const { file, fileName } = options
  let stdout = ''
  let stderr = ''
  const { FS, callMain } = await loadModule({
    print(text: string) {
      stdout += text + '\n'
    },
    printErr(text: string) {
      stderr += text + '\n'
    },
  })

  if (file && fileName) {
    FS.writeFile(fileName, file)
  }

  const exitCode = callMain(args)

  return {
    exitCode,
    stdout,
    stderr,
    file: fileName ? FS.readFile(fileName) : null,
  }
}

if (typeof importScripts !== 'undefined') {
  self.addEventListener(
    'message',
    async ({ data: { args, options } }: { data: { args: string[]; options: Options } }) => {
      self.postMessage(await metaflac(args, options))
    }
  )
}

export type { Options, Output } from './types'

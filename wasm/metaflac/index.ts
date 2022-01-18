// @ts-expect-error
import loadModule from './metaflac.js'
import type { Options, Output, Communication } from './types'

type FS = typeof FS

const isInWorker = typeof importScripts !== 'undefined'

/**
 * @param args CLI arguments passed to the `metaflac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: Options): Promise<Output> {
  const { file, fileName } = options
  let stdout = ''
  let stderr = ''
  const { FS, callMain }: { FS: FS; callMain(args: string[]): number } = await loadModule({
    preRun: ({ FS }: { FS: FS }) => {
      if (isInWorker) {
        FS.init(
          null,
          (c) => self.postMessage({ kind: 'stdout', payload: c }),
          (c) => self.postMessage({ kind: 'stderr', payload: c })
        )
      }
    },
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

if (isInWorker) {
  self.addEventListener('message', async ({ data }: { data: Communication }) => {
    if (data.kind === 'execute') {
      self.postMessage({
        kind: 'complete',
        payload: await metaflac(data.payload.args, data.payload.options),
      })
    }
  })
}

export type { Options, Output } from './types'

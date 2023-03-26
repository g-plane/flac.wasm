// @ts-expect-error
import loadModule from './flac.js'
import { preloadWASM, wasmBinary } from './shared.js'
import type { Options, Output, Communication } from './shared.js'

type FS = typeof FS

const isInWorker = typeof importScripts !== 'undefined'

/**
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function flac(args: string[], options: Options): Promise<Output> {
  const { inputFileName, inputFile, outputFileName } = options
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
    wasmBinary,
  })

  if (inputFile && inputFileName) {
    FS.writeFile(inputFileName, inputFile)
  }

  const exitCode = callMain(args)

  if (!outputFileName) {
    return {
      exitCode,
      stdout,
      stderr,
      file: null,
    }
  }

  const { exists } = (FS as FS & { analyzePath(path: string): { exists: boolean } }).analyzePath(
    outputFileName
  )
  return {
    exitCode,
    stdout,
    stderr,
    file: exists ? FS.readFile(outputFileName) : null,
  }
}

if (isInWorker) {
  self.addEventListener('message', async ({ data }: { data: Communication }) => {
    switch (data.kind) {
      case 'execute':
        self.postMessage({
          kind: 'complete',
          payload: await flac(data.payload.args, data.payload.options),
        })
        break
      case 'preload-wasm':
        preloadWASM(data.payload.wasm)
        break
    }
  })
}

export { preloadWASM } from './shared.js'
export type { Options, Output } from './shared.js'

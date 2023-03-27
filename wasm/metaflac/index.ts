// @ts-expect-error
import loadModule from './metaflac.js'
import { preloadWASM, wasmBinary } from './shared.js'
import type { Options, Output, Communication } from './shared.js'

type FS = typeof FS

const isInWorker = typeof importScripts !== 'undefined'

/**
 * @param args CLI arguments passed to the `metaflac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: Options): Promise<Output> {
  const { inputFiles, outputFileNames } = options
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

  if (inputFiles) {
    ;[...inputFiles.entries()].forEach(([name, data]) => {
      FS.writeFile(name, data)
    })
  }

  const exitCode = callMain(args)

  if (!outputFileNames) {
    return {
      exitCode,
      stdout,
      stderr,
      files: new Map(),
    }
  }

  return {
    exitCode,
    stdout,
    stderr,
    files: new Map(
      outputFileNames
        .map((outputFileName) => {
          const { exists } = (
            FS as FS & { analyzePath(path: string): { exists: boolean } }
          ).analyzePath(outputFileName)
          return [outputFileName, exists ? FS.readFile(outputFileName) : null] as const
        })
        .filter((pair): pair is [string, Uint8Array] => pair[1] != null)
    ),
  }
}

if (isInWorker) {
  self.addEventListener('message', async ({ data }: { data: Communication }) => {
    switch (data.kind) {
      case 'execute':
        self.postMessage({
          kind: 'complete',
          payload: await metaflac(data.payload.args, data.payload.options),
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

import type { WorkerOptions, Output, Communication } from './types'

/**
 * The `metaflac` executable that will run at Web Worker.
 *
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: WorkerOptions): Promise<Output> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./workerized.js', import.meta.url))
    worker.addEventListener('message', ({ data }: { data: Communication }) => {
      switch (data.kind) {
        case 'complete':
          resolve(data.payload)
          worker.terminate()
          break
        case 'stdout':
          options.onStdout?.(data.payload)
          break
        case 'stderr':
          options.onStderr?.(data.payload)
          break
      }
    })
    worker.addEventListener('error', ({ error }) => {
      reject(error)
      worker.terminate()
    })
    worker.addEventListener('messageerror', ({ data }) => {
      reject(data)
      worker.terminate()
    })
    worker.postMessage({
      kind: 'execute',
      payload: {
        args,
        options: {
          fileName: options.fileName,
          file: options.file,
          wasmURL: options.wasmURL || new URL('./metaflac.wasm', import.meta.url).href,
        },
      },
    })
  })
}

export type { Options, Output } from './types'

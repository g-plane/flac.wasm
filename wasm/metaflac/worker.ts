import type { Options, Output } from './types'

/**
 * The `metaflac` executable that will run at Web Worker.
 *
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: Options): Promise<Output> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./workerized.js', import.meta.url))
    worker.addEventListener('message', ({ data }: { data: Output }) => {
      resolve(data)
      worker.terminate()
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
      args,
      options: {
        ...options,
        wasmURL: options.wasmURL || new URL('./metaflac.wasm', import.meta.url).href,
      },
    })
  })
}

export type { Options, Output } from './types'

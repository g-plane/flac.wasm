import type { WorkerOptions, Output, Communication } from './shared'

let worker: Worker | undefined

/**
 * The `metaflac` executable that will run at Web Worker.
 *
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: WorkerOptions): Promise<Output> {
  return new Promise((resolve, reject) => {
    function handleMessageEvent({ data }: { data: Communication }) {
      switch (data.kind) {
        case 'complete':
          resolve(data.payload)
          worker.removeEventListener('message', handleMessageEvent)
          break
        case 'stdout':
          options.onStdout?.(data.payload)
          break
        case 'stderr':
          options.onStderr?.(data.payload)
          break
      }
    }

    const worker = initWebWorker()
    worker.addEventListener('message', handleMessageEvent)
    worker.addEventListener(
      'error',
      ({ error }) => {
        reject(error)
        worker.terminate()
      },
      { once: true }
    )
    worker.addEventListener(
      'messageerror',
      ({ data }) => {
        reject(data)
        worker.terminate()
      },
      { once: true }
    )
    worker.postMessage({
      kind: 'execute',
      payload: {
        args,
        options: {
          fileName: options.fileName,
          file: options.file,
        },
      },
    })
  })
}

function initWebWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./workerized.js', import.meta.url))
  }
  return worker
}

/**
 * Create Web Worker and fetch WebAssembly file eagerly.
 */
export function preloadWorkerAndWASM(wasmSource?: string | ArrayBuffer) {
  const worker = initWebWorker()
  worker.postMessage({
    kind: 'preload-wasm',
    payload: { wasm: wasmSource },
  })
}

export type { Options, Output } from './shared'

import { preloadWASM, wasmBinary } from './shared'
import type { WorkerOptions, Output, Communication } from './shared'

let worker: Worker | undefined

/**
 * The `flac` executable that will run at Web Worker.
 *
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function flac(args: string[], options: WorkerOptions): Promise<Output> {
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
      },
      { once: true }
    )
    worker.addEventListener(
      'messageerror',
      ({ data }) => {
        reject(data)
      },
      { once: true }
    )
    worker.postMessage({
      kind: 'execute',
      payload: {
        args,
        options: {
          inputFileName: options.inputFileName,
          inputFile: options.inputFile,
          outputFileName: options.outputFileName,
        },
      },
    })
  })
}

function initWebWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./workerized.js', import.meta.url), /* @vite-ignore */ {})
  }
  return worker
}

/**
 * Create Web Worker and fetch WebAssembly file eagerly.
 */
export async function preloadWorkerAndWASM(wasmSource?: string | ArrayBuffer) {
  const worker = initWebWorker()
  await preloadWASM(wasmSource)
  worker.postMessage({
    kind: 'preload-wasm',
    payload: { wasm: wasmBinary },
  })
}

export type { WorkerOptions, Output } from './shared'

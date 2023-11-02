export interface Options {
  inputFiles?: Map<string, Uint8Array>
  outputFileNames?: string[]
}

export interface WorkerOptions extends Options {
  onStdout?(char: number): void
  onStderr?(char: number): void
}

export interface Output {
  exitCode: number
  stdout: string
  stderr: string
  /** Outputted files. */
  files: Map<string, Uint8Array>
}

/** @internal */
export let wasmBinary: ArrayBuffer | undefined
/**
 * Fetch WebAssembly file eagerly, then cache it.
 *
 * @param source URL to the WebAssembly file, or an `ArrayBuffer` of the WebAssembly file
 */
export async function preloadWASM(
  source: string | ArrayBuffer =
    new URL('./metaflac.wasm', import.meta.url).href,
) {
  if (wasmBinary) {
    return
  }

  if (typeof source === 'string') {
    const response = await fetch(source)
    if (response.ok) {
      wasmBinary = await response.arrayBuffer()
    }
  } else {
    wasmBinary = source
  }
}

/** @internal */
export type Communication =
  | { kind: 'execute', payload: { args: string[], options: WorkerOptions } }
  | { kind: 'complete', payload: Output }
  | { kind: 'stdout', payload: number }
  | { kind: 'stderr', payload: number }
  | {
    kind: 'preload-wasm',
    payload: { wasm: string | ArrayBuffer | undefined },
  }

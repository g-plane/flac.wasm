export interface Options {
  inputFileName?: string
  inputFile?: Uint8Array
  outputFileName?: string
  /** @internal */
  wasmBinary?: ArrayBuffer
}

export interface WorkerOptions extends Options {
  onStdout?(char: number): void
  onStderr?(char: number): void
}

export interface Output {
  exitCode: number
  stdout: string
  stderr: string
  /** Outputted file. It will be `null` if file isn't existed. */
  file: Uint8Array | null
}

/** @internal */
export let wasmBinary: ArrayBuffer | undefined
export async function preloadWASM(
  source: string | ArrayBuffer = new URL('./flac.wasm', import.meta.url).href
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
  | { kind: 'execute'; payload: { args: string[]; options: WorkerOptions } }
  | { kind: 'complete'; payload: Output }
  | { kind: 'stdout'; payload: number }
  | { kind: 'stderr'; payload: number }

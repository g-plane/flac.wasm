export interface Options {
  fileName?: string
  file?: Uint8Array
  /** Custom WebAssembly file URL, for example, from CDN. */
  wasmURL?: string
}

export interface Output {
  exitCode: number
  stdout: string
  stderr: string
  /** Outputted file. It will be `null` if file isn't existed. */
  file: Uint8Array | null
}

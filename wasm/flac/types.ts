export interface Options {
  inputFileName?: string
  inputFile?: Uint8Array
  outputFileName?: string
  /** Custom WebAssembly file URL, for example, from CDN. */
  wasmURL?: string
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
export type Communication =
  | { kind: 'execute'; payload: { args: string[]; options: WorkerOptions } }
  | { kind: 'complete'; payload: Output }
  | { kind: 'stdout'; payload: number }
  | { kind: 'stderr'; payload: number }

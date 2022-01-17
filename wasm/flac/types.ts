export interface Options {
  inputFileName?: string
  inputFile?: Uint8Array
  outputFileName?: string
}

export interface Output {
  exitCode: number
  stdout: string
  stderr: string
  /** Outputted file. It will be `null` if file isn't existed. */
  file: Uint8Array | null
}

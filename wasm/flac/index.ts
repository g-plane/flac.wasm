// @ts-expect-error
import loadModule from './flac.js'

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

/**
 * @param args CLI arguments passed to the `flac` executable
 * @param options additional options
 */
export async function flac(args: string[], options: Options): Promise<Output> {
  const { inputFileName, inputFile, outputFileName } = options
  let stdout = ''
  let stderr = ''
  const { FS, callMain } = await loadModule({
    print(text: string) {
      stdout += text + '\n'
    },
    printErr(text: string) {
      stderr += text + '\n'
    },
  })

  if (inputFile && inputFileName) {
    FS.writeFile(inputFileName, inputFile)
  }

  const exitCode = callMain(args)

  if (!outputFileName) {
    return {
      exitCode,
      stdout,
      stderr,
      file: null,
    }
  }

  const { exists } = FS.analyzePath(outputFileName)
  return {
    exitCode,
    stdout,
    stderr,
    file: exists ? FS.readFile(outputFileName) : undefined,
  }
}

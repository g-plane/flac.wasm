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
  file: Uint8Array | undefined
}

export async function flac(
  args: string[],
  { inputFileName, inputFile, outputFileName }: Options
): Promise<Output> {
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
      file: undefined,
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

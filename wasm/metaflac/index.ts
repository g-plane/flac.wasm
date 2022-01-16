// @ts-expect-error
import loadModule from './metaflac.js'

export interface Options {
  fileName?: string
  file?: Uint8Array
}

export interface Output {
  exitCode: number
  stdout: string
  stderr: string
  /** Outputted file. It will be `null` if file isn't existed. */
  file: Uint8Array | null
}

/**
 * @param args CLI arguments passed to the `metaflac` executable
 * @param options additional options
 */
export async function metaflac(args: string[], options: Options): Promise<Output> {
  const { file, fileName } = options
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

  if (file && fileName) {
    FS.writeFile(fileName, file)
  }

  const exitCode = callMain(args)

  return {
    exitCode,
    stdout,
    stderr,
    file: fileName ? FS.readFile(fileName) : null,
  }
}

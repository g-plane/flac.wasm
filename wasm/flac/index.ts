// @ts-expect-error
import loadModule from './flac.js'
import type { Options, Output } from './types'

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
    locateFile(path: string, prefix: string) {
      if (options.wasmURL) {
        return options.wasmURL
      }
      return prefix + path
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

if (typeof importScripts !== 'undefined') {
  self.addEventListener(
    'message',
    async ({ data: { args, options } }: { data: { args: string[]; options: Options } }) => {
      self.postMessage(await flac(args, options))
    }
  )
}

export type { Options, Output } from './types'

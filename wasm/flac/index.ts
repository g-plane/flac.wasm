// @ts-expect-error
import loadModule from './flac.js'

export interface Options {
  inputFileName: string
  inputFile: Uint8Array
  outputFileName: string
}

export async function flac(
  args: string[],
  options: Options
): Promise<Uint8Array> {
  const { FS, callMain } = await loadModule()

  FS.writeFile(options.inputFileName, options.inputFile)

  callMain(args)

  return FS.readFile(options.outputFileName)
}

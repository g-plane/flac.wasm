import { metaflac } from 'metaflac.wasm'
import type { JSX } from 'preact'
import { useState } from 'preact/hooks'
import CommandOutput from './CommandOutput'

export default function Flac() {
  const [fileName, setFileName] = useState('input.flac')
  const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  const [args, setArgs] = useState('--show-tag=TITLE --show-tag=ARTIST --show-tag=ALBUM input.flac')
  const [isRunning, setIsRunning] = useState(false)
  const [outputFile, setOutputFile] = useState<string | undefined>(undefined)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')

  const handleFileNameInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    setFileName((event.target as HTMLInputElement).value)
  }

  const handleFileInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && fileName === '') {
      setFileName(file.name)
    }
    setInputFile(file)
  }

  const handleArgsInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    setArgs((event.target as HTMLInputElement).value)
  }

  const handleRun = async () => {
    setIsRunning(true)
    const inputFileBytes = inputFile ? new Uint8Array(await inputFile.arrayBuffer()) : undefined
    const { file, stdout, stderr } = await metaflac(args.trim().split(' '), {
      fileName: fileName,
      file: inputFileBytes,
    })
    setStdout(stdout)
    setStderr(stderr)

    if (outputFile) {
      URL.revokeObjectURL(outputFile)
    }
    if (file) {
      setOutputFile(URL.createObjectURL(new Blob([file])))
    } else {
      setOutputFile(undefined)
    }

    setIsRunning(false)
  }

  return (
    <div class="container flex flex-col items-center">
      <div class="field flex flex-col w-2/5">
        <label class="label">Input File Name</label>
        <div class="control w-full">
          <input
            class="input"
            type="text"
            disabled={isRunning}
            value={fileName}
            onInput={handleFileNameInput}
          />
        </div>
      </div>
      <div class="field flex flex-col w-2/5">
        <label class="label">Input File</label>
        <label class="file-label flex items-center">
          <input class="file-input" type="file" onInput={handleFileInput} />
          <span class="file-cta">
            <span class="file-label">Choose a file…</span>
          </span>
          {inputFile && (
            <span class="ml-2">
              You've already selected: <i>{inputFile.name}</i>
            </span>
          )}
        </label>
      </div>
      <div class="field flex flex-col w-2/5">
        <label class="label">CLI Arguments</label>
        <div class="control w-full">
          <input
            class="input"
            type="text"
            disabled={isRunning}
            value={args}
            onInput={handleArgsInput}
          />
        </div>
      </div>

      <div class="flex justify-center">
        <button class="button is-primary mt-8" disabled={isRunning} onClick={handleRun}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      {outputFile && (
        <a href={outputFile} download={fileName} class="mt-8 button is-info is-light">
          Download audio file
        </a>
      )}

      <div class="mt-4 grid grid-cols-2 gap-x-3 w-3/5">
        <div>
          <h3 class="text-center mb-2 text-lg">stdout</h3>
          <CommandOutput text={stdout} />
        </div>
        <div>
          <h3 class="text-center mb-2 text-lg">stderr</h3>
          <CommandOutput text={stderr} />
        </div>
      </div>
    </div>
  )
}

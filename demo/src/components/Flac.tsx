import { flac, preloadWorkerAndWASM } from 'flac.wasm/worker'
import { useEffect, useState } from 'preact/hooks'
import { useXterm } from '../hooks/useXterm'
import { writeCharToTerminal } from '../utils'

export default function Flac() {
  const [inputFileName, setInputFileName] = useState('input.flac')
  const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  const [outputFileName, setOutputFileName] = useState('output.wav')
  const [args, setArgs] = useState('-d -o output.wav input.flac')
  const [isRunning, setIsRunning] = useState(false)
  const [outputFile, setOutputFile] = useState<string | undefined>(undefined)
  const { terminalContainer, terminalInstance } = useXterm()

  useEffect(() => {
    preloadWorkerAndWASM()
  }, [])

  const handleInputFileNameInput: JSX.GenericEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setInputFileName((event.target as HTMLInputElement).value)
  }

  const handleFileInput: JSX.GenericEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && inputFileName === '') {
      setInputFileName(file.name)
    }
    setInputFile(file)
  }

  const handleOutputFileNameInput: JSX.GenericEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setOutputFileName((event.target as HTMLInputElement).value)
  }

  const handleArgsInput: JSX.GenericEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setArgs((event.target as HTMLInputElement).value)
  }

  const handleRun = async () => {
    setIsRunning(true)
    terminalInstance.current?.clear()
    const inputFiles = inputFile
      ? new Map([[
        inputFileName,
        new Uint8Array(await inputFile.arrayBuffer()),
      ]])
      : undefined
    const { files } = await flac(args.trim().split(' '), {
      inputFiles,
      outputFileNames: [outputFileName],
      onStdout: (char) => {
        if (terminalInstance.current) {
          writeCharToTerminal(terminalInstance.current, char)
        }
      },
      onStderr: (char) => {
        if (terminalInstance.current) {
          writeCharToTerminal(terminalInstance.current, char)
        }
      },
    })

    if (outputFile) {
      URL.revokeObjectURL(outputFile)
    }
    const file = files.get(outputFileName)
    if (file) {
      setOutputFile(URL.createObjectURL(new Blob([file])))
    } else {
      setOutputFile(undefined)
    }

    setIsRunning(false)
  }

  return (
    <div class="container flex flex-col items-center">
      <div class="mb-5">
        You can run the official FLAC tool <code>flac</code>{' '}
        on browser here, as running it as a command line tool.
      </div>

      <div class="field flex flex-col w-2/5">
        <label class="label">Input File Name</label>
        <div class="control w-full">
          <input
            class="input"
            type="text"
            disabled={isRunning}
            value={inputFileName}
            onInput={handleInputFileNameInput}
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
              Selected: <i>{inputFile.name}</i>
            </span>
          )}
        </label>
      </div>
      <div class="field flex flex-col w-2/5">
        <label class="label">Output File Name</label>
        <div class="control w-full">
          <input
            class="input"
            type="text"
            disabled={isRunning}
            value={outputFileName}
            onInput={handleOutputFileNameInput}
          />
        </div>
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
        <button
          class="button is-primary mt-8"
          disabled={isRunning}
          onClick={handleRun}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      {outputFile && (
        <div class="mt-8 flex items-center">
          <audio controls volume={0.1} src={outputFile} />
          <a
            href={outputFile}
            download={outputFileName}
            class="ml-3 button is-info is-light"
          >
            Download audio file
          </a>
        </div>
      )}

      <div class="mt-4 w-190 p-2 rounded bg-black">
        <div ref={terminalContainer}></div>
      </div>
    </div>
  )
}

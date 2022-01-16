import { flac } from 'flac.wasm'
import { useState } from 'preact/hooks'
import Form from './Form'
import CommandOutput from './CommandOutput'

export default function Flac() {
  const [inputFileName, setInputFileName] = useState('input.flac')
  const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  const [outputFileName, setOutputFileName] = useState('output.wav')
  const [args, setArgs] = useState('-d -o output.wav input.flac')
  const [isRunning, setIsRunning] = useState(false)
  const [outputFile, setOutputFile] = useState<string | undefined>(undefined)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')

  const handleRun = async () => {
    setIsRunning(true)
    const inputFileBytes = inputFile ? new Uint8Array(await inputFile.arrayBuffer()) : undefined
    const { file, stdout, stderr } = await flac(args.trim().split(' '), {
      inputFileName,
      inputFile: inputFileBytes,
      outputFileName,
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
      <Form
        inputFileName={inputFileName}
        onInputFileNameChange={setInputFileName}
        inputFile={inputFile}
        onInputFileChange={setInputFile}
        outputFileName={outputFileName}
        onOutputFileNameChange={setOutputFileName}
        args={args}
        onArgsChange={setArgs}
        isRunning={isRunning}
      />

      {outputFile && <audio class="mt-8" controls volume={0.1} src={outputFile} />}

      <div class="flex justify-center">
        <button class="button is-primary mt-8" disabled={isRunning} onClick={handleRun}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-x-3 w-3/5">
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

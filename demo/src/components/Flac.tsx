import { flac } from 'flac.wasm'
import { useState } from 'preact/hooks'
import Form from './Form'

export default function Flac() {
  const [inputFileName, setInputFileName] = useState('input.flac')
  const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  const [outputFileName, setOutputFileName] = useState('output.wav')
  const [args, setArgs] = useState('-d -o output.wav input.flac')
  const [isRunning, setIsRunning] = useState(false)
  const [outputFile, setOutputFile] = useState<string | undefined>(undefined)

  const handleRun = async () => {
    setIsRunning(true)
    const inputFileBytes = inputFile ? new Uint8Array(await inputFile.arrayBuffer()) : undefined
    const { file } = await flac(args.trim().split(' '), {
      inputFileName,
      inputFile: inputFileBytes,
      outputFileName,
    })

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
    </div>
  )
}

import type { JSX } from 'preact'

interface Props {
  inputFileName: string
  onInputFileNameChange(value: string): void
  inputFile: File | undefined
  onInputFileChange(value: File | undefined): void
  outputFileName: string
  onOutputFileNameChange(value: string): void
  args: string
  onArgsChange(args: string): void
  isRunning: boolean
}

export default function Form(props: Props) {
  const { isRunning } = props

  const handleInputFileNameInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    props.onInputFileNameChange((event.target as HTMLInputElement).value)
  }

  const handleFileInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && props.inputFileName === '') {
      props.onInputFileNameChange(file.name)
    }
    props.onInputFileChange(file)
  }

  const handleOutputFileNameInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    props.onOutputFileNameChange((event.target as HTMLInputElement).value)
  }

  const handleArgsInput: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    props.onArgsChange((event.target as HTMLInputElement).value)
  }

  return (
    <>
      <div class="field flex flex-col w-2/5">
        <label class="label">Input File Name</label>
        <div class="control w-full">
          <input
            class="input"
            type="text"
            disabled={isRunning}
            value={props.inputFileName}
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
          {props.inputFile && (
            <span class="ml-2">
              You've already selected: <i>{props.inputFile.name}</i>
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
            value={props.outputFileName}
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
            value={props.args}
            onInput={handleArgsInput}
          />
        </div>
      </div>
    </>
  )
}

# flac.wasm

Run official FLAC tools `flac` as WebAssembly, on browsers or Deno.

## Installation

```
npm i flac.wasm
```

## Examples

### Encoding

```ts
import { flac } from 'flac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const file = new Uint8Array(await blob.arrayBuffer())
// for Deno
const file = await Deno.readFile('source.wav')

const { exitCode, stdout, stderr, file } = flac(['-o', 'output.flac', 'input.wav'], {
  inputFileName: 'input.wav',
  inputFile: file,
  outputFileName: 'output.flac',
})
if (file) {
  // do something with outputted file
}
```

### Dencoding

```ts
import { flac } from 'flac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const file = new Uint8Array(await blob.arrayBuffer())
// for Deno
const file = await Deno.readFile('source.flac')

const { exitCode, stdout, stderr, file } = flac(['-d', '-o', 'output.wav', 'input.flac'], {
  inputFileName: 'input.flac',
  inputFile: file,
  outputFileName: 'output.wav',
})
if (file) {
  // do something with outputted file
}
```

## License

GPL v2

Copyright (c) 2022-present Pig Fang

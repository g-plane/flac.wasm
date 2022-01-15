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

const { exitCode, stdout, stderr, file } = flac(
  ['-o', 'output.flac', 'input.wav'],
  {
    inputFileName: 'input.wav',
    inputFile: file,
    outputFileName: 'output.flac',
  }
)
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

const { exitCode, stdout, stderr, file } = flac(
  ['-d', '-o', 'output.wav', 'input.flac'],
  {
    inputFileName: 'input.flac',
    inputFile: file,
    outputFileName: 'output.wav',
  }
)
if (file) {
  // do something with outputted file
}
```

## License

The source code of [`flac`](https://github.com/xiph/flac/tree/master/src/flac) is licensed under GPL v2.0.
For details, please refer to their [license file](https://github.com/xiph/flac/blob/master/COPYING.GPL).

This repository contains wrapper for running those executables on browsers and other environments
and scripts for building WebAssembly. Those parts are licensed under [MIT](./LICENSE).

Due to using `flac` indirectly, you may be required to use GPL license in your projects.

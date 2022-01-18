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

## Advanced

### Using in Web Worker

By default, running `flac` is blocking the main thread which leads to be out of page response.
To avoid "freezing" the UI, you can run it in a Web Worker.

Just need to change the import:

```diff
- import { flac } from 'flac.wasm'
+ import { flac } from 'flac.wasm/worker'
```

### Using another WebAssembly file

Sometimes you may want to use another WebAssembly file, for example, from CDN.
You can specify the `wasmURL` option:

```js
await flac(/* args */ [], {
  wasmURL: 'https://cdn/flac.wasm',
  // other options
})
```

## License

GPL v2

Copyright (c) 2022-present Pig Fang

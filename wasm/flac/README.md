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

const { exitCode, stdout, stderr, files } = flac(['-o', 'output.flac', 'input.wav'], {
  inputFiles: new Map([['input.wav', file]]),
  outputFileNames: ['output.flac'],
})
const file = files.get('output.flac')
if (file) {
  // do something with outputted file
}
```

### Decoding

```ts
import { flac } from 'flac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const file = new Uint8Array(await blob.arrayBuffer())
// for Deno
const file = await Deno.readFile('source.flac')

const { exitCode, stdout, stderr, files } = flac(['-d', '-o', 'output.wav', 'input.flac'], {
  inputFiles: new Map([['input.flac', file]]),
  outputFileNames: ['output.wav'],
})
const file = files.get('output.wav')
if (file) {
  // do something with outputted file
}
```

## Advanced

### Using in Web Worker

By default, running `flac` will block the main thread which leads to be out of page response.
To avoid "freezing" the UI, you can run it in a Web Worker.

Just need to change the import:

```diff
- import { flac } from 'flac.wasm'
+ import { flac } from 'flac.wasm/worker'
```

### Preloading

It will be better that preloading the WebAssembly file,
instead of fetching it when invoking.

```js
import { preloadWASM } from 'flac.wasm'

preloadWASM()
```

`preloadWASM` also accept a `string` or an `ArrayBuffer` as argument.
For `string`, it will be treated as a URL to be fetched, so you can specify custom WebAssembly location;
for `ArrayBuffer`, it must be the WebAssembly file.

If you're using Web Worker version, you can also preload the Web Worker script:

```js
import { preloadWorkerAndWASM } from 'flac.wasm/worker'

preloadWorkerAndWASM()
```

## Notes

### Using with Vite

You should exclude this package from dependency optimization:

```js
export default defineConfig({
  optimizeDeps: {
    exclude: ['flac.wasm'],
  },
})
```

## License

GPL v2

Copyright (c) 2022-present Pig Fang

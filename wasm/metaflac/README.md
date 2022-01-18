# metaflac.wasm

Run official FLAC tools `metaflac` as WebAssembly, on browsers or Deno.

## Installation

```
npm i metaflac.wasm
```

## Examples

### Reading tag

```ts
import { metaflac } from 'metaflac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const inputFile = new Uint8Array(await blob.arrayBuffer())
// for Deno
const inputFile = await Deno.readFile('file.flac')

const { exitCode, stdout, stderr, file } = metaflac(['--show-tag=TITLE', 'file.flac'], {
  fileName: 'file.flac',
  file: inputFile,
})
console.log(stdout)
```

### Writing tag

```ts
import { metaflac } from 'metaflac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const inputFile = new Uint8Array(await blob.arrayBuffer())
// for Deno
const inputFile = await Deno.readFile('file.flac')

const { exitCode, stdout, stderr, file } = metaflac(['--set-tag=TITLE=xxx', 'input.flac'], {
  fileName: 'input.flac',
  file: inputFile,
})
if (file) {
  // do something with outputted file
}
```

## Advanced

### Using in Web Worker

By default, running `metaflac` is blocking the main thread which leads to be out of page response.
To avoid "freezing" the UI, you can run it in a Web Worker.

Just need to change the import:

```diff
- import { metaflac } from 'metaflac.wasm'
+ import { metaflac } from 'metaflac.wasm/worker'
```

### Using another WebAssembly file

Sometimes you may want to use another WebAssembly file, for example, from CDN.
You can specify the `wasmURL` option:

```js
await metaflac(/* args */ [], {
  wasmURL: 'https://cdn/flac.wasm',
  // other options
})
```

## License

GPL v2

Copyright (c) 2022-present Pig Fang

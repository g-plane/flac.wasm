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

## License

GPL v2

Copyright (c) 2022-present Pig Fang

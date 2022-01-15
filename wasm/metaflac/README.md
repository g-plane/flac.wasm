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
const file = new Uint8Array(await blob.arrayBuffer())
// for Deno
const file = await Deno.readFile('file.flac')

const { exitCode, stdout, stderr, file } = metaflac(
  ['--show-tag=TITLE', 'file.flac'],
  {
    inputFileName: 'file.flac',
    inputFile: file,
  }
)
console.log(stdout)
```

### Writing tag

```ts
import { metaflac } from 'metaflac.wasm'

// for browsers
const blob = document.querySelector('input').files[0]
const file = new Uint8Array(await blob.arrayBuffer())
// for Deno
const file = await Deno.readFile('file.flac')

const { exitCode, stdout, stderr, file } = metaflac(
  ['--set-tag=TITLE=xxx', 'input.flac'],
  {
    inputFileName: 'input.flac',
    inputFile: file,
    outputFileName: 'output.flac',
  }
)
if (file) {
  // do something with outputted file
}
```

## License

The source code of [`metaflac`](https://github.com/xiph/flac/tree/master/src/metaflac) is licensed under GPL v2.0.
For details, please refer to their [license file](https://github.com/xiph/flac/blob/master/COPYING.GPL).

This repository contains wrapper for running those executables on browsers and other environments
and scripts for building WebAssembly. Those parts are licensed under [MIT](./LICENSE).

Due to using `metaflac` indirectly, you may be required to use GPL license in your projects.

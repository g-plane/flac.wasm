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

const { exitCode, stdout, stderr, files } = metaflac(['--show-tag=TITLE', 'file.flac'], {
  inputFiles: new Map([['file.flac', inputFile]]),
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

const { exitCode, stdout, stderr, files } = metaflac(['--set-tag=TITLE=xxx', 'input.flac'], {
  inputFiles: new Map([['input.flac', inputFile]]),
  outputFileNames: ['input.flac'],
})
const file = files.get('input.flac')
if (file) {
  // do something with outputted file
}
```

## Advanced

### Using in Web Worker

By default, running `metaflac` will block the main thread which leads to be out of page response.
To avoid "freezing" the UI, you can run it in a Web Worker.

Just need to change the import:

```diff
- import { metaflac } from 'metaflac.wasm'
+ import { metaflac } from 'metaflac.wasm/worker'
```

### Preloading

It will be better that preloading the WebAssembly file,
instead of fetching it when invoking.

```js
import { preloadWASM } from 'metaflac.wasm'

preloadWASM()
```

`preloadWASM` also accept a `string` or an `ArrayBuffer` as argument.
For `string`, it will be treated as a URL to be fetched, so you can specify custom WebAssembly location;
for `ArrayBuffer`, it must be the WebAssembly file.

If you're using Web Worker version, you can also preload the Web Worker script:

```js
import { preloadWorkerAndWASM } from 'metaflac.wasm/worker'

preloadWorkerAndWASM()
```

## License

GPL v2

Copyright (c) 2022-present Pig Fang

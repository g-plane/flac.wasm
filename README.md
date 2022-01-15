# flac.wasm

Run official FLAC tools `flac` and `metaflac` as WebAssembly, on browsers or Deno.

> Currently we have no plans on supporting Node.js.

## `flac`

### Installation

```
npm i flac.wasm
```

## `metaflac`

### Installation

```
npm i metaflac.wasm
```

## License

The source code of [`flac`](https://github.com/xiph/flac/tree/master/src/flac) and [`metaflac`](https://github.com/xiph/flac/tree/master/src/metaflac) are licensed under GPL v2.0.
For details, please refer to their [license file](https://github.com/xiph/flac/blob/master/COPYING.GPL).

This repository contains wrapper for running those executables on browsers and other environments
and scripts for building WebAssembly. Those parts are licensed under [MIT](./LICENSE).

Due to using `flac` and/or `metaflac` indirectly, you may need to use GPL license in your projects.

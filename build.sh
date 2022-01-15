set -xe

cd flac
./autogen.sh
emconfigure ./configure
sed '/^CFLAGS/s/$/ -s INVOKE_RUN=0 -s EXIT_RUNTIME=0 -s EXPORTED_RUNTIME_METHODS="[FS, callMain]" -s MODULARIZE=1&/' \
  -i src/flac/Makefile
sed '/^CFLAGS/s/$/ -s INVOKE_RUN=0 -s EXIT_RUNTIME=0 -s EXPORTED_RUNTIME_METHODS="[FS, callMain]" -s MODULARIZE=1&/' \
  -i src/metaflac/Makefile
emmake make clean
emmake make
cp src/flac/.libs/flac ../wasm/flac/flac.js
cp src/flac/.libs/flac.wasm ../wasm/flac/flac.wasm
cp src/metaflac/.libs/metaflac ../wasm/metaflac/metaflac.js
cp src/metaflac/.libs/metaflac.wasm ../wasm/metaflac/metaflac.wasm
cd ..

pnpm build

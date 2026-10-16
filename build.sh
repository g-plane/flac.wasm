set -xe

cd flac
./autogen.sh
emconfigure ./configure --disable-examples --disable-option-checking --disable-cpplibs --disable-shared --enable-static
sed '/^LDFLAGS/s/$/ -sINVOKE_RUN=0 -sEXIT_RUNTIME=0 -sEXPORTED_RUNTIME_METHODS="[FS, callMain]" -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=worker -sERROR_ON_UNDEFINED_SYMBOLS=0 -sTEXTDECODER=2&/' \
  -i src/flac/Makefile
sed '/^LDFLAGS/s/$/ -sINVOKE_RUN=0 -sEXIT_RUNTIME=0 -sEXPORTED_RUNTIME_METHODS="[FS, callMain]" -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=worker -sERROR_ON_UNDEFINED_SYMBOLS=0 -sTEXTDECODER=2&/' \
  -i src/metaflac/Makefile
emmake make clean
emmake make -j
cp src/flac/flac ../wasm/flac/flac.js
cp src/flac/flac.wasm ../wasm/flac/flac.wasm
cp src/metaflac/metaflac ../wasm/metaflac/metaflac.js
cp src/metaflac/metaflac.wasm ../wasm/metaflac/metaflac.wasm
cd ..

pnpm --filter=flac.wasm build
pnpm --filter=metaflac.wasm build

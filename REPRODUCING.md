# Reproduce the public reference

Replay the published data:

```sh
python tools/check_integrity.py
python -m unittest discover -s tests -v
python verify_results.py --output results/python.json
node verify_t27.mjs --output results/t27.json
node tools/test_t27_refusals.mjs
```

The public CI runs these commands on Ubuntu x86-64/ARM64, native Windows x86-64,
and macOS ARM64/Intel. Runtime receipts are Actions artifacts. No cloud API key
or board access is configured in these jobs. They verify recorded data only.

## t27 source to C

Build t27c from the public compiler repository at commit
`d9737e1fd5d0571b893008a2f72d6213dac57f6e`, following that project's build
instructions and retaining its required metadata. The recorded compiler reports
`t27c 0.5.2`. Then, from this repository:

```sh
t27c typecheck demo/mac32_reference.t27
t27c gen-c demo/mac32_reference.t27 > regenerated.c
cmp regenerated.c demo/mac32_reference.c
cc -std=gnu11 -DT27_TEST_MAIN regenerated.c -o reference-tests
./reference-tests
```

The captured typecheck has zero errors/warnings; all five C tests passed.
Generated C is unchanged. `cmp` is a POSIX example; a binary file comparison
can be substituted on Windows. No compiler or private source snapshot is shipped.

## C to standalone WASM

Activate Emscripten 6.0.12 and compile:

```sh
emcc demo/mac32_reference.c -O2 --no-entry -sSTANDALONE_WASM=1 \
  -sEXPORTED_FUNCTIONS='["_mac32_ref"]' -sFILESYSTEM=0 -sASSERTIONS=0 \
  -o rebuilt.wasm
```

The published WASM was produced by these commands. Its SHA256 is recorded,
but bit-identical rebuilding across independently installed SDKs is not yet
qualified. Validate the export/import list and replay results, and report
any binary difference with compiler/SDK details. Do not edit generated C to
force a passing result. Reference replay failures must remain failures.

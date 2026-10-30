# Tools and attribution

The public arithmetic demo is authored for this evidence repository. The
generated C header retains its t27c generator notice. No private FPGA HDL,
bitstream, commercial chip design, provisioning secret or Studio source is
distributed here.

- t27c 0.5.2, public source commit
  [d9737e1](https://github.com/dmitrii-f-t27/t27/commit/d9737e1fd5d0571b893008a2f72d6213dac57f6e),
  generated `demo/mac32_reference.c` from the adjacent `.t27` file. The compiler
  is separately licensed under Apache-2.0; it is not redistributed here.
- Emscripten 6.0.12 compiled the unchanged generated C to the standalone WASM.
  Its permissive licence notice is retained in `LICENSE.EMSCRIPTEN`.
- MAC32 hardware protocol used in the separately performed experiment is based
  on Dmitrii Vasilev's TRI-NET work. This public demo specifies only the recorded
  arithmetic and encoding; it does not implement or publish that FPGA node.

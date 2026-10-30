# MAC32 experiment and interpretation

Date: 30 October 2026. Device class: AX7203 / Artix-7 200T.

The experiment used one physical board. A private t27 kernel generated the
256-case suite, computed expected values and judged received results. A narrow
macOS adapter transported UDP and checked keyed reply receipts. The accepted
firmware version was `ternara-ax7203-mac32-2026.10.30-r1`; its recorded image
fingerprint is in the JSON. A preceding controlled SRAM-only load, board health
checks and two hardware runs established dated local load provenance. This is
not continuous readback or remote cryptographic bitstream attestation.

In the later portable-kit experiment, macOS ARM64 performed a local 256-case
run. An actual Linux x86-64 RunPod then executed the private kit's own Node/WASM,
controlled another 256-case run through authenticated SSH, and replayed the
results independently on the Pod. Network and keyed reply verification stayed
on the Mac; no node key was copied to RunPod. The 256 cloud-controlled raw
exchanges were additionally checked using an earlier independent Python host
implementation, including input bytes, nonces, results and keyed tags.

Direct public TCP SSH was unreachable in that run; the successful path was
RunPod basic SSH with PTY and a scoped stdin/stdout relay. No public HTTP bridge
was opened. The new CPU Pod was stopped after evidence retrieval.

The public data is a sanitized export of the cloud-controlled run, with raw
packets, credentials, device/account identifiers and private source removed.
Its file hash is fixed in `SHA256SUMS`. Its environment matrix is historical.
The recorded actual values match both public arithmetic implementations.

The newly published t27 reference was compiled separately for this repository.
Its CI establishes cross-platform execution of that reference and the Python
verifier, not equivalence of the private hardware implementation over all
possible inputs. Five native generated-C unit tests and the 256-case replays
are finite tests, not a formal proof. The suite does not exhaust the input space.

## Explicitly unmeasured or unqualified

- Full model inference or arbitrary Studio graph execution on the FPGA.
- System power, energy per inference, ASIC performance or throughput advantage.
- Public cryptographic hardware attestation or continuous configuration readback.
- Direct Linux USB/JTAG/FPGA Ethernet or Windows private-kit installation.
- WSL2 qualification; native Windows CI does not stand in for WSL2.

Future experiments should be new dated records, including failures and method
changes. Existing records must not be rewritten to imply later tests were
already performed. Independent board repetitions are particularly valuable.

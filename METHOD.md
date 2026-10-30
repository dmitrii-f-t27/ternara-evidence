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


## Second Mac direct physical repetition — 30 October 2026

The same owner repeated the bounded MAC32 suite on a second physical computer,
an Apple M4 running macOS 27.0.1 and Node 26.12.0. The unchanged private R3 kit
used that Mac's local wired Ethernet and USB JTAG; no M1 network relay was used.
The controlled SRAM load used the same r1 image hash. After provisioning the
existing local key into volatile FPGA state, one warm-up case and the complete
256-case suite passed. All 257 exchanges were independently checked with the
prior Python arithmetic and authentication implementation; altered tags were
refused. Post-run private DNA comparison, DONE and CRC checks passed.

The [dated machine-readable summary](experiments/2026-10-30-m4-direct.json)
contains no key, packet, serial, DNA, MAC or hostname. Its 256 arithmetic rows
exactly match the already published dataset, so no duplicate dataset is needed.
The public replay commands verify those numbers; they cannot independently
verify the private hardware origin or keyed receipts. This is a second-computer
repetition by the same team on the same board, not a third-party audit. It
establishes neither complete-model inference nor energy or ASIC performance.

Initial attempts are retained privately: a runner mount-path error, startup
timeouts over a redundant SMB path, and responses without accepted key
provisioning were not counted as passes. The successful run used the verified
physical SSD path and an acknowledged installation of the existing key. No
firmware or product arithmetic change was required to make the M4 suite pass.

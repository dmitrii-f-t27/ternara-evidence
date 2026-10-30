# Ternara evidence

Public data and repeatable checks for one bounded Ternara MAC32 experiment.
The public software reference is written in **t27**. An independently written
Python implementation checks the same exact integer inputs and recorded results.

```sh
python verify_results.py
node verify_t27.mjs
```

Use Python 3.12+ and Node 24.13.0. No packages, API token, FPGA, npm install or
paid service is needed to replay the data.

## What you can verify

Each dataset row contains two packed 64-bit input vectors and the expected and
recorded actual result. Each vector has 32 two-bit trits: `00=0`, `01=+1`,
`10=-1`; `11` is reserved and rejected by the replay adapters. The result is
the sum of the 32 pairwise products. Inputs remain hexadecimal strings, so
JavaScript never rounds 64-bit values through a floating-point number.

Both verifiers require all 256 unique cases. Altered results, missing rows,
duplicate cases, noninteger outputs and reserved encodings fail. The CI also
executes refusal controls, not just a happy-path example.

The `.t27` source, unchanged generated C and a 372-byte standalone WASM reference
are public. The WASM imports no host functions and cannot contact a board.
It is a separate software arithmetic reference, not the private FPGA design.
See [REPRODUCING.md](REPRODUCING.md) for source-to-artifact commands.

## Current evidence

| Evidence | Status |
|---|---|
| Owner's macOS ARM64 private-kit replay | 256/256 passed, 30 October 2026 |
| Actual RunPod Linux x86-64 private-kit replay | 256/256 passed, 30 October 2026 |
| AX7203 job controlled locally by macOS | 256/256 matched; local keyed receipt verification |
| AX7203 job controlled by RunPod | 256/256 matched; SSH relay to macOS Ethernet and local keyed receipt verification |
| Public t27/Python CI on Windows, Linux and macOS | See the actual [Actions runs](https://github.com/dmitrii-f-t27/ternara-evidence/actions/workflows/verify.yml); no unrun job is considered passed |
| WSL2, direct Linux USB/JTAG/FPGA Ethernet | Not qualified by these checks |

The dated JSON preserves the original experiment matrix, including its original
Windows/WSL2 “not tested” entry. New public reference-CI results are separate:
passing them does not retroactively qualify the private kit on Windows.
Each Actions job uploads its actual platform, architecture, runtime and file
fingerprints. See [METHOD.md](METHOD.md) for the experiment and its limits.

**Replaying a JSON verifies its arithmetic, not its physical origin.** The
private raw reply receipts were independently checked by the originating team;
their symmetric keys are not public attestations. No complete model inference,
ASIC performance, energy saving, sustained throughput or continuous SRAM
readback is established here.

## Repeat or challenge the result

Run the commands, inspect the source and submit a minimal failing case as an
issue or pull request. Include your OS, architecture, runtime versions, commit
and full verifier output. Mark software replays and real board experiments
separately. Independent physical repetitions need a compatible board, the
appropriate firmware and locally provisioned keys; this repository is not a
hardware provisioning kit. Never put keys or device identifiers into an issue.

MIT applies only to the files published here, with the third-party notice in
[THIRD_PARTY.md](THIRD_PARTY.md). Private commercial IP is not included or
licensed by this repository.

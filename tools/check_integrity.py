"""Portable SHA256SUMS verification; no third-party packages."""
import hashlib
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
for line in (ROOT / 'SHA256SUMS').read_text().splitlines():
    expected, name = line.split('  ', 1)
    path = (ROOT / name).resolve()
    if not path.is_relative_to(ROOT) or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit('Integrity mismatch: ' + name)
print('All recorded file hashes match')

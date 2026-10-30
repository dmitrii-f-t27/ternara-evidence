#!/usr/bin/env python3
"""Independent Python arithmetic replay. No hardware connection is made."""
import argparse
import datetime
import hashlib
import json
import os
import pathlib
import platform
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
DEFAULT = ROOT / 'data/mac32-cross-platform-2026-10-30.json'


def verify(data):
    if not isinstance(data, dict) or data.get('schema') != 'ternara-mac32-evidence/1':
        raise ValueError('Unsupported evidence schema')
    if type(data.get('lanes')) is not int or data['lanes'] != 32:
        raise ValueError('Expected 32 lanes')
    if data.get('encoding') != {'0': 0, '1': 1, '2': -1}:
        raise ValueError('Unexpected trit encoding')
    rows = data.get('results')
    if not isinstance(rows, list) or len(rows) != 256:
        raise ValueError('Expected 256 cases')
    seen = set()
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError('Invalid row')
        case = row.get('case')
        if type(case) is not int or not 0 <= case < 256 or case in seen:
            raise ValueError('Invalid or duplicate case')
        seen.add(case)
        vectors = []
        for field in ('w_u64_hex', 'x_u64_hex'):
            value = row.get(field)
            if not isinstance(value, str) or not re.fullmatch('[0-9a-f]{16}', value):
                raise ValueError('Invalid 64-bit vector')
            word = int(value, 16)
            digits = [(word >> (2 * i)) & 3 for i in range(32)]
            if 3 in digits:
                raise ValueError('Reserved trit encoding')
            vectors.append([{0: 0, 1: 1, 2: -1}[v] for v in digits])
        expected = sum(a * b for a, b in zip(*vectors))
        if any(type(row.get(k)) is not int or row[k] != expected for k in ('expected', 'actual')):
            raise ValueError('Arithmetic mismatch')
    return {'passed': True, 'arithmetic_rows': len(seen), 'mismatches': 0,
            'physical_test_performed': False, 'hardware_attestation': False,
            'scope': 'independent arithmetic replay of recorded data'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', nargs='?', type=pathlib.Path, default=DEFAULT)
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    raw = args.file.read_bytes()
    result = verify(json.loads(raw))
    result.update(platform=platform.system(), architecture=platform.machine(),
                  os_release=platform.release(), os_version=platform.version(),
                  python=platform.python_version(), dataset_sha256=hashlib.sha256(raw).hexdigest(),
                  git_commit=os.environ.get('GITHUB_SHA'), ci_run_id=os.environ.get('GITHUB_RUN_ID'),
                  finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
    output = json.dumps(result, indent=2) + '\n'
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding='utf-8')
    print(output, end='')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, TypeError, OSError) as error:
        print('Verification failed: ' + str(error), file=sys.stderr)
        sys.exit(1)

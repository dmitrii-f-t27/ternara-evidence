// Environment adapter only: load a t27-generated WASM module and recorded rows.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const dataBytes=fs.readFileSync(path.join(root,'data/mac32-cross-platform-2026-10-30.json'));
const wasmBytes=fs.readFileSync(path.join(root,'demo/mac32_reference.wasm'));
const module=new WebAssembly.Module(wasmBytes);
if(WebAssembly.Module.imports(module).length)throw Error('REFERENCE_MUST_NOT_IMPORT_HOST_IO');
const instance=new WebAssembly.Instance(module,{});
instance.exports._initialize();
const reference=instance.exports.mac32_ref;
const data=JSON.parse(dataBytes);
if(data.schema!=='ternara-mac32-evidence/1'||data.lanes!==32||!Array.isArray(data.results)||data.results.length!==256)throw Error('INVALID_DATASET');
if(data.encoding?.['0']!==0||data.encoding?.['1']!==1||data.encoding?.['2']!==-1)throw Error('INVALID_ENCODING');
if(process.env.EXPECTED_NODE_ARCH&&process.arch!==process.env.EXPECTED_NODE_ARCH)throw Error('UNEXPECTED_RUNNER_ARCHITECTURE');
const seen=new Set();
for(const row of data.results){
  if(!Number.isInteger(row.case)||row.case<0||row.case>255||seen.has(row.case)||!Number.isInteger(row.actual)||!Number.isInteger(row.expected)||!/^[a-f0-9]{16}$/.test(row.w_u64_hex)||!/^[a-f0-9]{16}$/.test(row.x_u64_hex))throw Error('INVALID_ROW');
  seen.add(row.case);
  const w=BigInt('0x'+row.w_u64_hex),x=BigInt('0x'+row.x_u64_hex);
  for(let i=0n;i<32n;i++)if(((w>>(2n*i))&3n)===3n||((x>>(2n*i))&3n)===3n)throw Error('RESERVED_TRIT');
  const actual=reference(Number(w&0xffffffffn),Number(w>>32n),Number(x&0xffffffffn),Number(x>>32n));
  if(actual!==row.actual||actual!==row.expected)throw Error('T27_REPLAY_MISMATCH');
}
const report={passed:true,arithmetic_rows:seen.size,mismatches:0,platform:process.platform,architecture:process.arch,os_release:os.release(),node:process.version,git_commit:process.env.GITHUB_SHA??null,ci_run_id:process.env.GITHUB_RUN_ID??null,dataset_sha256:sha(dataBytes),t27_source_sha256:sha(fs.readFileSync(path.join(root,'demo/mac32_reference.t27'))),wasm_sha256:sha(wasmBytes),physical_test_performed:false,hardware_attestation:false,scope:'public t27 software-reference replay; not the private FPGA implementation',finished_at:new Date().toISOString()};
const output=process.argv.indexOf('--output');
if(output>=0){if(!process.argv[output+1])throw Error('OUTPUT_PATH_REQUIRED');fs.mkdirSync(path.dirname(process.argv[output+1]),{recursive:true});fs.writeFileSync(process.argv[output+1],JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));

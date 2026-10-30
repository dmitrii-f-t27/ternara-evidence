import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ternara-reference-'));
try{
  fs.cpSync(path.join(root,'demo'),path.join(temp,'demo'),{recursive:true});
  fs.copyFileSync(path.join(root,'verify_t27.mjs'),path.join(temp,'verify_t27.mjs'));
  fs.mkdirSync(path.join(temp,'data'));
  const data=JSON.parse(fs.readFileSync(path.join(root,'data/mac32-cross-platform-2026-10-30.json')));
  let checked=0;
  for(const mutation of [d=>d.results[0].actual++,d=>d.results[0].actual=0.5,d=>delete d.results[0].actual,d=>d.results.pop(),d=>d.results[1].case=0,d=>d.results[0].w_u64_hex='ffffffffffffffff',d=>d.encoding['0']=1]){
    const changed=structuredClone(data);mutation(changed);
    fs.writeFileSync(path.join(temp,'data/mac32-cross-platform-2026-10-30.json'),JSON.stringify(changed));
    const result=spawnSync(process.execPath,[path.join(temp,'verify_t27.mjs')],{encoding:'utf8'});
    if(result.error||result.status===null||result.status===0)throw Error('FALSE_GREEN_OR_TEST_EXECUTION_FAILURE');
    checked++;
  }
  console.log(JSON.stringify({passed:true,negative_controls_refused:checked,hardware_packets_sent:0}));
}finally{fs.rmSync(temp,{recursive:true,force:true});}

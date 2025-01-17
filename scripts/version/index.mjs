import fs from 'node:fs';
import path from 'node:path';

import { getJSON } from '../helpers/esm.mjs';

const packageJsonFilename = path.resolve('./package.json');
const json = await getJSON(packageJsonFilename, import.meta);

const devDependencies = json.devDependencies || {};
const peerDependencies = json.peerDependencies || {};

let peers = 0;
for (const key in peerDependencies) {
  if (key in devDependencies) {
    !peers && console.log(`${json.name}: Updating peer dependencies`);
    console.log(
      `  - ${key}: \x1b[31m${peerDependencies[key] || 'none'}\x1b[0m => \x1b[32m${
        devDependencies[key]
      }\x1b[0m`
    );
    json.peerDependencies[key] = devDependencies[key];
    peers += 1;
  }
}
!!peers && console.log('\n'); // formatting
fs.writeFileSync(packageJsonFilename, JSON.stringify(json, null, 2), 'utf-8');

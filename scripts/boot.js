// run the npm dev scripts in each of the nested packages
// This is the entry point for the dev script

import { execSync } from 'child_process'
import { readdirSync } from 'fs'
import { join } from 'path'
import { packages } from './common.js'

for (const [name, path] of Object.entries(packages)) {
    console.log(`\n👉 ${name}`)
    execSync('npm run dev', { cwd: path, stdio: 'inherit' })
}

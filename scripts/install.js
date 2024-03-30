// run yarn install for all packages

// This is the entry point for the install script
import { execSync } from 'child_process'
import { readdirSync } from 'fs'
import { join } from 'path'
import { packages } from './common.js'

// get the --m1 flag from input
const m1 = process.argv.includes('--m1')

for (const [name, path] of Object.entries(packages)) {
    console.log(`\n👉 ${name}`)
    execSync(`yarn install${(m1 && '&& yarn add sharp --ignore-engines') || ''}`, {
        cwd: path,
        stdio: 'inherit',
    })
}

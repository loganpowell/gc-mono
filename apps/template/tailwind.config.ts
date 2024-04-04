/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
    content: ['**/*.{js,ts,jsx,tsx,vue}', '**/*/index.html'],
    presets: [sharedConfig],
}

export default config

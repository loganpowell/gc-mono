/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
    content: ['**/*.{js,ts,jsx,tsx,vue}', '**/*/index.html'],
    //prefix: 'ui-',
    presets: [sharedConfig],
}

export default config

//export default {
//    content: [
//      "**/*/index.html",
//      "**/*.{js,ts,jsx,tsx,vue}",
//    ],
//    theme: {
//      extend: {},
//    },
//    plugins: [],
//  }

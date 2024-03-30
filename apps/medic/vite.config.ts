import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@ui': path.resolve(__dirname, '../../packages/ui/src'),
        },
    },
    server: {
        port: 8789,
        open: true,
        watch: {
            ignored: ['!**/node_modules/@repo/**'],
        },
    },
    clearScreen: false,
    // The watched package must be excluded from optimization,
    // so that it can appear in the dependency graph and trigger hot reload.
    optimizeDeps: {
        exclude: ['@repo'],
    },
})

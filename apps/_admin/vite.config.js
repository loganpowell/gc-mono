import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
export default defineConfig(async () => {
    return {
        plugins: [react(), tsconfigPaths()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '@ui': path.resolve(__dirname, '../../packages/ui/src'),
            },
        },
        server: {
            port: 8787,
            open: true,
            watch: {
                ignored: ['!**/node_modules/@repo/**'],
            },
        },
        clearScreen: false,
        optimizeDeps: {
            exclude: ['@repo'],
        },
    }
})

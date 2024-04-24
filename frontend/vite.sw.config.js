import { defineConfig } from 'vite';
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                'service-worker': './service-worker.js',
            },
            output: {
                format: 'iife',
                entryFileNames: '[name].js',
            },
        },
    },
});
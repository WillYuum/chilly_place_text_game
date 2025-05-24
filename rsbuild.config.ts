import { defineConfig } from '@rsbuild/core';

export default defineConfig({
    html: {
        template: './public/index.html',
    },
    source: {
        entry: {
            index: './src/index.ts',
        },
        tsconfigPath: './tsconfig.json',
    },
    output: {
        target: 'web',
        distPath: {
            root: 'builds/dev',
            js: 'resource/js',
        },
    },
    tools: {
        bundlerChain(chain) {
            chain.module
                .rule('assets')
                .test(/\.(png|json|atlas)$/)
                .type('asset/resource');
        },
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
});

const yargs         = require('yargs');
const { hideBin }   = require('yargs/helpers');
const typescript    = require('@rollup/plugin-typescript');
const {minify}      = require('rollup-plugin-esbuild-minify');
const args          = yargs(hideBin(process.argv)).argv;
 
//
// Config
//
const PRODUCTION = args.production ;

const tsInit = typescript();

const config = {
    PRODUCTION,
    server: {
        port: 8000,
        server: 'dist'
    },
    paths: {
        src: {
            html:               'src/html/*.html',
            js:                 ['src/js/*.ts', PRODUCTION ? '!src/js/tests.ts' : null].filter(Boolean)
        },
        dest: {
            html:               'dist',
            js:                 'dist/js',
            cjs:                'dist/cjs'
        }
    },
    rollupConfigLib: {
        output: {
            name: '$be',
            format: 'iife',
            sourcemap: !PRODUCTION 
        },
        plugins: [
            tsInit,
            PRODUCTION ? minify() : null
        ].filter(Boolean)
    },
    rollupConfigModule: {
        output: {
            name: 'baseElem',
            format: 'umd',
            sourcemap: !PRODUCTION 
        },
        plugins: [tsInit]
    }
};


module.exports = config;
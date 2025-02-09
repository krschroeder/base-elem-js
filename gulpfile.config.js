const yargs         = require('yargs');
const { hideBin }   = require('yargs/helpers');
const webpack       = require('webpack');
const args          = yargs(hideBin(process.argv)).argv;

 
//
// Config
//
const 
    PRODUCTION = args.production,
    excludeWebpack = /(node_modules\/)/
;

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
    webpackConfig: {
        mode: (PRODUCTION ? "production" : "development"),
        devtool: "source-map",
        target: ["web", "es6"],
        output: {
            filename: 'base-elem.js',
            library: '$be', 
            libraryTarget: 'var',
            globalObject: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: excludeWebpack,
                    loader: "babel-loader"
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV_CONFIG: {
                    production: JSON.stringify(PRODUCTION)
                }
            }),
            new webpack.LoaderOptionsPlugin({
                options:{
                    environment: {
                        // The environment supports arrow functions ('() => { ... }').
                        arrowFunction: true,
                        // The environment supports async function and await ('async function () { await ... }').
                        asyncFunction: true,
                        // The environment supports BigInt as literal (123n).
                        bigIntLiteral: false,
                        // The environment supports const and let for variable declarations.
                        const: true,
                        // The environment supports destructuring ('{ a, b } = obj').
                        destructuring: true,
                        // The environment supports 'document' variable.
                        document: true,
                        // The environment supports an async import() function to import EcmaScript modules.
                        dynamicImport: false,
                        // The environment supports an async import() when creating a worker, only for web targets at the moment.
                        dynamicImportInWorker: false,
                        // The environment supports 'for of' iteration ('for (const x of array) { ... }').
                        forOf: true,
                        // The environment supports 'globalThis'.
                        globalThis: true,
                        // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
                        module: false,
                        // Determines if the node: prefix is generated for core module imports in environments that support it.
                        // This is only applicable to Webpack runtime code.
                        nodePrefixForCoreModules: false,
                        // The environment supports optional chaining ('obj?.a' or 'obj?.()').
                        optionalChaining: true,
                        // The environment supports template literals.
                        templateLiteral: true,
                    }
                }
            })
        ]
    } 
};

module.exports = config;
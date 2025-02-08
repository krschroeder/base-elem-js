const webpack = require('webpack');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const args = yargs(hideBin(process.argv)).argv;

 
const 
    PRODUCTION = args.production,
    excludeWebpack = /(node_modules\/)/
;

export default {
    server: {
        port: 8000,
        server: 'dist'
    },
    paths: {
        src: {
            html:               'src/*.html',
            js:                 'src/js/*.ts'
        },
        dest: {
            html:               'dist',
            js:                 'dist/js'
        }
    },
    webpackConfig: {
        mode: (PRODUCTION ? "production" : "development"),
        target: ["web", "es6"],
        output: {
            library: "baseElem"
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
            })
        ]
    } 
};

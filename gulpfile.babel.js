import browser                  from 'browser-sync';
import { rimraf }               from 'rimraf';

import {
    src,
    dest,
    task,
    parallel,
    series,
    watch
} from 'gulp';
import gulpif                   from 'gulp-if';

import sourcemaps               from 'gulp-sourcemaps';

import uglify                   from 'gulp-uglify';
import named                    from 'vinyl-named';
import webpack                  from 'webpack';
import webpackStream            from 'webpack-stream';

import yargs                    from 'yargs';
import { hideBin }              from 'yargs/helpers';

const args = yargs(hideBin(process.argv)).argv;

 
//
// Config
//
const 
    PRODUCTION = args.production,
    excludeWebpack = /(node_modules\/)/
;

const config = {
    server: {
        port: 8000,
        server: 'dist'
    },
    paths: {
        src: {
            html:               'src/html/*.html',
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


//
// Build
//
 

const buildHTML = (done) => {
    if (!PRODUCTION) {
        return src(config.paths.src.html).pipe(dest(config.paths.dest.html));
    } 
    done();
}

 

const buildJS = () =>
    src(config.paths.src.js)
    .pipe(named())
    .pipe(sourcemaps.init())
    .pipe(webpackStream(config.webpackConfig, webpack))
    .pipe(gulpif(PRODUCTION, uglify()
        .on('error', e => { console.log(e); })
    ))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(dest(config.paths.dest.js))
;
 

const clean = () => rimraf(config.paths.dest.html);

//
// Server
//

const reload = (done) => {
    browser.reload();
    done();
};

const server = (done) => {
    if (!PRODUCTION) {
        browser.init(config.server);
    }

    done();
};

//
// Tasks
//

const mainTask = series(
    clean,
    series(   
        buildHTML,
        buildJS
    )
);

const watchTask = (done) => {
    // TODO: watch task sometimes falls asleep at the wheel and stops working
    // Not sure why but, still needs fixed.
    if (!PRODUCTION) {
        watch(config.paths.src.html, series(buildHTML, reload));
        watch(config.paths.src.js, series(buildJS, reload));
       
    }

    done();
};

const devTask = parallel(
    server,
    watchTask
);

// Default task
task('default', series(
    mainTask,
    devTask
));

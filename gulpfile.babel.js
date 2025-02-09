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
import babel                    from 'gulp-babel';
import uglify                   from 'gulp-uglify';
import named                    from 'vinyl-named';
import webpack                  from 'webpack';
import webpackStream            from 'webpack-stream';
import typescript               from 'gulp-typescript';
import rename                   from 'gulp-rename';
import config                   from './gulpfile.config';

const PRODUCTION = config.PRODUCTION;

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
    // .pipe(gulpif(PRODUCTION, uglify()
    //     .on('error', e => { console.log(e); })
    // ))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(dest(config.paths.dest.js))
;

const buildCJs = (done) => {
	if (PRODUCTION) {
		const tsProject = typescript.createProject('tsconfig.json', {
            sourceMap: false    
        });
	 
		return src(config.paths.src.js)
			.pipe(tsProject())
			.pipe(babel())
			.pipe(dest(config.paths.dest.cjs));
	}
	done();
}

const buildJsDeclarations = (done) => {
	if (PRODUCTION) {
		const tsProject = typescript.createProject('tsconfig.json',{
			declaration: true,
			emitDeclarationOnly: true, 
            sourceMap: false
		});
	 
		return src(config.paths.src.js)
			.pipe(tsProject())
			.pipe(dest(config.paths.dest.js))
			.pipe(dest(config.paths.dest.cjs));
	}
	done();
}
 

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
        buildCJs,
        buildJsDeclarations,
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

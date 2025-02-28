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
import typescript               from 'gulp-typescript';
import rename                   from 'gulp-rename';
import config                   from './gulpfile.config';
import rollupEach               from 'gulp-rollup-each'; 


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
    .pipe(sourcemaps.init())
    .pipe(rollupEach(config.rollupConfigLib))
    .pipe(rename({ extname: PRODUCTION ? '.min.js' : '.js' }))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(dest(config.paths.dest.js))
;

const buildModuleJS = (done) => {
    if (PRODUCTION) {
        return src(config.paths.src.js)
            .pipe(sourcemaps.init())
            .pipe(rollupEach(config.rollupConfigModule))
            .pipe(rename({ extname: '.js' }))
            .pipe(sourcemaps.write('.'))
            .pipe(dest(config.paths.dest.js))
        ;
    }
    done();
}

const buildJsDeclarations = (done) => {
	if (PRODUCTION) {
		const tsProject = typescript.createProject('tsconfig.json',{
			declaration: true,
			emitDeclarationOnly: true, 
            sourceMap: false,
            outFile: 'base-elem-js.d.ts',
		});
	 
		return src(config.paths.src.dts)
			.pipe(tsProject())
			.pipe(dest(config.paths.dest.js))
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
        buildJsDeclarations,
        buildModuleJS,
        buildJS
    )
);

const watchTask = (done) => {
    // TODO: watch task sometimes falls asleep at the wheel and stops working
    // Not sure why but, still needs fixed.
    if (!PRODUCTION) {
        watch(config.paths.src.html, series(buildHTML, reload));
        watch(config.paths.src.jswatch, series(buildJS, reload));
       
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

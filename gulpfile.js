const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const route = "src/public";


sass.compiler = require('node-sass');

require("@babel/core").transform("code", {
	plugins: ["minify-builtins"]
});

var config = {
	dev: {
		uglify: {
			mangle: false
		},
		sass: {
			precision: 6
		},
		cssnano: {
			autoprefixer: {
				add: true,
				browsers: ['> 3%', 'last 2 versions', 'ie > 9', 'ios > 5', 'android > 3']
			},
			zindex: false,
            discardUnused: {fontFace: false},
            minifyFontValues: false,
            reduceIdents: false,
            reducePositions: false
		}
	},
	dist: {
		uglify: {
			mangle: true
		}
	}

};


gulp.task('sass-base', () =>  {
	return gulp.src(route + '/sass/*.scss')
		.pipe(sourcemaps.init())
    	.pipe(sass(config.dev.sass).on('error', sass.logError))
		.pipe(cssnano(config.dev.cssnano))
		.pipe(concat('main.min.css'))
		.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest(route + '/css'));
});

gulp.task('babel', () => {
	return gulp.src(route + '/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
			presets: ["minify"]
        }))
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(route + '/js/min'))
    
});

gulp.task('watch', function () {
	gulp.watch(route + '/sass/*.scss',gulp.series('sass-base'));
	gulp.watch(route + '/js/*.js',gulp.series('babel'));
	
});

gulp.task('default',gulp.series('sass-base','babel','watch'));

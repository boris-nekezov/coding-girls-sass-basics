/*====================================================================================================
 = Gulp plugins
====================================================================================================*/
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

// enable import modules
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const sass = require('gulp-sass');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');

browserify().transform("babelify", {presets: ["es2015"]});

/*====================================================================================================
 = Options
====================================================================================================*/

// downloaded libraries
const libs = 'node_modules';
// paths
const inputJs = 'web/src/js/';
const outputJs = 'web/assets/js/';
const inputScss = 'web/src/scss/';
const outputCss = 'web/assets/css/';

// watch destination and paths to scss libraries
const sassOpts = {
    outputStyle: 'compressed',
    includePaths: [
        libs + '/normalize-scss/scss',
        libs + '/font-awesome/scss/font-awesome.scss',
    ]
};

const autoprefixOpts = {
    browsers: ['last 2 versions', 'safari 5', 'ie 11', 'opera 12.1', 'ios 6', 'android 4'],
    cascade: false
};

/*====================================================================================================
 = Tasks
====================================================================================================*/


gulp.task('js', function () {
    // input settings
    const b = browserify({
        entries: inputJs + 'app.js',
        transform: babelify,
        debug: true
    });
    // output settings
    return b.bundle()
        .pipe(source('app.js'))
        .pipe(plumber())
        .pipe(buffer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputJs));
});


// production js without sourcemaps
gulp.task('js-prod', function () {
    // input settings
    const b = browserify({
        entries: inputJs + 'app.js',
        transform: babelify,
        debug: true
    });
    // output settings
    return b.bundle()
        .pipe(source('app.js'))
        .pipe(plumber())
        .pipe(buffer())
        .pipe(gulp.dest(outputJs));
});

// compile scss
gulp.task('sass', function () {
    return gulp
        .src(inputScss + 'app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on("error", notify.onError(function(error){ return "Error: " + error.message; })))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixOpts))
        .pipe(gulp.dest(outputCss));
});
// production scss without sourcemaps
gulp.task('sass-prod', function(){
    return gulp
        .src(inputScss + '/app.scss')
        .pipe(sass(sassOpts).on("error", notify.onError(function(error){ return "Error: " + error.message; })))
        .pipe(autoprefixer(autoprefixOpts))
        .pipe(gulp.dest(outputCss));
});

// compile on save
gulp.task('watch', ['sass', 'js'], function() {
    gulp.start('watch:scss', 'watch:js');
});
// compile js
gulp.task('watch:js', function(){
    return gulp
        .watch(inputJs + '**/*', ['js'])
        .on('change', function(event){
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
// compile scss
gulp.task('watch:scss', function(){
    return gulp
        .watch(inputScss + '**/*', ['sass'])
        .on('change', function(event){
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});


// default task copy js files, fontsawesome and compile production scss
gulp.task('default', [
    'js-prod',
    'sass-prod'
]);

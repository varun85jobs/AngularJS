var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    ngannotate = require('gulp-ng-annotate'),
    lazypipe = require('lazypipe'),
    revReplace = require('gulp-rev-replace'),
    del = require('del');

gulp.task('jshint', function () {
        gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function () {
    del.sync(['dist/**']);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('useref', 'imagemin', 'copyfonts');
});

var jsDistTask = lazypipe()
                .pipe(ngannotate)
                .pipe(uglify)
                .pipe(rev)
                ;

var cssDistTask = lazypipe()
                .pipe(minifycss)
                .pipe(rev)
                ;

gulp.task('useref', ['jshint'], function () {
    gulp.src('app/**/*.html')
         .pipe(useref())
         //.pipe(sourcemaps.init())
         .pipe(gulpif('*.js', jsDistTask()))
         .pipe(gulpif('*.css', cssDistTask()))
         .pipe(revReplace())
         //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function () {
    gulp.src('app/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copyfonts', function () {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

// Watch
gulp.task('watch', ['browser-sync'], function () {
    // Watch .js files
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['useref']);
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**/*']).on('change', browserSync.reload);
});
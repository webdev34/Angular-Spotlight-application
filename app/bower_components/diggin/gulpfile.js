'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var template = require('gulp-template');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var assert = require('assert');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var ngmin = require('gulp-ngmin');


gulp.task('init', function (cb) {

        assert(argv.appName, '--app-name is required');
        assert(argv.title, '--title is required');

        gulp.src(['bower.json', 'app/index.html', 'app/js/app.js'], {base: '.'})
                .pipe(template(argv))
                .pipe(gulp.dest('.'));

        exec('bower install', function (err, stdout, stderr) {

                gutil.log('bower', stdout);
                gutil.log('bower', stderr);
                cb(err);
        });
});

gulp.task('lint-js', function () {

        return gulp.src('app/js/**/*.js')
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('default'));
});

gulp.task('build-css', function () {

        return gulp.src('app/scss/{*,**/*}.scss')
                .pipe(sass())
                .pipe(gulp.dest('app/css'));
});

gulp.task('build-images', function () {

        gulp.src('app/images/**/*')
                .pipe(gulp.dest('build/images'));
});

gulp.task('build-workers', function () {

        gulp.src('app/js/workers/**/*.js')
                .pipe(useref.assets())
                .pipe(ngmin())
                .pipe(useref.restore())
                .pipe(useref())
                .pipe(gulp.dest('build/js/workers'));
});

gulp.task('build-contents', function () {

        gulp.src('app/*.json')
                .pipe(gulp.dest('build'));

        gulp.src('app/fonts/*')
                .pipe(gulp.dest('build/fonts'));
});

gulp.task('build', ['build-workers', 'build-css', 'build-images', 'build-contents'], function () {

        var jsFilter = filter('**/*.js');

        return gulp.src(['app/**/*.html', '!app/bower_components{,/**}'])
                .pipe(useref.assets())
                        .pipe(jsFilter)
                        .pipe(ngmin())
                        .pipe(uglify())
                        .pipe(jsFilter.restore())
                .pipe(useref.restore())
                .pipe(useref())
                .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {

        return gulp.src('build', {read: false})
                .pipe(clean());
});

gulp.task('dev', ['build-css'], function () {

        assert(argv.host, '--host is required, we suggest that you set this value to your Vagrant host machines local network address.');

        browserSync.init(
                [
                        'app/*',
                        'app/**/*',
                        '!app/**/*.scss',
                ],
                {
                        host: argv.host,
                        server: {
                                baseDir: 'app',
                        },
                        notify: false,
                        open: false,
                        // XXX: https://github.com/shakyShane/browser-sync/issues/68
                        ghostMode: false,
                }
        );

        gulp.watch('app/scss/{*,**/*}.scss', ['build-css']);

        gulp.watch('app/js/**.js', ['lint-js']);
});

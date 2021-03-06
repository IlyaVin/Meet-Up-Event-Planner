var gulp = require('gulp');
var concat = require('gulp-concat');
//var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
// html
var htmlmin = require('gulp-htmlmin');
// js
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
// css
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

var path = {
  HTML: './src/*.html',
  JS:   './src/js/**/*.js',
  CSS:  ['./src/scss/**/!(main)*.scss', './src/scss/main.scss'],
  DEST: './dist'
};

gulp.task('default', ['styles', 'scripts', 'html'], function () {
  gulp.watch(path.JS, ['scripts']);
  gulp.watch(path.CSS, ['styles']);
  gulp.watch(path.HTML, ['html']);

  browserSync.init({
    server: './dist'
  });
  browserSync.stream();
});

gulp.task('html', function() {
  return gulp.src(path.HTML)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.DEST))
    .pipe(browserSync.stream( {match: '**/*.html'} ));
});

gulp.task('styles', function() {
  return gulp.src(path.CSS)
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleanCSS())
		.pipe(concat('bundle.css'))
		//.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.DEST))
    .pipe(browserSync.stream( {match: '**/*.css'} ));
});

gulp.task('scripts', function() {
  return gulp.src(path.JS)
  //.pipe(sourcemaps.init())
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(uglify())
	//.pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.DEST))
  .pipe(browserSync.stream( {match: '**/*.js'} ));
});

'use strict';

const { series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

const styles = () => {
    return gulp.src('./src/styles/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/styles'));
}

const watchCSS = () => {
    gulp.watch('./src/styles/**/*.scss', gulp.series('sass'));
}

gulp.task('sass', styles);
gulp.task('sass:watch', watchCSS);

const build = gulp.series(styles, watchCSS);

module.exports.default = build;

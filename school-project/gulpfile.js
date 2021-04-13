'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const svgSprite = require( 'gulp-svg-sprite' );
const replace = require( 'gulp-replace' );
const fs = require( 'fs' );                              // Работа с файловой структурой
const log = require( 'fancy-log' )

const src = './src';
const build ='./build';

const sprites = () => {
	return gulp.src( `${ src }/images/sprite_src/sprites/**/*.svg`)
		.pipe( svgSprite( {
			shape: {
				id: {
					separator: '-',
					generator: 'svg-%s' // Генерация класса для иконки svg-name-icon
				},
			},
			mode: {
				symbol: {
					dest: '',
					sprite: `./images/sprite_src/sprite.svg`, // Генерация файла svg
					inline: true,
					render: {
						scss: {
							template: './config/sprite/tmpl_scss.mustache', // Настройка стилей для спрайта
							dest: `./styles/_sprites/` // Генерация файла стилей для спрайта
						}
					}
				}
			},
			variables: { // Базовая настройка
				baseFz: 20,
				prefixStatic: 'svg-'
			}
			} ) )
		.pipe( gulp.dest( `${ src }/` ) );

}

const svg_inline_build = () => {
	return gulp.src(`${ src }/index.html`)
		.pipe(replace(/<div id="svg_inline">(?:(?!<\/div>)[^])*<\/div>/g, () => {      // Поиск div с id svg_inline для того что бы вставить содержимое файла ./images/sprite_src/sprite.svg
			const svgInline = fs.readFileSync(`${src}/images/sprite_src/sprite.svg`, 'utf8');      // Открываем файл
			return '<div id="svg_inline">\n' + svgInline + '\n</div>';       // Вставляем в div с id svg_inline содержимое файла ./images/sprite_src/sprite.svg
		}))
		.on('error', err => {
			log.error(err.message);
		})
		.pipe(gulp.dest(`${ build }`));

}

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

const buildCSS = gulp.series(styles, watchCSS);

exports.svgInlineBuild = svg_inline_build;
exports.sprite = sprites;

exports.default = buildCSS;

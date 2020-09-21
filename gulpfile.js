var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var notify          = require("gulp-notify");
var pug 		        = require('gulp-pug');
var rename          = require('gulp-rename');
var autoprefixer    = require('gulp-autoprefixer');
var gcmq 	  	      = require('gulp-group-css-media-queries');
var newer           = require('gulp-newer');
var clean           = require('gulp-clean');
// var concat          = require('gulp-concat');

const dir = {
    src         : 'src/',
    build       : 'dist/'
};

const php = {
    src           : dir.src + 'php/**/*.php',
    build         : dir.build
};

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./dist"
      }
  });
});

// SASS task
gulp.task('sass', function() {
	// return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	return gulp.src(dir.src + 'sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 5 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('src/css')) // папака в которую складывают уже готовые css стили
  .pipe(browserSync.reload({ stream: true }))
});

gulp.task("pug", function() {
  return gulp
    .src([
      "src/pug/**/*.pug",
      "!src/pug/layouts/*.*",
      "!src/pug/modules/**/*.*",
      "!src/pug/mixins/**/*.*"
    ])
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('allcss', async function(){
    return gulp.src(dir.src + 'css/all.css')
        .pipe(newer(dir.build + 'css/all.css'))
        .pipe(gulp.dest(dir.build + 'css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('gcmq', async function () {
    return gulp.src(dir.src + 'css/main.min.css')
        .pipe(gcmq())
        .pipe(gulp.dest(dir.build + 'css/'))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('files', async function(){
  return gulp.src([dir.src + 'css/**/*.*', "!src/css/main.min.css"])
      .pipe(newer(dir.src + 'css/**/*.*'))
      .pipe(gulp.dest(dir.build + 'css/'))
});

gulp.task('img', async function(){
  return gulp.src(dir.src + 'img/**/*.*')
      .pipe(newer(dir.src + 'img/**/*.*'))
      .pipe(gulp.dest(dir.build + 'img/'))
});

gulp.task('fonts', async function(){
  return gulp.src(dir.src + 'fonts/**/*.*')
      .pipe(newer(dir.src + 'fonts/**/*.*'))
      .pipe(gulp.dest(dir.build + 'fonts/'))
});


gulp.task('clean', function () {
  return gulp.src(dir.build, {read: false})
      .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch(dir.src + 'css/**/*.*', gulp.parallel('files'));
    gulp.watch(dir.src + 'img/**/*.*', gulp.parallel('img'));
    gulp.watch(dir.src + 'fonts/**/*.*', gulp.parallel('fonts'));
    gulp.watch([dir.src + 'sass/**/*.sass', dir.src + 'pug/modules/**/*.{sass,scss}'], gulp.parallel('sass'));
    gulp.watch("src/pug/**/*.pug", gulp.parallel("pug"));
    // gulp.watch(dir.src + 'sass-style/style-style.sass', gulp.parallel('styles'));
    // gulp.watch(dir.src + 'sass-style/style-style.css', gulp.parallel('concat'));
    gulp.watch(dir.src + 'css/main.min.css', gulp.parallel('gcmq'));
    // gulp.watch(dir.src + 'css/*.css', gulp.parallel('social-link', 'allcss', 'font-awesomecss'));
});

// gulp.task('default', gulp.parallel('sass', 'styles', 'gcmq', 'php', 'concat', 'watch', 'browser-sync'));
gulp.task('default', gulp.parallel('files', 'img', 'fonts', 'sass', 'gcmq', 'pug', 'browser-sync','watch'));
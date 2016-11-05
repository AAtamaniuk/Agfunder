var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
// var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var ghPages = require('gulp-gh-pages');

var browsers = [
    "last 1 version",
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Opera versions",
    "last 2 Edge versions",
    "ie 11",
    "ie 10"
];

gulp.task("style", function() {
  gulp.src("src/sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: browsers}),
    mqpacker({
      sort: true
    })
  ]))
  .pipe(gulp.dest("build/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"));
  //.pipe(server.reload({stream: true}));
});

gulp.task("style:dev", function() {
  gulp.src("src/sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: browsers})
  ]))
  .pipe(gulp.dest("src/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("src/css"));
  //.pipe(server.reload({stream: true}));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("symbols.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

//gulp.task("serve", function(){
//  server.init ({
//    server: "build"
//  });
//  gulp.watch("sass/**/*.scss", ["style"]);
//  gulp.watch(".html")
//  .on("change", server.reload);
//});

gulp.task("copy", function(){
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/*.html"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function(){
  return del("build");
});

gulp.task("build", function(fn) {
  run("clean",
      "copy",
      "style",
      "images",
      "symbols",
      fn
     );
});

gulp.task('watcher', function () {
  gulp.start("style");
  gulp.watch('src/sass/**/*.scss', ['style:dev']);
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['watcher']);

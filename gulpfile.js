var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var pngquant = require('imagemin-pngquant');
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var reload = server.reload;

var browsers = [
    "last 1 version",
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Opera versions",
    "last 2 Edge versions",
    "ie 11",
    "ie 10"
];

var path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: { //Пути откуда брать исходники
    html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
    style: 'src/sass/style.scss',
    img: 'build/img/**/*.{png,jpg,gif}', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: 'src/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

// Build for HTML
gulp.task('html:build', function () {
  gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// Build for JS
gulp.task('js:build', function () {
  gulp.src(path.src.js) //Найдем наш main файл
    .pipe(rigger()) //Прогоним через rigger
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
    .pipe(uglify()) //Сожмем наш js
    .pipe(sourcemaps.write()) //Пропишем карты
    .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
    .pipe(reload({stream: true})); //И перезагрузим сервер
});

// Build for style
gulp.task("style:build", function() {
  gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(sourcemaps.init())
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
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));
});

gulp.task("image:build", function() {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

/*gulp.task('image:build', function () {
  gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      // svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({stream: true}));
});*/

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("symbols.svg"))
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
    "src/css/**",
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
  gulp.start("style:dev");
  gulp.watch('src/sass/**/*.scss', ['style:dev']);
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['watcher']);

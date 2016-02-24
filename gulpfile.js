'use strict';

// Load plugins
var gulp         = require('gulp'),

    // Utility plugins
    util         = require('gulp-util'),
    del          = require('del'),
    merge        = require('merge-stream'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    path         = require('path'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync'),
    fs           = require('fs'),


    // HTML plugins
    htmlmin      = require('gulp-htmlmin'),
    inlineSource = require('gulp-inline-source'),
    RevAll       = require('gulp-rev-all'),
    html5lint    = require('gulp-html5-lint'),

    // CSS plugins
    sass         = require('gulp-sass'),
    nano         = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    scsslint     = require('gulp-scss-lint'),

    // JS plugins
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    modernizr    = require('modernizr'),
    eslint       = require('gulp-eslint'),
    tslint       = require("gulp-tslint"),
    ts           = require("gulp-typescript"),

    // Image plugins
    imagemin     = require('gulp-imagemin'),
    svgSprite    = require('gulp-svg-sprite');

// Allows gulp --dist to be run for production compilation
var isProduction = util.env.dist;

var onError = notify.onError("Error: <%= error.message %>");

// Base paths
var basePaths = {
  vendor : './node_modules/',
  src    : './src/',
  test   : './test/',
  release: './release/',
};

// paths definitions
var srcFiles = {
  scss     : [
    'scss/style.scss',
  ],
//  js       : [
//    'js/app.js',
//    'js/vendor.js',
//  ],
  ts       : [
    'ts/**.ts',
  ],
  img      : [
    'img/**',
  ],
  sprite   : [
    'sprite/*.svg',
  ],
  html     : [
    'index.html',
  ],
  misc     : [],
  modernizr: 'js/app/modernizr.js',
};

gulp.task('clean', function (cb) {
  del([
    basePaths.test,
    basePaths.release,
  ], cb);
});

gulp.task('scss', ['scsslint'], function () {
  return gulp.src(srcFiles.scss, {cwd: basePaths.src})
    .pipe(plumber({errorHandler: onError}))
    .pipe(isProduction ? util.noop() : sourcemaps.init())
    .pipe(sass({
      includePaths: [basePaths.vendor],
      outputStyle : 'compressed',
    }))
    .pipe(nano({
      discardComments: {removeAll: true},
      discardUnused  : {fontFace: false},
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 10'],
      cascade : false,
    }))

    .pipe(isProduction ? util.noop() : sourcemaps.write('.'))
    .pipe(gulp.dest(basePaths.test + 'css'))
    .pipe(browserSync.stream({match: '**/*.css'}));

});

gulp.task('js', ['modernizr', 'eslint'], function () {
  var mergedStream = merge();

  srcFiles.js.forEach(function (val) {
    var src = require(basePaths.src + val);
    var stream = gulp.src(src, {cwd: basePaths.src + 'js'})
      .pipe(plumber({errorHandler: onError}))
      .pipe(isProduction ? util.noop() : sourcemaps.init())
      .pipe(concat(path.basename(val)))
      .pipe(isProduction ? uglify() : util.noop())
      .pipe(isProduction ? util.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(basePaths.test + 'js'));

    mergedStream.add(stream);
  });

  return mergedStream;
});

gulp.task('ts', ['tslint'], function () {
  var tsProject = ts.createProject('./tsconfig.json');
  var tsResult = tsProject.src() // instead of gulp.src(...)
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest(basePaths.test + 'js'));
});

gulp.task("tslint", function () {
  return gulp.src(basePaths.src + '**.ts')
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

gulp.task('img', function () {
  return gulp.src(srcFiles.img, {cwd: basePaths.src})
    .pipe(plumber({errorHandler: onError}))
    .pipe(imagemin())
    .pipe(gulp.dest(basePaths.test + 'img'));
});

gulp.task('sprite', function () {
  return gulp.src(srcFiles.sprite, {cwd: basePaths.src})

    .pipe(plumber({errorHandler: onError}))
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest   : '.',
          sprite : 'sprite.svg',
          example: false,
        },
      },
    }))
    .pipe(gulp.dest(basePaths.test + 'img'));
});

gulp.task('html', ['scss', 'js'], function () {
  return gulp.src(srcFiles.html, {cwd: basePaths.src})
    .pipe(plumber({errorHandler: onError}))
    .pipe(isProduction ? inlineSource({
      rootpath: basePaths.test,
    }) : util.noop())
    .pipe(htmlmin({
      collapseBooleanAttributes    : true,
      collapseWhitespace           : true,
      removeAttributeQuotes        : true,
      removeCDATASectionsFromCDATA : true,
      removeComments               : true,
      removeCommentsFromCDATA      : true,
      removeEmptyAttributes        : true,
      removeOptionalTags           : true,
      removeRedundantAttributes    : true,
      removeScriptTypeAttributes   : true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype              : false,
    }))
    .pipe(gulp.dest(basePaths.test));
});

gulp.task('misc', function () {
  return gulp.src(srcFiles.misc, {
      cwd : basePaths.src,
      base: basePaths.src,
    })
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulp.dest(basePaths.test));
});

gulp.task('modernizr', function (cb) {
  modernizr.build({
    'classPrefix'    : '',
    'options'        : [
      'setClasses',
    ],
    'feature-detects': [
      'css/flexbox',
    ],
  }, function (result) {
    fs.writeFile(basePaths.src + srcFiles.modernizr, result, function (err) {
      if (err) {
        return cb(err);
      }

      /*eslint no-console: 0*/
      console.log('modernizr.js is generated');
      cb();
    });
  });
});

// Default task
gulp.task('default', Object.keys(srcFiles));

gulp.task('release', ['default'], function () {
  // Revise all files
  var revAll = new RevAll({
    dontGlobal    : [
      'humans.txt',
      'robots.txt',
      'rocwang.pdf',
      'favicon.ico',
      'sitemap.txt',
    ],
    dontRenameFile: [
      'index.html',
    ],
  });

  return gulp.src(basePaths.test + '**')
    .pipe(revAll.revision())
    .pipe(gulp.dest(basePaths.release));
});

// Watch task
gulp.task('watch', ['default'], function () {

  Object.keys(srcFiles).forEach(function (element) {
    var watchedFiles;
    switch (element) {
      case 'scss':
        watchedFiles = 'scss/**';
        break;
      case 'js':
        watchedFiles = 'js/**';
        break;
      default :
        watchedFiles = srcFiles[element];
        break;
    }

    gulp.watch(watchedFiles, {cwd: basePaths.src}, [element]);
  });

  gulp.watch(['js/*.js', 'img/**', '*.html'], {cwd: basePaths.test}, browserSync.reload);

  browserSync({
    server: {
      baseDir: basePaths.test,
    },
    open  : false,
  });
});

gulp.task('eslint', function () {
  return gulp.src([
      'gulpfile.js',
      basePaths.src + 'js/**/*.js',
      '!' + basePaths.src + srcFiles.modernizr,
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scsslint', function () {
  return gulp.src([
      basePaths.src + 'scss/**/*.scss',
      '!' + basePaths.src + 'scss/vendor-var/_bootstrap.scss',
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
});

gulp.task('html5lint', function () {
  return gulp.src(basePaths.release + srcFiles.html)
    .pipe(html5lint());
});


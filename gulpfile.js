var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpNgConfig = require('gulp-ng-config');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');

var app = {
    name: "App",
    rootDir: "./app/",
    assetsDir: "./assets/",
    cssDir: "./assets/css/",
    jsDir: "./assets/js/",
    configFile: "./configFile.json",
    bowerDir: "./bower_components/"
};

gulp.task('concat', function () {
    return gulp.src(app.cssDir + '*.min.css')
            .pipe(concat('all.min.css'))
            .pipe(gulp.dest(app.assetsDir))
        && gulp.src(app.jsDir + '*.min.js')
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(app.assetsDir));
});

gulp.task('devConfig', function () {
    gulp.src(app.configFile)
        .pipe(gulpNgConfig(app.name+'.config', {
            environment: 'dev'
        }))
        .pipe(gulp.dest(app.rootDir))
});

gulp.task('prodConfig', function () {
    gulp.src(app.configFile)
        .pipe(gulpNgConfig(app.name+'.config', {
            environment: 'prod'
        }))
        .pipe(gulp.dest(app.rootDir))
});

gulp.task('indexDev', ['devConfig'], function () {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src([app.cssDir + '*.min.css', app.jsDir + '*.min.js'], {read: false});

    return gulp.src("./index.html")
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(inject(sources))
        .pipe(gulp.dest("."));
});

gulp.task('indexProd', ['concat', 'prodConfig'], function () {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src([app.assetsDir + 'all.min.css', app.assetsDir + 'all.min.js'], {read: false});

    return gulp.src("./index.html")
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(inject(sources))
        .pipe(gulp.dest("."));
});

gulp.task('watch', function () {
    gulp.watch(app.cssDir + '*.min.css', ['indexDev']);
    gulp.watch(app.jsDir + '*.min.js', ['indexDev']);
    gulp.watch(app.configFile, ['indexDev'])
});

gulp.task('default', ['watch', 'indexDev']);
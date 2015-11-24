var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpNgConfig = require('gulp-ng-config');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');

var app = {
    name: "project",
    rootDir: "./app/",
    assetsDir: "./assets/",
    cssDir: "./assets/css/",
    jsDir: "./assets/js/",
    jsCmpntDir: ["./assets/dump/*.min.js","./assets/dump/*.css"],//array con assets sin bower o npm
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

gulp.task('devIndex', ['devConfig'], function () {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(app.jsCmpntDir.concat([app.cssDir + '*.min.css', app.jsDir + '*.min.js', app.rootDir + 'configFile.min.js', app.rootDir + 'app.js']), {read: false});

    return gulp.src("./index.html")
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(inject(sources))
        .pipe(gulp.dest("."));
});

gulp.task('prodIndex', ['concat', 'prodConfig'], function () {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(app.jsCmpntDir.concat([app.assetsDir + 'all.min.css', app.assetsDir + 'all.min.js', app.rootDir + 'configFile.min.js', app.rootDir + 'app.min.js']), {read: false});

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
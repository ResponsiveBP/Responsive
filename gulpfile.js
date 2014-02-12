// Include gulp
var gulp = require("gulp");

// Install Tools
var es = require('event-stream'),
    path = require("path");

// Include Our Plugins
var jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    minifyCSS = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    clean = require("gulp-clean"),
    zip = require("gulp-zip");

var cssSrc = [
    "./src/css/copyright.css",
    "./src/css/normalize.css",
    "./src/css/base.css",
    "./src/css/grid-base.css",
    "./src/css/grid-small.css",
    "./src/css/grid-medium.css",
    "./src/css/grid-large.css",
    "./src/css/lists.css",
    "./src/css/tables.css",
    "./src/css/tablelist.css",
    "./src/css/alerts.css",
    "./src/css/media.css",
    "./src/css/forms.css",
    "./src/css/buttons.css",
    "./src/css/code.css",
    "./src/css/dropdown.css",
    "./src/css/autosize.css",
    "./src/css/carousel.css",
    "./src/css/tabs.css",
    "./src/css/lightbox.css",
    "./src/css/helpers-base.css",
    "./src/css/helpers.css",
    "./src/css/print.css"];

var jsSrc = ["./src/js/responsive.core.js",
             "./src/js/responsive.autosize.js",
             "./src/js/responsive.carousel.js",
             "./src/js/responsive.dismiss.js",
             "./src/js/responsive.dropdown.js",
             "./src/js/responsive.lightbox.js",
             "./src/js/responsive.table.js",
             "./src/js/responsive.tabs.js"];

// Concatenate & Minify CSS
gulp.task("css", function (cb) {
    gulp.src(cssSrc)
        .pipe(concat("responsive.css"))
        .pipe(gulp.dest("./build"))
        .pipe(rename("responsive.min.css"))
        .pipe(minifyCSS())
        .pipe(gulp.dest("./build"))
        .on("end", cb);
});

// Concatenate & Minify JS
gulp.task("scripts", function (cb) {

    es.concat(
    // Lint
    gulp.src("./src/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default")),

    gulp.src("./src/js/responsive.ie10mobilefix.js")
        .pipe(concat("responsive.ie10mobilefix.js"))
        .pipe(gulp.dest("./build"))
        .pipe(rename("responsive.ie10mobilefix.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./build")),

    gulp.src(jsSrc)
        .pipe(concat("responsive.js"))
        .pipe(gulp.dest("./build"))
        .pipe(rename("responsive.min.js"))
        .pipe(uglify({ preserveComments: "some" }))
        .pipe(gulp.dest("./build"))

        ).on("end", cb);
});

gulp.task("clean", ["css", "scripts"], function (cb) {

    gulp.src("./dist/responsive.zip", { read: false })
        .pipe(clean())
        .on("end", cb);
});

gulp.task("zip", ["clean"], function (cb) {

    gulp.src(["*", "vendor/*"], { cwd: path.join(process.cwd(), "build") })
        .pipe(zip("responsive.zip"))
        .pipe(gulp.dest("./dist"))
        .on("end", cb);
});

gulp.task("finalize", ["zip"], function () {
    // Cleanup rogue vendor folder production.
    gulp.src("./dist/vendor/", { read: false })
        .pipe(clean({ force: true }));
});

// Default Task
gulp.task("watch", function () {
    // Watch For Changes To Our JS
    gulp.watch("./src/js/*.js", ["scripts"]);

    // Watch For Changes To Our CSS
    gulp.watch("./src/css/*.css", ["css"]);
});

gulp.task("default", ["css", "scripts"]);

gulp.task("release", ["finalize"]);

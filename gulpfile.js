// Include gulp
var gulp = require("gulp");

// Install tools and plugins.
var es = require("event-stream"),
    path = require("path"),
    plugins = require("gulp-load-plugins")();

// Set paths
var basePath = {
    src: "./src/",
    build: "./build/",
    dist: "./dist/"
},
	path = {
	    css: {
	        src: basePath.src + "css/",
	        build: basePath.build + "css/",
	        dist: basePath.dist + "css/"
	    },
	    sass: {
	        src: basePath.src + "sass/",
	        build: basePath.build + "sass/",
	        dist: basePath.dist + "sass/"
	    },
	    js: {
	        src: basePath.src + "js/",
	        build: basePath.build + "js/",
	        dist: basePath.dist + "js/"
	    },
	    img: {
	        src: basePath.src + "img/",
	        build: basePath.build + "img/",
	        dist: basePath.dist + "img/"
	    }
	};

var cssSrc = [
    path.css.src + "copyright.css",
    path.css.src + "normalize.css",
    path.css.src + "base.css",
    path.css.src + "grid-base.css",
    path.css.src + "grid-small.css",
    path.css.src + "grid-medium.css",
    path.css.src + "grid-large.css",
    path.css.src + "lists.css",
    path.css.src + "tables.css",
    path.css.src + "tablelist.css",
    path.css.src + "alerts.css",
    path.css.src + "media.css",
    path.css.src + "forms.css",
    path.css.src + "buttons.css",
    path.css.src + "code.css",
    path.css.src + "dropdown.css",
    path.css.src + "autosize.css",
    path.css.src + "carousel.css",
    path.css.src + "modal.css",
    path.css.src + "tabs.css",
    path.css.src + "lightbox.css",
    path.css.src + "helpers-base.css",
    path.css.src + "helpers.css",
    path.css.src + "print.css"
];

var sassSrc = path.sass.src + "responsive.scss";

var jsSrc = [
    path.js.src + "responsive.core.js",
    path.js.src + "responsive.autosize.js",
    path.js.src + "responsive.carousel.js",
    path.js.src + "responsive.dismiss.js",
    path.js.src + "responsive.dropdown.js",
    path.js.src + "responsive.modal.js",
    path.js.src + "responsive.lightbox.js",
    path.js.src + "responsive.table.js",
    path.js.src + "responsive.tabs.js"
];

// Concatenate & Minify CSS
gulp.task("css", function (cb) {
    gulp.src(cssSrc)
        .pipe(plugins.concat("responsive.css"))
        .pipe(gulp.dest(path.css.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(path.css.build))
        .on("end", cb);
});

// Concatenate & Minify SCSS
gulp.task("sass", function (cb) {
    gulp.src(sassSrc)
        .pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true }))
        .pipe(plugins.autoprefixer("last 2 version", "> 1%", "ie 8", { cascade: true }))
        .pipe(gulp.dest(path.sass.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(path.sass.build))
        .on("end", cb);
});

// Concatenate & Minify JS
gulp.task("scripts", function (cb) {

    es.concat(
    // Lint
    gulp.src(path.js.src + "*.js")
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter("default")),

    gulp.src(path.js.src + "responsive.ie10mobilefix.js")
        .pipe(gulp.dest(path.js.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.uglify({ preserveComments: "some" }))
        .pipe(gulp.dest(path.js.build)),

    gulp.src(jsSrc)
        .pipe(plugins.concat("responsive.js"))
        .pipe(gulp.dest(path.js.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.uglify({ preserveComments: "some" }))
        .pipe(gulp.dest(path.js.build))

        ).on("end", cb);
});

gulp.task("clean", ["css", "sass", "scripts"], function (cb) {

    gulp.src("./dist/responsive.zip", { read: false })
        .pipe(clean())
        .on("end", cb);
});

gulp.task("zip", ["clean"], function (cb) {

    gulp.src(basePath.build + "**/*")
        .pipe(plugins.zip("responsive.zip"))
        .pipe(gulp.dest(basePath.dist))
        .on("end", cb);
});

gulp.task("watch", function () {
    // Watch for changes to our JS
    gulp.watch(path.js.src + "**/*.js", ["scripts"]);

    // Watch for changes to our SASS
    gulp.watch(path.sass.src + "**/*.scss", ["sass"]);

    // Watch for changes to our CSS
    gulp.watch(path.css.src + "**/*.css", ["css"]);
});

gulp.task("release", ["zip"]);

// Default Task
gulp.task("default", ["css", "sass", "scripts"]);
// Include gulp
var gulp = require("gulp");

// Install tools and plugins.
var es = require("event-stream"),
    del = require("del"),
    path = require("path"),
    plugins = require("gulp-load-plugins")();

// Set paths
var basePath = {
    src: "./src/",
    build: "./build/",
    dist: "./dist/"
},
	path = {
	    sass: {
	        src: basePath.src + "sass/",
	        build: basePath.build
	    },
	    js: {
	        src: basePath.src + "js/",
	        build: basePath.build
	    }
	};

var sassSrc = path.sass.src + "responsive.scss";

var jsSrc = [
    path.js.src + "responsive.core.js",
    path.js.src + "responsive.autosize.js",
    path.js.src + "responsive.carousel.js",
    path.js.src + "responsive.conditional.js",
    path.js.src + "responsive.dismiss.js",
    path.js.src + "responsive.dropdown.js",
    path.js.src + "responsive.modal.js",
    path.js.src + "responsive.tablelist.js",
    path.js.src + "responsive.tabs.js"
];

// Concatenate & Minify SCSS
gulp.task("sass", function (cb) {
    gulp.src(sassSrc)
        //.pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true, "sourcemap=none": true })) //hack to allow autoprefixer to work
        .pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true, sourcemap: false })) 
        .pipe(plugins.autoprefixer({
            browsers: ["> 1%", "last 2 versions", "ie 9"],
            cascade: true,
            remove: false
        }))
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

    gulp.src(jsSrc)
        .pipe(plugins.concat("responsive.js"))
        .pipe(gulp.dest(path.js.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.uglify({ preserveComments: "some" }))
        .pipe(gulp.dest(path.js.build))

        ).on("end", cb);
});

gulp.task("clean", ["sass", "scripts"], function (cb) {
    del("./dist/responsive.zip", cb);
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

    // Watch for changes to our Sass
    gulp.watch(path.sass.src + "**/*.scss", ["sass"]);

});

gulp.task("release", ["zip"]);

// Default Task
gulp.task("default", ["sass", "scripts"]);

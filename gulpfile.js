var gulp = require("gulp");
var uglify = require("gulp-uglify");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var replace = require("gulp-html-replace");
var minHTML = require("gulp-minify-html");
var minCSS = require("gulp-minify-css");
var concat = require("gulp-concat");
var imageMin = require("gulp-imagemin");
var browserSync = require("browser-sync").create();
var src = "SS/";
var out = "dist/client/";
var prod = false;

gulp.task("html", function (done) {
	// Select the HTML index, replace the script sources, minify, and move to dist
	if (prod)
		return gulp.src(src+"index.html")
			.pipe(replace({
				libs: "<script src=\"js/libs.js \"></script>",
				js: "<script src=\"js/index.js\"></script>"
			}))
			.pipe(minHTML())
			.pipe(gulp.dest(out));
	else done();
});

gulp.task("css", function (done) {
	// Select the CSS, minify, and move to dist
	if (prod)
		return gulp.src(src+"css/*.css")
			.pipe(minCSS())
			.pipe(gulp.dest(out+"css/"));
	else done();
});

gulp.task("ts", function () {
	if (prod)
		return gulp.src(src+"js/*.ts")
			.pipe(concat("index.ts"))
			.pipe(ts())
			.pipe(uglify())
			.pipe(gulp.dest(out+"js/"));
	else
		return gulp.src(src+"js/*.ts")
			.pipe(sourcemaps.init())
			.pipe(ts())
			.pipe(sourcemaps.write(".", {sourceRoot: src+"js"}))
			.pipe(gulp.dest(src+"js/"))
			.pipe(browserSync.stream());
});

gulp.task("static", function (done) {	
	if (prod) {
		gulp.src("SS/lib/*.js")
			.pipe(concat("libs.js"))
			.pipe(uglify({ mangle: false }))
			.pipe(gulp.dest(out+"js/"));

		gulp.src("SS/images/*")
			.pipe(imageMin())
			.pipe(gulp.dest(out+"images/"));
			
		gulp.src("SS/images/arrows/*")
			.pipe(imageMin())
			.pipe(gulp.dest(out+"images/arrows/"));

		gulp.src("SS/sounds/*")
			.pipe(gulp.dest(out+"sounds/"));
	}

	done();
});

gulp.task("watch",  function (done) {
	gulp.watch([src+"js/*.ts"], gulp.series("ts"));

	gulp.watch([src+"css/*.css"], gulp.series("css"));

	gulp.watch([src+"index.html"], gulp.series("html"));

	done();
});

gulp.task("start", function(done) {
	browserSync.init({
		server: "./"+src
	});
});

gulp.task("server", function() {
	prod = true;
	return gulp.src("server.ts")
			.pipe(ts())
			.pipe(uglify())
			.pipe(gulp.dest(out.split("/")[0]+"/"));
});

gulp.task("build:dev", gulp.series(gulp.parallel("html", "css", "ts", "static"), "watch", "start"));
gulp.task("build:prod", gulp.series("server", gulp.parallel("html", "css", "ts", "static")));
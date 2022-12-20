var gulp = require("gulp");
var uglify = require("gulp-uglify");
var ts = require("gulp-typescript");
var replace = require("gulp-html-replace");
var minHTML = require("gulp-minify-html");
var minCSS = require("gulp-minify-css");
var concat = require("gulp-concat");
var imageMin = require("gulp-imagemin");
//var rsync = require("gulp-rsync");
var browserSync = require("browser-sync").create();
var client = "dist/";

gulp.task("html", function () {
	// Select the HTML index, replace the script sources, minify, and move to dist
	return gulp.src("SS/SS/index.html")
		.pipe(replace({
			libs: "<script src=\"js/libs.js \"></script>",
			js: "<script src=\"js/index.js\"></script>"
		}))
		.pipe(minHTML())
		.pipe(gulp.dest(client))
		.pipe(browserSync.stream());
});

gulp.task("css", function () {
	// Select the CSS, minify, and move to dist
	return gulp.src("SS/SS/css/*.css")
		.pipe(minCSS())
		.pipe(gulp.dest(client+"css/"))
		.pipe(browserSync.stream());
});

gulp.task("ts", function () {
	return gulp.src("SS/SS/js/*.ts")
		.pipe(concat("index.ts"))
		.pipe(ts())
		.pipe(uglify())
		.pipe(gulp.dest(client+"js/"))
		.pipe(browserSync.stream());
});

gulp.task("static", function (done) {	
	gulp.src("SS/SS/lib/*.js")
		.pipe(concat("libs.js"))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest(client+"js/"));

	gulp.src("SS/SS/images/*")
		.pipe(imageMin())
		.pipe(gulp.dest(client+"images/"));
		
	gulp.src("SS/SS/images/arrows/*")
		.pipe(imageMin())
		.pipe(gulp.dest(client+"images/arrows/"));

	gulp.src("SS/SS/sounds/*")
		.pipe(gulp.dest(client+"sounds/"));

	done();
});

gulp.task("watch",  function (done) {
	gulp.watch(["SS/SS/js/*.ts"], gulp.series("ts"));

	gulp.watch(["SS/SS/css/*.css"], gulp.series("css"));

	gulp.watch(["SS/SS/index.html"], gulp.series("html"));
	done();
});

gulp.task("start", function(done) {
	browserSync.init({
		server: "./dist"
	});
})

gulp.task("build:dev", gulp.series(gulp.parallel("html", "css", "ts", "static"), "watch", "start"));
gulp.task("build:prod", gulp.parallel("html", "css", "ts", "static"));

// gulp.task("deploy", gulp.series("build:prod"), function () {
// 	gulp.src("dist/")
// 		.pipe(rsync({
// 			root: "dist",
// 			hostname: "gl0vgames.com",
// 			destination: "/usr/share/nginx/ss/",
// 			username: "root",
// 			incremental: true,
// 			progress: true,
// 			recursive: true
// 	}));
// });

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var ts = require("gulp-typescript");
var replace = require("gulp-html-replace");
var minHTML = require("gulp-minify-html");
var minCSS = require("gulp-minify-css")
var concat = require("gulp-concat");
var imageMin = require("gulp-imagemin");
var rsync = require("gulp-rsync");
//var obfuscate = require("gulp-obfuscate");

gulp.task("build", function () {
//	Select the HTML index, replace the script sources, minify, and move to dist
	gulp.src("SS/SS/index.html")
		.pipe(replace({
			jquery: "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js \"></script>",
			js: "<script src=\"js/index.js\"></script>"
		}))
		.pipe(minHTML())
		.pipe(gulp.dest("dist/"));

//	Select the CSS, minify, and move to dist
	gulp.src("SS/SS/css/*.css")
		.pipe(minCSS())
		.pipe(gulp.dest("dist/css/"));

	gulp.src(["SS/SS/js/ArgyleEngine.ts", "SS/SS/js/game.ts", "SS/SS/js/NPC.js", "SS/SS/js/player.ts", "SS/SS/js/Teleporter.ts"])
		.pipe(concat("index.ts"))
		.pipe(ts())
//		.pipe(obfuscate())
		.pipe(uglify())
		.pipe(gulp.dest("dist/js/"));

	gulp.src("SS/SS/images/*")
		.pipe(imageMin())
		.pipe(gulp.dest("dist/images/"));

	gulp.src("SS/SS/sounds/*")
		.pipe(gulp.dest("dist/sounds/"));

});

gulp.task("deploy", function () {
	gulp.src("dist/")
		.pipe(rsync({
			root: "dist",
			hostname: "gl0vgames.com",
			destination: "/usr/share/nginx/ss/",
			username: "root",
			incremental: true,
			progress: true,
			recursive: true
	}));
});

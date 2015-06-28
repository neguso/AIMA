var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyjs = require('gulp-uglify');


gulp.task('js', function() {
	gulp.src('www/js/*.js')
		.pipe(concat('all.min.js'))
		.pipe(minifyjs())
		.pipe(gulp.dest('www/js'));
});



gulp.task('default', ['js']);
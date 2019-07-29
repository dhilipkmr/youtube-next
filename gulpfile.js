var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var fs = require('fs');

gulp.task('scriptsMinifier', function() {
  gulp.src('./background.js')
    .pipe(concat('background.js'))
    // Minify the file
    .pipe(uglify())
    // Output to Destination Directory
    .pipe(gulp.dest('./dist/'));

  return gulp.src('./content.js')
    // Group all the file into one
    .pipe(concat('content.js'))
    // Minify the file
    .pipe(uglify())
    // Output to Destination Directory
    .pipe(gulp.dest('./dist/'));
});
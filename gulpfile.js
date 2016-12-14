var gulp = require('gulp')
var ejs = require('gulp-ejs')

gulp.task('build', build)

function build() {
  return gulp.src('./install/*.ejs')
    .pipe(ejs(
      {
        dnsPort: 20565,
        httpPort: 20558,
        cwd: process.cwd()
      },
      { ext: '' }
    ))
    .pipe(gulp.dest('./install/'))
}

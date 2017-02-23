var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  webpack = require('webpack-stream'),
  env = process.env,
  isProduction = env.NODE_ENV === 'production' ? true : false,
  cleanCSS = require('gulp-clean-css');

gulp.task('sass', function () {
  gulp.src('./public/css/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/dist'))
    .pipe(livereload());
});

gulp.task('build-css', function(){
  gulp.src('./public/css/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cleanCSS({}))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/js/*.js', ['build-js']);
});

gulp.task('build-js', function() {
  return gulp.src('public/js/**/*.js')
    .pipe(webpack({
      resolve: {
        modulesDirectories: ["node_modules", "components"],
      },
      output: {
        filename: "bundle.js"
      },
      plugins: [
        new webpack.webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.webpack.optimize.UglifyJsPlugin({
          minimize: isProduction ? true : false,
          sourceMap: isProduction ? true : false
        })
      ]
    }))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);

gulp.task('build', [
  'build-js',
  'build-css',
]);

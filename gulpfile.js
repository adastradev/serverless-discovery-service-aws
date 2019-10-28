const gulp = require('gulp');
const snyk = require('gulp-snyk');
 
// Security related tasks/series'
const snykProtect = (cb) => process.env.SNYK_TOKEN ? snyk({ command: 'protect' }, cb) : cb();
const snykTest = (cb) => process.env.SNYK_TOKEN ? snyk({ command: 'test' }, cb) : cb();
 
// This is a gulp task, available by running "gulp secure"
exports.secure = gulp.series(snykProtect, snykTest);
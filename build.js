const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')
const CleanCSS = require('clean-css')
const fs = require('fs')
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    vue({
			compileTemplate: true,
			css(style, styles, compiler) {
				mkdirp(getDirName('dist'), function (err) {
					if (err) return err;
					fs.writeFileSync('dist/vue-spinner.min.css', new CleanCSS().minify(style).styles)
				});
			}
    }),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            'modules': false
          }
        ],
        'stage-2'
      ]
    }),
    uglify()
  ]
}).then(bundle => {
  bundle.write({
    format: 'umd',
    moduleName: 'VueSpinner',
    dest: './dist/vue-spinner.min.js'
  })
	})

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}
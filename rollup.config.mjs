import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import pkg from './package.json' with { type: 'json' }

export default {
  input: 'sort.js',
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' })
  ],
  output: [
    { file: pkg.main, format: 'cjs', exports: 'auto' },
    { file: pkg.module, format: 'es' }
  ]
}

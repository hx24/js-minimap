import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    // format: 'esm',
    format: 'umd',
    name: 'Minimap',
  },
  plugins: [resolve(), commonjs(), postcss()],
}

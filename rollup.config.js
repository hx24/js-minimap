import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
import clear from 'rollup-plugin-clear'

const production = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/minimap.esm.js', format: 'esm', sourcemap: !production },
    {
      file: 'dist/minimap.umd.js',
      format: 'umd',
      name: 'Minimap',
      sourcemap: !production,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss(),
    typescript({
      sourceMap: !production,
      outDir: 'dist',
      declaration: true,
      declarationDir: 'dist',
    }),
    clear({
      targets: ['dist'],
      // optional, whether clear the directory when rollup recompile on --watch mode.
      // watch: true, // default: false
    }),
  ],
}

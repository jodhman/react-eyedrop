import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

const config = {
  input: 'src/index.js',
  external: [
    'react',
    'html2canvas',
    'get-canvas-pixel-color'
  ],
  output: {
    format: 'umd',
    name: 'react-eyedrop',
    globals: {
      react: 'React',
      html2canvas: 'html2canvas',
      'get-canvas-pixel-color': 'getCanvasPixelColor'
    }
  },
  plugins: [
    uglify(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

export default config
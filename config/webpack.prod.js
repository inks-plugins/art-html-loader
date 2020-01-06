const path = require('path')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    library: 'ArtHtml',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: path.resolve(__dirname, '../lib')
  },
  externals: {
    'art-template': 'art-template',
    'loader-utils': 'loader-utils'
  },
  target: 'node',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  node: {
    fs: 'empty',
    path: 'empty',
    __dirname: false,
    __filename: false
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: 'lib'
    })
  ]
}

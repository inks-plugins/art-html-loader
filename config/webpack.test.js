const path = require('path')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './test/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../test_dist')
  },
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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false
          },
        }]
      }, {
        test: /\.arthtml$/,
        exclude: /node_modules/,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          },
          {
            loader: require.resolve('../src/index.js'),
            options: {
              root: path.resolve('./test')
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}

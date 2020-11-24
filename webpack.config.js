const path = require('path');
const BUILD_DIR = path.resolve(__dirname, './public/build');
const APP_DIR = path.resolve(__dirname, './react');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  
  // To add a new page using react, define an entry point here
  entry: {
    schedule: APP_DIR + '/schedule.js',
    test: APP_DIR + '/test.js',
    checkout: APP_DIR + '/checkout.js'
  },
  output: {
    filename: '[name].js',
    path: BUILD_DIR,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react'],
            plugins: ['transform-class-properties']
          }
        }
      },
    ]
  }
}

//webpack.config.js

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  mode: 'development',
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'frontend', 'dist'),
    filename: 'bundle.js',
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
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
    },
    fallback: {
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      querystring: require.resolve('querystring-es3'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      vm: require.resolve('vm-browserify'),
      timers: require.resolve('timers-browserify'),
      net: false,
      os: require.resolve('os-browserify/browser'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
  externals: {
    express: 'express'
  }
};

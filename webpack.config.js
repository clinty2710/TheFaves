//webpack.config.js

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'frontend/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      // Exclude fs from being bundled for the client-side code
      "fs": false,
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer"),
      "os": require.resolve("os-browserify/browser"),
      "querystring": require.resolve("querystring-es3"),
      "assert": require.resolve("assert/"),
      "vm": require.resolve("vm-browserify"),
      "net": require.resolve("net-browserify"),
      "async_hooks": require.resolve("util"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "timers": require.resolve("timers-browserify")
    }
  },
};

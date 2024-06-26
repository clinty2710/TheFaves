//webpack.config.js

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Add this line

// Load environment variables from .env file
dotenv.config();

module.exports = {
  mode: 'production',
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'frontend', 'dist'),
    filename: '[name].[contenthash].js',
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
      },
      {
        test: /\.(ttf|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts',
          }
        }
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
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      test: /\.(js|css|html|ttf|woff2)$/,
      algorithm: 'gzip',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      `...`, // This syntax extends existing minimizers (i.e. `terser-webpack-plugin`), if any
      new CssMinimizerPlugin(), // Ensure CSS is also minimized
    ],
  },
  externals: {
    express: 'express'
  }
};

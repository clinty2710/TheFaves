//webpack.config.js

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'frontend', 'dist'), // Adjusted output path
    filename: 'bundle.js',
  },
  externals: [nodeExternals()], // Exclude node modules from frontend bundle
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Added support for .jsx files
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
    extensions: ['.js', '.jsx'], // Included .jsx extension
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
      net: false, // Resolve 'net' module as false
    },
  },
  node: {
    __dirname: true,
    __filename: true,
    global: true, // Use global to mock the net module
  },
};

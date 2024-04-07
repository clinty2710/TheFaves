const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './frontend/src/index.js', // Entry point of your client-side application
  output: {
    path: path.resolve(__dirname, 'public'), // Output directory
    filename: 'bundle.js', // Output filename for client-side bundle
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    fallback: {
      // Add any necessary fallbacks here
    },
  },
  node: {
    __dirname: false,
    __filename: false,
    global: true
  },
  externals: {
    // Exclude server-related dependencies from bundling
    express: 'commonjs express',
  },
};

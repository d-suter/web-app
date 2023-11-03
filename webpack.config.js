const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.ts',  // Assuming your main entry point is index.ts in the src directory

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // Add a resolve section if you are using TypeScript
  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,  // If you use SCSS, otherwise change to /\.css$/ for CSS
        use: [
          'style-loader',  // Injects styles into DOM
          'css-loader',    // Translates CSS into CommonJS
          'sass-loader'    // Compiles Sass to CSS, using Node Sass by default
        ]
      }
      // Add other loaders/rules if needed (e.g., for images, fonts, etc.)
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'  // Assuming you have an index.html in your src folder
    }),
    new Dotenv() // This ensures environment variables from .env are available in your code
  ],

  // Configuration for webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000  // You can specify another port if you want
  },

  // If you want sourcemaps, you can include this option
  devtool: 'inline-source-map'
};

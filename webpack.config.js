const path = require('path');
 
module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['babel-loader', 'ts-loader'],
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    openPage: 'index.html',
    port: 3000,
    watchContentBase: true,
    open: true,
  }
};

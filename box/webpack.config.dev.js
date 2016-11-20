const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const NamedModulesPlugin = require('./NamedModulesPlugin');

process.env.NODE_ENV = 'development';

module.exports = {
  watch: true,
  devtool: 'source-map',
  entry: {
    index: [
      path.join(__dirname, './src/js/index.js'),
      'webpack-hot-middleware/client',
    ],
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
        //publicPath: '/'
  },
    // resolveLoader: {
    //     alias: {
    //         actionNameCheckLoader: path.join(__dirname, './reduxActionsNameSpaceLoader'),
    //     },
    // },
  resolve: {
    root: path.resolve('./src'),
  },
  plugins: [
        // new webpack.DllReferencePlugin({
        //     context: path.join(__dirname, 'vendor'),
        //     manifest: require('./vendor/vendor.manifest.dev.json'),
        // }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.DedupePlugin(),
    new NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  postcss: [autoprefixer({ browsers: ['> 5%', 'last 2 versions'] })],

  module: {
    preLoaders: [
            // {
            //     test: /ActionTypes/,
            //     loaders: ['actionNameCheckLoader'],
            //     include: path.resolve(__dirname, 'src'),
            // },
            // {
            //    test: /\.(js|jsx)$/,
            //    include: path.resolve(__dirname, 'src'),
            //    loader: 'eslint-loader'
            // }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'style!css!postcss!sass',
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname),
        loader: 'style!css!postcss',
      },
    ],
  },
};

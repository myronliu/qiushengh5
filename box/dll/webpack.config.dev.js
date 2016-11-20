const path = require('path');
const webpack = require('webpack');
const NamedModulesPlugin = require('../NamedModulesPlugin');

process.env.NODE_ENV = 'development';
module.exports = {
  entry: {
    vendor: [
      'react',
    ],
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].dev.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new NamedModulesPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '[name].manifest.dev.json'),
      name: '[name]_library',
    }),
  ],
};

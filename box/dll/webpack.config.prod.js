var path = require('path')
var webpack = require('webpack')
var NamedModulesPlugin = require('../NamedModulesPlugin')
process.env.NODE_ENV = 'production';


module.exports = {
    entry: {
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'react-addons-update',
            'react-redux',
            'react-tap-event-plugin',
            'redux',
            'redux-actions',
            'redux-ignore',
            'redux-promise-middleware',
            'redux-router',
            'radium',
            'es6-promise',
            'classnames',
            'whatwg-fetch',
            'pubsub-js',
            'jquery-param',
            'keymirror',
            'material-ui'
        ]
    },
    output: {
        path: path.join(__dirname),
        filename: '[name].prod.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new NamedModulesPlugin(),
        new webpack.DllPlugin({

            path: path.join(__dirname, '[name].manifest.prod.json'),

            name: '[name]_library'
        }),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};

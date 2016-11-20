var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
process.env.NODE_ENV = 'production';
function NamedModulesPlugin(options) {
    this.options = options || {};
}
NamedModulesPlugin.prototype.apply = function (compiler) {
    compiler.plugin("compilation", function (compilation) {
        compilation.plugin("before-module-ids", function (modules) {
            modules.forEach(function (module) {
                if (module.id === null && module.libIdent) {
                    module.id = module.libIdent({
                        context: this.options.context || compiler.options.context
                    });
                }
            }, this);
        }.bind(this));
    }.bind(this));
};

module.exports = {
    watch: true,
    entry: {
        index: [
            path.join(__dirname, './src/js/index.js'),
        ],
    },
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        chunkFilename: '[name].chunk.js',
        //publicPath: '/'
    },
    resolveLoader: {
        alias: {
            "actionNameCheckLoader": path.join(__dirname, "./reduxActionsNameSpaceLoader")
        }
    },
    resolve: {
        root: path.resolve('./src'),
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, 'vendor'),
            manifest: require('./vendor/vendor.manifest.prod.json'),
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new NamedModulesPlugin(),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ],
    postcss: [autoprefixer({browsers: ['> 5%', 'last 2 versions']})],

    module: {
        preLoaders: [
            {
                test: /ActionTypes/,
                loaders: ['actionNameCheckLoader'],
                include: path.resolve(__dirname, 'src'),
            },
            //{
            //    test: /\.(js|jsx)$/,
            //    include: path.resolve(__dirname, 'src'),
            //    loader: 'eslint-loader'
            //}
        ],
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel'],
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'kt-components')],
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'style!css!postcss!sass'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname),
                loader: 'style!css!postcss'
            }
        ]
    },
};

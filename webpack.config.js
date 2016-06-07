const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "",
        filename: "scripts/bundle.js"
    },
    module: {
        loaders: [
            {
                // SCSS
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract(['css', 'resolve-url', 'sass?sourceMap'])
            }, {
                // Standard css
                test: /\.css$/,
                loaders: ['style', 'css'],
            }, {
                // Images
                test: /images.*\.(jpe?g|png|svg|gif)$/,
                loaders: [
                    'file?name=./images/[name].[hash].[ext]',
                    'image-webpack?optimizationLevel=7&interlaced=false'
                ],
            }, {
                // static files
                test: /data/,
                loaders: [
                    'file?name=data/[name].[ext]'
                ]
            }, {
                // Fonts
                test: /\.(eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file?name=./fonts/[name].[ext]'
            }, {
                // Handlebars
                test: /\.handlebars?$/,
                loader: 'handlebars-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        root: path.resolve(__dirname, './src'),
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modulesDirectories: ['node_modules']
    },
    stats: {
        children: false
    },
    plugins: [
        new ExtractTextPlugin('./styles.css'),
        new HtmlWebpackPlugin({
            title: 'Faire Guide',
            template: 'html!./src/index.html',
        }),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ],
    devServer: {
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            children: false
        }
    },
};
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
                loaders: ['style', 'css', 'resolve-url'],
            }, {
                // Images
                test: /\.(jpe?g|png|svg|gif)$/,
                loaders: [
                    'file?name=/images/[name].[hash].[ext]',
                    'image-webpack?optimizationLevel=7&interlaced=false'
                ],
            }, {
                // Fonts
                test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file?name=/fonts/[name].[ext]'
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
        new ExtractTextPlugin('./styles/styles.css'),
        new HtmlWebpackPlugin({
            title: 'Vanaheim',
            template: 'html!./src/index.html',
        })
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
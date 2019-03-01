const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './example/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "index_bundle.js"
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './example',
        hot: true,
        port: 3002,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: false,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']        //支持static属性
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'example/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
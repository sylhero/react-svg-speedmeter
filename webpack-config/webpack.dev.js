const webpack = require('webpack');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const rules = require('./webpack.rules');
// const helper = require('../helper');

/**
 * push dev rules into the default rules array
 */
// push vendor css rule
rules.push({
    test: /\.css$/,
    include: /(node_modules)/,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        }
    ]
});
// source map for dev use
rules.push({
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre'
});

module.exports = {
    entry: {
        app: ['./src/app.tsx']
    },
    devtool: 'cheap-module-eval-source-map',
    cache: true,
    output: {
        path: path.resolve(__dirname, '../app-build'),
        filename: 'js/[name].bundle.[hash].js',
        publicPath: '/',
        pathinfo: false
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
        modules: [path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../src')]
    },
    module: {
        rules
    },
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' },
        https: false,
        disableHostCheck: true,
        contentBase: './app-build',
        noInfo: false,
        clientLogLevel: 'warning',
        stats: 'errors-only',
        // enable HMR depends on OS
        // https://github.com/gaearon/react-hot-loader/issues/511
        hot: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: 4000,
        host: '0.0.0.0',
        watchOptions: {
            ignored: /\/node_modules\/.*/
        }
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    /**
     * webpack 4 new optimization feature list
     * https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
     * StyleLintPlugin is unknown
     */
    plugins: [
        //  BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new StyleLintPlugin({
            files: 'src/**/*.ts',
            failOnError: false,
            emitErrors: true,
            quiet: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

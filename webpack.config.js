const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const  CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd){
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry:{
        game: './client/index.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias:{
            '@src': path.resolve(__dirname, 'src'),
            '@client': path.resolve(__dirname, 'src/client'),
            '@html': path.resolve(__dirname, 'src/client/html'),
            '@css': path.resolve(__dirname, 'src/client/css'),
            '@constants': path.resolve(__dirname, 'src/shared')
        }
    },
    optimization: optimization(),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
                template: './client/html/index.html',
                minify: isProd
            }
        ),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, 'public/assets/blood.png'),
                        to: path.resolve(__dirname, 'dist')
                    }
                ]
            }
        ),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })

    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
}
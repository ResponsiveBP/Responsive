// TODO: Add Autoprefixer

const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        "responsive": "./src/js/rbp.js",
        "responsive.min": "./src/js/rbp.min.js"
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: "eslint-loader"
            }]
        },
        {
            test: /\.min\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: "css-loader",
                        options: { sourceMap: true, minimize: true }
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }
                ]
            })
        },
        {
            test: /[^\.min]\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: "css-loader",
                        options: { sourceMap: true, minimize: false }
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }
                ]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new UglifyJSPlugin({
            test: /\.min\.js$/,
            sourceMap: true
        })
    ]
};
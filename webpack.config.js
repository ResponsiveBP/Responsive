const path = require("path");
const cssnano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const miniCss = new MiniCssExtractPlugin({
    filename: "[name].css",
});

const optimizeCss = new OptimizeCssAssetsPlugin({
    cssProcessor: cssnano,
    canPrint: true
});

// Default to production configuration
const config = {
    entry: {
        responsive: ["./src/js/app.js", "./src/sass/app.scss"]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: "nosources-source-map",
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "eslint-loader"
                }]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                        options: {
                            url: false // Allows relative urls for assets in source.
                        }
                    },
                    { loader: "sass-loader" }
                ],
            }
        ]
    },
    plugins: [miniCss, optimizeCss]
};

module.exports = (env, argv) => {
    // Use non-referenced source maps and minify in production.
    if (argv.mode === "development") {
        config.devtool = "source-map";
        config.plugins = [miniCss]
    }

    return config;
};


// // TODO: Add Autoprefixer

// const path = require("path");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// module.exports = {
//     entry: {
//         "responsive": "./src/js/rbp.js",
//         "responsive.min": "./src/js/rbp.min.js"
//     },
//     devtool: "source-map",
//     output: {
//         path: path.resolve(__dirname, "dist"),
//         filename: "[name].js"
//     },
//     module: {
//         rules: [{
//             test: /\.js$/,
//             exclude: /node_modules/,
//             use: [{
//                 loader: "eslint-loader"
//             }]
//         },
//         {
//             test: /\.min\.scss$/,
//             use: ExtractTextPlugin.extract({
//                 use: [
//                     {
//                         loader: "css-loader",
//                         options: { sourceMap: true, minimize: true }
//                     },
//                     {
//                         loader: "sass-loader",
//                         options: { sourceMap: true }
//                     }
//                 ]
//             })
//         },
//         {
//             test: /[^\.min]\.scss$/,
//             use: ExtractTextPlugin.extract({
//                 use: [
//                     {
//                         loader: "css-loader",
//                         options: { sourceMap: true, minimize: false }
//                     },
//                     {
//                         loader: "sass-loader",
//                         options: { sourceMap: true }
//                     }
//                 ]
//             })
//         }]
//     },
//     plugins: [
//         new ExtractTextPlugin("[name].css"),
//         new UglifyJSPlugin({
//             test: /\.min\.js$/,
//             sourceMap: true
//         })
//     ]
// };
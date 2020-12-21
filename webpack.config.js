const path = require("path");
// const cssnano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const miniCss = new MiniCssExtractPlugin({
  filename: "[name].css"
});

const optimizeCss = new CssMinimizerPlugin();

// Default to production configuration
const config = {
  entry: {
    responsive: ["./src/sass/app.scss", "./src/js/app.js"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "nosources-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader"
          }
        ]
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
          { loader: "postcss-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [miniCss, optimizeCss]
};

module.exports = (env, argv) => {
  // Use non-referenced source maps and minify in production.
  if (argv.mode === "development") {
    config.devtool = "source-map";
    config.plugins = [miniCss];
  }

  return config;
};

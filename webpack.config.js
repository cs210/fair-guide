const path = require("path");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "scripts/main.js",
    publicPath: "/"
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader"
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), "app", "src", "*.hbs"),
      output: path.join(process.cwd(), "build", "[name].html"),
      data: path.join(__dirname, "app/data/project.json"),
      partials: [
        path.join(process.cwd(), "app", "src", "components", "*", "*.hbs"),
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: "src/data/*",
        to: "docs/data"
      }, {
        from: "src/fonts/*",
        to: "docs/fonts"
      }, {
        from: "src/images/*",
        to: "docs/images"
      }]
    })
  ],
};

const path = require("path");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let id = 0;

module.exports = {
  mode: "production",
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "scripts/main.js",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    watchFiles: ['src/**/*'],
    liveReload: true,
    hot: false,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HandlebarsPlugin({
      entry: path.join(__dirname, "src", "page.handlebars"),
      output: path.join(__dirname, "docs", "index.html"),
      data: path.join(__dirname, "src", "data", "data.json"),
      partials: [path.join(__dirname, "src", "templates", "*.handlebars")],
      helpers: {
        groupsOf: (submissions) => {
          const allGroups = submissions
            .flatMap((submission) => submission.placement)
            .filter((group) => group !== "All");
          const allGroupsSorted = [...new Set(allGroups)].sort();

          return ["All", ...allGroupsSorted];
        },
        submissionsOfGroup: (submissions, group) => {
          return submissions.filter((submission) =>
            submission.placement.includes(group)
          );
        },
        idOf: (submission) => {
          return id++;
        }
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/data/*",
          to: "data/[name][ext]",
        },
        {
          from: "src/images/*",
          to: "images/[name][ext]",
        },
        {
          from: "src/images/2023/*",
          to: "images/2023/[name][ext]",
        }
      ],
    }),
  ],
};

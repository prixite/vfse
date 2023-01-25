/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.config.js");
module.exports = merge.mergeWithCustomize({
  customizeArray: merge.customizeArray({
    plugins: "prepend",
  }),
})(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../public/", "index.html"),
    }),
  ],
});

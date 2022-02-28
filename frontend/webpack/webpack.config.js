/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require("path");

const { EnvironmentPlugin } = require("webpack");

module.exports = {
  entry: {
    main: "./frontend/src/index.tsx",
    requests: "./requests/src/index.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendor",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "development",
    }),
  ],
  resolve: {
    alias: {
      "@src": path.resolve("frontend/src/"),
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "../dist/"),
    publicPath: "/static/",
    filename: "[name].bundle.js",
    clean: true,
  },
  devtool: "source-map",
};

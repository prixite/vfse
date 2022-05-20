/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require("path");

const { EnvironmentPlugin } = require("webpack");

require("dotenv").config();

module.exports = {
  entry: {
    main: "./frontend/src/index.tsx",
    requests: "./frontend/src/requests/src/index.js",
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
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(svg)$/i,
        use: ["svg-react-loader"],
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "production",
      REQUEST_TOKEN: "fake",
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
  devtool: "inline-source-map",
};

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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      // NODE_ENV: "production",
      REQUEST_TOKEN: "fake",
      WEBSSH_SERVER: "http://localhost:8888/",
      WEBSSH_WS: "ws://localhost:8888/",
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

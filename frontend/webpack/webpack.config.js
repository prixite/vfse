/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require("path");

const { EnvironmentPlugin } = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");

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
    strictExportPresence: true,
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
      WEBSSH_WS_SERVER: "ws://localhost:8888/",
      AWS_STORAGE_BUCKET_NAME: "something",
      AWS_ACCESS_KEY_ID: "something",
      AWS_SECRET_ACCESS_KEY: "something",
      AWS_DEFAULT_REGION: "something",
      API_SERVER: "/api/",
      AUTH_TOKEN: "",
      GUACD_HOST: "",
      GUACD_PORT: "",
      GUACD_PROXY_WS: "",
      WEBSOCKIFY_WS: "",
      HTML_PROXY_DOMAIN: "",
    }),
    new BundleTracker({ filename: "./webpack-stats.json" }),
  ],
  resolve: {
    alias: {
      "@src": path.resolve("frontend/src/"),
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "../dist/"),
    publicPath: process.env.PUBLIC_PATH ?? "/static/",
    filename: "[name].[contenthash].js",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../dist/"),
    },
    port: 3000,
  },
};

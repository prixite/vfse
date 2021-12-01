const path = require("path");

module.exports = {
  entry: ["./frontend/src/index.tsx"],
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
    ],
  },
  resolve: {
    alias: {
      "@src": path.resolve("frontend/src/"),
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "../dist/"),
    publicPath: "/dist/",
    filename: "bundle.js",
    clean: true,
  },
};

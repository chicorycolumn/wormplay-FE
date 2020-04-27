const merge = require("webpack-merge");
const path = require("path");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  context: path.resolve(__dirname, "../"),
  entry: [
    "./public/face-api.min.js",
    "./public/emotion-rec.js",
    "./src/index.js",
  ],
  output: {
    filename: "bundle.min.js",
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});

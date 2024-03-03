const { merge } = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: process.env.PORT,
    historyApiFallback: true,
  },
});

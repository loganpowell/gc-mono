const Dotenv = require("dotenv-webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "web",
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@actions": path.resolve(__dirname, "src/actions"),
      "@reducer": path.resolve(__dirname, "src/reducer"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@icons": path.resolve(__dirname, "src/assets/icons"),
      "@langs": path.resolve(__dirname, "src/lang"),
    },
    extensions: [".ts", ".tsx", "..."],
    plugins: [new TsconfigPathsPlugin({ extensions: [".ts", ".tsx", "..."] })],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    uniqueName: "GazaCare",
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /(\.test.(j|t)sx?$|node_modules)/i,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|webp)$/i,
        use: {
          loader: "responsive-loader",
          options: {
            // If you want to enable sharp support:
            adapter: require("responsive-loader/sharp"),
          },
        },
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const originPath = process.cwd();
const demoPath = `${originPath}/demo`;
module.exports = {
  mode: 'development',
  entry: `${demoPath}/src/index.tsx`,
  output: {
    filename: 'app.js',
    path: `${demoPath}/dist`,
  },
  devtool: 'source-map',
  externals: [],
  devServer: {
    port: 19411,
    contentBase: `${demoPath}/src`,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: `${demoPath}/src`,
        exclude: /\.vue$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "modules": false,
                "targets": {
                  "browsers": [ "ie >= 11", "last 2 versions" ]
                }
              }],
              '@babel/preset-react'
            ],
            plugins: [path.join(originPath, 'node_modules', '@babel/plugin-syntax-dynamic-import')],
          }
        },
      },
      // {
      //   test: /\.vue$/,
      //   include: `${demoPath}/src`,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         ["@babel/preset-env", {
      //           "modules": false,
      //           "targets": {
      //             "browsers": [ "ie >= 11", "last 2 versions" ]
      //           }
      //         }],
      //       ],
      //       plugins: [path.join(originPath, 'node_modules', '@babel/plugin-syntax-dynamic-import')],
      //     }
      //   },
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // include: path.join(originPath, 'demo', 'src')
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    alias: {
      'external-lib': path.join(demoPath, 'external-lib'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(demoPath, 'index.html')
    }),
    new CheckerPlugin(),
    new VueLoaderPlugin(),
  ],
};

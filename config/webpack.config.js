var webpack = require('webpack');

const webpackConfig = {
    module: {},
    entry:{
      clio: './src/index',
      'clio.min': './src/index'
    },
    devtool: "source-map",
    output: {
        path: './assets',
        filename: "[name].js"
    },
    target: 'web'
};

webpackConfig.resolve = {
  root: '../src',
  alias: {
    models: '../src/models'
  },
  extentions: ['', '.js'],
  modulesDirectories: ['node_modules']
};

webpackConfig.module.loaders = [{
  test: /\.(js)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015']
  }
}];

webpackConfig.plugins = [
  // new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: false,
  //   },
  //   output: {
  //     comments: false,
  //   }
  // }),
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
];

webpackConfig.devServer = {
  historyApiFallback: true,
  contentBase: './assets'
};


module.exports = webpackConfig;

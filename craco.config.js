const CracoLessPlugin = require('craco-less');
const { loaderByName } = require('@craco/craco');
const WorkerPlugin = require('worker-plugin');

// /* craco.config.js */
module.exports = {
  webpack: {
    configure: function (webpackConfig) {
      // some stuff

      return webpackConfig;
    },
    plugins: [
      new WorkerPlugin()
    ],
    output: {
      filename: '[name].[contenthash].bundle.js'
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true
          }
        },
        modifyLessRule(lessRule) {
          // You have to exclude these file suffixes first,
          // if you want to modify the less module's suffix
          lessRule.exclude = /\.m\.less$/;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule) {
          // Configure the file suffix
          lessModuleRule.test = /\.m\.less$/;

          // Configure the generated local ident name.
          const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
          cssLoader.options.modules = {
            modules: true,
            localIdentName: '[local]_[hash:base64:5]'
          };

          return lessModuleRule;
        }
      }
    }
  ]
};

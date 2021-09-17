const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CracoAntDesignPlugin = require('craco-antd');
const WorkerPlugin = require('worker-plugin');
const path = require('path');

const environment = process.env.NODE_ENV === 'development';

// /* craco.config.js */
module.exports = {
  webpack: {
    configure(webpackConfig, { paths }) {
      // some stuff

      // 开发环境console 可以查看文件名称
      webpackConfig.devtool = environment ? 'eval-cheap-module-source-map' : 'nosources-source-map';

      // 修改build的生成文件名称
      // paths.appBuild = 'docs';
      // webpackConfig.output = {
      //   ...webpackConfig.output,
      //   path: path.resolve(__dirname, 'docs'),
      //   publicPath: '/'
      // };

      return webpackConfig;
    },
    plugins: [
      new WorkerPlugin(),
      ...(environment ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : [])
    ],
    output: {
      filename: '[name].[hash:8].js'
    }
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true
          }
        },
        cssLoaderOptions: {
          modules: {
            // [name] 源文件名称
            // [path] 源文件相对于 compiler.context 或者 modules.localIdentContext 配置项的相对路径。
            // [file] - 文件名和路径。
            // [ext] - 文件拓展名。
            // [hash] - 字符串的哈希值。
            // [<hashFunction>:hash:<hashDigest>:<hashDigestLength>] - 带有哈希设置的哈希。
            // [local] - 原始类名。
            // 开发环境使用 '[path][name]__[local]'
            // 生产环境使用 '[hash:base64]'
            localIdentName: environment ? '[path][name]_[local]_[hash:base64:5]' : '[hash:base64]',
            auto: true
          }
        },
        modifyLessRule(lessRule) {
          // You have to exclude these file suffixes first,
          // if you want to modify the less module's suffix
          lessRule.exclude = /\.m\.less$/;
          return lessRule;
        },
        babelPluginImportOptions: {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        }
      }
    }
  ]
};

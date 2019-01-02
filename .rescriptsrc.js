const { getPaths, edit } = require(`@rescripts/utilities`);
const apiMocker = require('mocker-api');
const path = require('path');

const isBabelLoader = inQuestion => inQuestion && inQuestion.loader && inQuestion.loader.includes('babel-loader');
const isDevServer = inDevServer => inDevServer && typeof inDevServer === 'function' && inDevServer.name === 'before';

module.exports = {
  webpack: config => {
    // aAdd hot update
    const babelLoaderPaths = getPaths(isBabelLoader, config);
    config = edit(
      matchedSection => {
        const options = matchedSection.options;
        options.plugins = ['react-hot-loader/babel'].concat(options.plugins || []);
        return matchedSection;
      },
      babelLoaderPaths,
      config
    );

    // Add worker
    config.output.globalObject = 'this';
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ];

    // Add map
    config.resolve.alias = {
      ...config.resolve.alias,
      '@store': path.resolve(__dirname, 'src/store/'),
      '@utils': path.resolve(__dirname, 'src/utils/')
    };

    return config;
  },
  devServer: config => {
    // Add mocker
    const devServerPaths = getPaths(isDevServer, config);
    config = edit(
      before => {
        return (app, server) => {
          before(app, server);
          apiMocker(app, path.resolve('./mocker/index.js'), {
            proxy: {
              // '/api/*': 'https://forum.havennetwork.io/'
            },
            changeHost: true
          });
        };
      },
      devServerPaths,
      config
    );

    return config;
  }
};
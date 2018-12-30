module.exports = config => {
  config.output.globalObject = 'this';

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    }
  ];

  return config;
};

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add the fallback for the crypto module
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
      };

      // Return the modified webpack configuration
      return webpackConfig;
    },
  },
};

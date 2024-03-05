module.exports = {
    // px转rem
    plugins: {
      'postcss-pxtorem': {
        rootValue: 20,
        propList: ['*'],
      },
    },
  };
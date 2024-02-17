module.exports = {
    // px转rem
    plugins: {
      'postcss-pxtorem': {
        rootValue: 15,
        propList: ['*'],
      },
    },
  };
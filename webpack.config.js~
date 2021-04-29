const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({env,offline:true,mode: 'none'}, argv);
  // Customize the config before returning it.
  return config;
};

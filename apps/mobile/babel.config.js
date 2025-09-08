module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@crm/types': '../../packages/shared/src/types',
          '@crm/schemas': '../../packages/shared/src/schemas',
          '@crm/utils': '../../packages/shared/src/utils',
        },
      }],
    ],
  };
};

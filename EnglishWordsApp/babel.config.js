module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        fileName: false,
      },
    ],
  ],
};

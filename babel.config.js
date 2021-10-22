module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-typescript',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      }
    ],
  ]
};

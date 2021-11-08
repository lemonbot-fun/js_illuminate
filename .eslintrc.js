module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [require.resolve('@lemonbot.fun/eslint-config-base/index')],
  rules: {
    'arrow-parens': ['error', 'always'],
    'no-console': 0,
    'no-debugger': 0,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};

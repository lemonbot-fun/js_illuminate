module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript/base'
  ],
  rules: {
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-use-before-define': 0,

    // 单行文本长度
    'max-len': 0,
    //
    'array-callback-return': 0,
    //
    'class-methods-use-this': 0,
    //
    'consistent-return': 0,
    //
    'filenames/match-regex': 0,
    //
    'filenames/match-exported': 0,
    //
    'filenames/no-index': 0,
    //
    'import/no-cycle': 0,
    //
    'import/no-unresolved': 0,
    //
    'import/prefer-default-export': 0,
    // 允许倒入模块时不写扩展名
    'import/extensions': 0,
    // impont/require 后可以不留空行
    'import/newline-after-import': 0,
    //
    'import/no-extraneous-dependencies': 0,
    //
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    // 允许进行位运算
    'no-bitwise': 0,
    //
    'no-continue': 0,
    // 允许连续赋值
    'no-multi-assign': 0,
    //
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1 }],
    // 复合三元表达式
    'no-nested-ternary': 0,

    'no-restricted-syntax': ['error', 'WithStatement', "BinaryExpression[operator='in']"],
    //
    'no-param-reassign': 0,
    //
    'no-shadow': 0,
    // 允许使用 ++ --
    'no-plusplus': 0,

    'no-underscore-dangle': 0,

    // 允许空构造函数
    'no-useless-constructor': 0,

    'no-unused-expressions': 0,

    'no-unused-vars': 0,
    //
    'object-curly-newline': 0,
    // 允许在代码块 首位留空行
    'padded-blocks': 0,
    // 允许不使用解构赋值
    'prefer-destructuring': 0,
    // 按需添加箭头函数参数的括号
    'arrow-parens': ['error', 'as-needed'],
    //
    'no-trailing-spaces': 0,
    //
    'no-console': 0,
    'no-debugger': 0,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};

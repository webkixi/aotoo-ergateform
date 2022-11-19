module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
      '@typescript-eslint',
  ],
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      "plugin:node/recommended",
      "prettier",
  ],
  rules: {
    'prettier/prettier': 'error',
  },
  parserOptions:  {
    ecmaVersion:  2020,  // 允许解析最新的 ECMAScript 特性
    sourceType:  'module',  // 允许使用 import
    ecmaFeatures:  {
      jsx:  true,  // 允许对JSX进行解析
    },
  }
};
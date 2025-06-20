module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'quotes': ['warn', 'single'],
    'semi': ['off'],
    'max-len': ['warn', { code: 100, tabWidth: 2 }],
    'no-console': 'warn',
    '@typescript-eslint/semi': ['warn', 'always'],
    '@typescript-eslint/quotes': ['warn', 'single'],
    'indent': ['warn', 4],
  },
};

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'quotes': ['warn', 'single'],
    'semi': ['off'],
    'max-len': ['warn', { code: 140, tabWidth: 2 }],
    'no-console': 'warn',
    '@typescript-eslint/semi': ['warn', 'always'],
    '@typescript-eslint/quotes': ['warn', 'single'],
    'indent': ['warn', 2],
    'no-empty': ['warn', { allowEmptyCatch: true }],
  },
};

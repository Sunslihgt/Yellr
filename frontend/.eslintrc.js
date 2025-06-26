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
    'no-console': ['warn', { allow: ['warn', 'error']}],
    '@typescript-eslint/semi': ['warn', 'always'],
    '@typescript-eslint/quotes': ['warn', 'single'],
    'indent': ['warn', 4],
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-trailing-spaces': ['warn'],
  },
};

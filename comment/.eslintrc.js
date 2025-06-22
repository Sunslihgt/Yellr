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
    'max-len': ['warn', { code: 140, tabWidth: 2 }],
    'no-console': 'off',
    '@typescript-eslint/semi': ['warn', 'always'],
    '@typescript-eslint/quotes': ['warn', 'single'],
    'indent': ['warn', 4],
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-trailing-spaces': ['warn'],
  },
};

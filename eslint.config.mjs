const globals = require('globals');

module.exports = {
  root: true,
  ignorePatterns: ['node_modules/'],
  parserOptions: {
    sourceType: 'script',
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['**/*.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  globals: {
    ...globals.browser,
  },
  extends: ['plugin:node/recommended'],
};

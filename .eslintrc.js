module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb',
    'react-app',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  settings: {
    webpack: {},
    typescript: {},
    'import/ignore': ['node_modules', 'src/js/', 'private_modules'],
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']
      }
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    // { ts: 'never', tsx: 'never', js: 'never', jsx: 'never' }
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never', js: 'never' }],
    'no-console': 0,
    'no-plusplus': 0,
    'no-bitwise': 'off',
    'default-case': 'error',
    'no-lonely-if': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'import/no-extraneous-dependencies': [0],
    'no-else-return': ['off', { allowElseIf: true }],
    'import/no-named-as-default': 0,
    'no-param-reassign': ['error', { props: false }],
    'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],
    'jsx-a11y/click-events-have-key-events': 2,
    'react/no-array-index-key': 0,
    'lines-between-class-members': 0,
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'no-shadow': 'off',
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    '@typescript-eslint/no-shadow': ['error'],
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': [0],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-fragments': [1, 'element'],
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        bracketSameLine: true,
        singleQuote: true,
        trailingComma: 'none',
        tabWidth: 2
      }
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  },
  ignorePatterns: ['src/services/gobang-2.0.0/obsolete/*']
};

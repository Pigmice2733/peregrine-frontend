const tsRules = {
  'typescript/no-unused-vars': 'error',
  'no-undef': 'off' // ts handles this
}

const reactRules = {
  'react/react-in-jsx-scope': 'off',
  'react/no-unknown-property': ['error', { ignore: ['class', 'for'] }],
  'no-unused-vars': ['error', { varsIgnorePattern: '^h$' }],
  'react/display-name': 'off', // annoying
  'react/require-render-return': 'off', // buggy, doens't work with render props
  'react/no-deprecated': 'off' // preact !== react
}

const unicornRules = {
  'unicorn/prefer-spread': 'off'
}

const importRules = {
  'import/first': 'error',
  'import/no-duplicates': 'error',
  'import/no-namespace': 'error',
  // 'import/order': 'error' // broken for now, copies file contents over and over
  'import/newline-after-import': 'error',
  'import/no-named-default': 'error'
}

const promiseRules = {
  'promise/no-return-wrap': 'error',
  'promise/param-names': 'error',
  'promise/no-nesting': 'error',
  'promise/no-new-statics': 'error',
  'promise/no-return-in-finally': 'error',
  'promise/valid-params': 'error'
  'promise/prefer-await-to-then': 'error'
}

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: 'typescript-eslint-parser',
  parserOptions: {
    sourceType: 'module'
  },
  settings: {
    react: {
      pramga: 'h'
    },
    'import/resolver': {
      node: true,
      'eslint-import-resolver-typescript': true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:array-func/recommended'
    'plugin:jsx-a11y/recommended'
  ],
  plugins: [
    'react',
    'jest',
    'typescript',
    'unicorn',
    'import',
    'promise',
    'array-func'
    'jsx-a11y'
  ],
  rules: Object.assign(
    reactRules,
    tsRules,
    unicornRules,
    importRules,
    promiseRules
  )
}

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-empty": "warn",
      "no-console": "warn",
      "no-constant-condition": "warn",
      "no-irregular-whitespace": "warn",
      "no-unreachable": "warn",
      "no-unsafe-negation": "warn",
      "no-unsafe-finally": "warn",
      "no-unsafe-optional-chaining": "warn",
      "no-unsafe-assignment": "warn",
      "no-unsafe-member-access": "warn",
      "no-unsafe-return": "warn",
      "no-unsafe-regex": "warn",
      "no-unsafe-arithmetics": "warn",
      "no-unsafe-call": "warn",
      "no-unsafe-iteration": "warn",
      "no-unsafe-argument": "warn",
      "no-unsafe-regular-expression": "warn",
      "no-unsafe-indexing": "warn",
      "no-unsafe-identifier": "warn",
    },
  },
]

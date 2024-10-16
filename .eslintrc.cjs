module.exports = {
  extends: ['plugin:prettier/recommended', 'plugin:storybook/recommended'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'tailwindcss', 'unused-imports'],
      extends: [
        'plugin:prettier/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:tailwindcss/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'import/no-anonymous-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-continue': 'off',
        'no-restricted-syntax': 'off',
        'prefer-const': 'warn',
        'no-useless-escape': 'off',
        'no-console': 'warn',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal'],
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@vitejs/*',
                group: 'external',
              },
              {
                pattern: '@testing-library/*',
                group: 'external',
              },
              {
                pattern: '@*/**',
                group: 'internal',
              },
              {
                pattern: './**',
                group: 'internal',
              },
            ],
            pathGroupsExcludedImportTypes: ['react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'import/prefer-default-export': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'no-console': [
          'error',
          {
            allow: ['error'],
          },
        ],
        'react/destructuring-assignment': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
        'tailwindcss/classnames-order': [
          'error',
          {
            officialSorting: true,
          },
        ],
        'tailwindcss/no-custom-classname': 'off',
        // 'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['vite.config.ts', 'playwright.config.ts'],
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
    },
    {
      files: './src/?(*.)+(spec|test).[jt]s?(x)',
      extends: ['plugin:testing-library/react'],
    },
    {
      files: './e2e/**/?(*.)+(spec|test).[jt]s?(x)',
      extends: ['plugin:playwright/playwright-test'],
    },
  ],
};

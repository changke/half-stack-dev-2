// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    name: 'my/typescript-lint',
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    name: 'my/javascript-lint',
    files: ['*.mjs'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    name: 'my/global-ignores',
    ignores: ['public/*']
  },
  {
    name: 'my/coding-styles',
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    // @ts-ignore
    extends: [stylistic.configs.customize({
      blockSpacing: false,
      braceStyle: '1tbs',
      semi: true
    })],
    rules: {
      '@stylistic/arrow-parens': ['error', 'as-needed', {requireForBlockBody: false}],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'never'],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/quote-props': 0,
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {anonymous: 'ignore', asyncArrow: 'always', named: 'never'}]
    }
  }
);

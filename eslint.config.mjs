import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { eslintPluginTypescriptConfig } from './configs/typescript.js';
import vueEslintParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';

export default withNuxt(
  ...vuePlugin.configs['flat/recommended'].map(config => ({
    ...config,
    files: ['**/*.vue'],
  })),
  ...eslintPluginTypescriptConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
    },
    rules: {
      "vue/multi-word-component-names": "off"
    }
  },
  prettierConfig
);
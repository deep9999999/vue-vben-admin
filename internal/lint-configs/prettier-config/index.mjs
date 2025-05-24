export default {
  endOfLine: 'auto',
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
    {
      files: ['*.vue'],
      options: {
        singleAttributePerLine: true,
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'strict',
};

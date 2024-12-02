const brownPrettierConfig = require('@brown-ccv/prettier-config');
const PrettierConfig = require('prettier-plugin-tailwindcss');

/** @type {import("prettier").Config} */
module.exports = {
  // Base config
  ...brownPrettierConfig,
  // Custom settings
  singleQuote: false,
  jsxSingleQuote: false,
  plugins: [PrettierConfig],
};

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    
    // General rules
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-vars": "off", // Disabled in favor of @typescript-eslint/no-unused-vars
  },
};
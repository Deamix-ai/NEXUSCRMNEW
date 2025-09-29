module.exports = {
  extends: ["./react.js"],
  rules: {
    // Next.js specific rules
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: ["**/pages/**/*", "**/app/**/*"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
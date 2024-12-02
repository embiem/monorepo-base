/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@monorepo/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};

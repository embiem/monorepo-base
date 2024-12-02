/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@monorepo/eslint-config/base.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};

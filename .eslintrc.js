module.exports = {
   env: {
      es2021: true,
      node: true,
   },
   extends: [
      "standard-with-typescript",
      "plugin:adonis/typescriptApp",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended",
   ],
   overrides: [],
   parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
   },
   rules: {
      "prettier/prettier": "error",
      "no-console": "error",
   },
};

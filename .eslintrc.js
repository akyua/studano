module.exports = {
  root: true,
  extends: [
    "@react-native",
    "eslint-config-prettier",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "error",
  },
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
};

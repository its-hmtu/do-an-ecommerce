import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-target-blank": "off",
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/prop-types': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
];
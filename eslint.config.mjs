import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["frontend/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        webpack: {
          config: "./frontend/webpack/webpack.dev.config.js",
        },
      },
    },
  },
  {
    ignores: [
      "frontend/src/store/reducers/generatedWrapper.ts",
      "frontend/src/store/reducers/generated.ts",
      "core/",
    ],
  },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "no-unused-vars": "off",
      "no-use-before-define": ["error", { variables: false }],
      "no-console": "error",
    },
  },
];

import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import path from "path";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.plugins("eslint-plugin-obsidianmd"),
  pluginReact.configs.flat.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "react/react-in-jsx-scope": "off",
      "obsidianmd/sample-names": "off",
      "react/display-name": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  globalIgnores(["node_modules/", "main.js"]),
]);

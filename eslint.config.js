import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import path from "path";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.plugins("eslint-plugin-obsidianmd"),
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
      "@eslint-react": eslintReact,
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "obsidianmd/sample-names": "off",
      "@eslint-react/dom/display-name": "off",
      "@eslint-react/dom/react-in-jsx-scope": "off",
      ...eslintReact.configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{js,ts,jsx,tsx}"],
  })),
  globalIgnores(["node_modules/", "main.js"]),
]);

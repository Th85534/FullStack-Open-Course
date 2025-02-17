import globals from "globals";
import pluginJs from "@eslint/js";
import js from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default {
  files: ["**/*.js"],
  ignores: ["dist/**"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.node,
    },
    ecmaVersion: "latest",
  },
  ...pluginJs.configs.recommended,
  ...js.configs.recommended
};
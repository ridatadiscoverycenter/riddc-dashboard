import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default defineConfig([
	// mimic ESLintRC-style extends
	...compat.extends("@brown-ccv/eslint-config"),
]);
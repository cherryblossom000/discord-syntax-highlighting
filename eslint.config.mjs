// @ts-check
import eslint from '@eslint/js'
import {defineConfig, globalIgnores} from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default defineConfig(
	globalIgnores(['dist/', 'highlight.js/']),
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	{
		rules: {
			'arrow-body-style': 1,
			curly: [1, 'multi-or-nest'],
			eqeqeq: [2, 'smart'],
			'func-style': 1,
			'object-shorthand': 1,
			'no-duplicate-imports': [2, {allowSeparateTypeImports: true}],
			'no-useless-rename': 1,
			'prefer-arrow-callback': 1,
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		extends: [
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,
		],
		rules: {
			'@typescript-eslint/consistent-type-imports': 2,
			'@typescript-eslint/explicit-function-return-type': 2,
			'@typescript-eslint/no-confusing-void-expression': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/no-unused-vars': 1,
			// Use non-strict rules (allow e.g. numbers)
			'@typescript-eslint/restrict-template-expressions': [2, {}],
			'@typescript-eslint/strict-boolean-expressions': 2,
		},
	},
	eslintPluginPrettierRecommended,
)

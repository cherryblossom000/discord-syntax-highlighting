'use strict'

const path = require('path')

/** @type {import('eslint').Linter.Config} */
const config = {
	settings: {
		jsdoc: {mode: 'typescript'}
	},
	overrides: [
		{
			files: 'vite.config.ts',
			extends: [
				'@cherryblossom/eslint-config/ts/node/commonjs',
				'@cherryblossom/eslint-config/node/14'
			],
			parserOptions: {
				project: path.join(__dirname, 'tsconfig.vite.config.json')
			},
			rules: {
				'node/no-unpublished-import': 0,
				'import/no-unused-modules': 0
			}
		},
		{
			files: '**/.eslintrc.js',
			extends: [
				'@cherryblossom/eslint-config/js/node/commonjs',
				'@cherryblossom/eslint-config/node/14'
			]
		}
	]
}
module.exports = config

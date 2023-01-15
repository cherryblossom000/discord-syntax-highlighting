import assert from 'node:assert'
import {readFile} from 'node:fs/promises'
import * as path from 'node:path'
import hljs from 'highlight.js'
import {defineConfig} from 'vite'
import {createHtmlPlugin} from 'vite-plugin-html'
import type * as LanguageModule from 'highlight.js/lib/languages/*'

// https://github.com/highlightjs/highlight.js/blob/bc1b06bb3ac587498d8e21a99c3ee38ce4727c1f/tools/lib/language.js#L9-L10
const categoryRegex = /\/\*.*?Category: (.*?)\r?\n/su
const languageRegex = /\/\*.*?Language: (.*?)\r?\n/su

const languagesDirNodeModules = path.join(
	__dirname,
	'node_modules',
	'highlight.js',
	'lib',
	'languages'
)
const hljsDir = path.join(__dirname, 'highlight.js')
const samplesDir = path.join(hljsDir, 'test', 'detect')
const languagesDir = path.join(hljsDir, 'src', 'languages')

interface Language {
	/**
	 * The language code.
	 *
	 * @example 'xml'
	 */
	language: string

	/**
	 * The language name.
	 *
	 * @example 'HTML, XML'
	 */
	name: string

	aliases: readonly string[]
	categories: readonly string[]
	sample: string
}

export default defineConfig(async () => {
	const maybeLangs = await Promise.all(
		hljs.listLanguages().map<Promise<Language | undefined>>(async language => {
			if (language === 'plaintext') return

			let sample
			try {
				sample = await readFile(
					path.join(samplesDir, language, 'default.txt'),
					'utf8'
				)
			} catch (error: unknown) {
				if (
					typeof error == 'object' &&
					error &&
					'code' in error &&
					(error as {code: unknown}).code === 'ENOENT'
				)
					return
				throw error
			}

			const langJS = `${language}.js`
			const [mod, contents] = await Promise.all([
				import(path.join(languagesDirNodeModules, langJS)) as Promise<
					typeof LanguageModule
				>,
				readFile(path.join(languagesDir, langJS), 'utf8')
			])
			const {
				name = ((): string => {
					const match = languageRegex.exec(contents)
					assert(
						match,
						`error: language ${language} does not have a \`name\` property or a match for ${languageRegex}!
  File contents:
  ${contents}`
					)
					return match[1]!
				})(),
				aliases = []
			} = mod.default(hljs)
			const categories = categoryRegex.exec(contents)?.[1]!.split(/,\s?/u) ?? []
			return {
				language,
				name,
				aliases: aliases.filter(alias => alias !== language),
				categories: [...(categories.length ? categories : ['misc']), 'all'],
				sample: hljs
					.highlight(sample, {language})
					// Vite uses Vue's HTML parser, where curly braces are special
					.value.replace(/\{/gu, '&#123;')
					.replace(/\}/gu, '&#125;')
					// unable to parse HTML; parse5 error code control-character-in-input-stream
					// the FIX language has these control characters for some reason
					.replaceAll('\u0001', '␁')
			}
		})
	)
	const languages = maybeLangs
		.filter((lang): lang is Language => lang !== undefined)
		.sort((a, b) => a.language.localeCompare(b.language))

	// https://github.com/highlightjs/highlight.js/blob/bc1b06bb3ac587498d8e21a99c3ee38ce4727c1f/tools/build_browser.js#L118-L133
	const categoryCounts = languages
		.flatMap(({categories}) => categories)
		.reduce(
			(map, category) => map.set(category, (map.get(category) ?? 0) + 1),
			new Map<string, number>()
		)
	const specialCategories = new Set(['common', 'misc', 'all'])
	const categories = [
		'common',
		...[...categoryCounts.keys()]
			.filter(category => !specialCategories.has(category))
			.sort(),
		'misc',
		'all'
	].map(name => ({name, count: categoryCounts.get(name)}))

	return {
		root: 'src',
		plugins: [createHtmlPlugin({inject: {data: {categories, languages}}})],
		build: {
			outDir: '../dist',
			emptyOutDir: true
		}
	}
})

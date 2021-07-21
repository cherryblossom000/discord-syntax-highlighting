import {readFile, writeFile} from 'fs/promises'
import * as path from 'path'
import * as ejs from 'ejs'
import hljs from 'highlight.js'

// https://github.com/highlightjs/highlight.js/blob/main/tools/lib/language.js#L9-L10
const categoryRegex = /\/\*.*?Category: (.*?)\r?\n/su
const languageRegex = /\/\*.*?Language: (.*?)\r?\n/su

const languagesDir10 = new URL(
  path.join('node_modules', 'highlight.js', 'lib', 'languages/'),
  import.meta.url
)

const hljsDir = new URL('highlight.js/', import.meta.url)
const samplesDir = new URL(path.join('test', 'detect/'), hljsDir)
const languagesDir = new URL(path.join('src', 'languages/'), hljsDir)

/**
 * @typedef {object} Language
 * @property {string} lang The language code.
 * @property {string} name The language name.
 * @property {ReadonlyArray<string>} aliases The aliases for the language.
 * @property {ReadonlyArray<string>} categories The categories that the language is in.
 * @property {string} sample A sample of the language.
 */

/** @type {[string, ReadonlyArray<Language>]} */
const [template, languages] = await Promise.all([
  readFile(new URL(path.join('src', 'index.ejs'), import.meta.url), 'utf8'),
  Promise.all(
    hljs.listLanguages().map(async lang => {
      if (lang === 'plaintext') return

      let sample
      try {
        sample = await readFile(
          new URL(path.join(lang, 'default.txt'), samplesDir),
          'utf8'
        )
      } catch (error) {
        if (error?.code === 'ENOENT') return
        throw error
      }

      const langJS = `${lang}.js`
      const [mod, contents] = await Promise.all([
        /** @type {import('highlight.js/lib/languages/*')} */ (
          import(new URL(langJS, languagesDir10))
        ),
        readFile(new URL(langJS, languagesDir), 'utf8')
      ])
      const {name = languageRegex.exec(contents)[1], aliases = []} =
        mod.default(hljs)
      const categories = categoryRegex.exec(contents)?.[1].split(/,\s?/u) ?? []
      // eslint-disable-next-line consistent-return -- return object or undefined
      return {
        lang,
        name,
        aliases,
        // https://github.com/highlightjs/highlight.js/blob/main/tools/lib/language.js#L66
        categories: [...(categories.length ? categories : ['misc']), 'all'],
        sample
      }
    })
  ).then(langs => langs.filter(lang => lang).sort((a, b) => a.lang - b.lang))
])

// https://github.com/highlightjs/highlight.js/blob/main/tools/build_browser.js#L118-L133
/** @type {ReadonlyMap<string, number>} */
const categoryCounts = languages
  .flatMap(({categories}) => categories)
  .reduce(
    (map, category) => map.set(category, (map.get(category) ?? 0) + 1),
    /** @type {Map<string, number>} */ (new Map())
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
await writeFile(
  new URL(path.join('dist', 'index.html'), import.meta.url),
  ejs.render(template, {categories, languages})
)

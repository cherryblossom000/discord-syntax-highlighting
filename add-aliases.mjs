import * as path from 'path'
import {readFile, readdir, writeFile} from 'fs/promises'
import hljs from 'highlight.js'

const languagesDir = new URL(
  path.join('node_modules', 'highlight.js', 'lib', 'languages/'),
  import.meta.url
)
const file = new URL('index.html', import.meta.url)

/** @type {readonly [string, Readonly<Record<string, readonly string[]>>]} */
const [html, aliasesMap] = await Promise.all([
  readFile(file, 'utf8'),
  Promise.all(
    hljs
      .listLanguages()
      .map(async l => [
        l,
        /** @type {{default: import('highlight.js').LanguageFn}} */ (
          await import(new URL(`${l}.js`, languagesDir))
        ).default(hljs).aliases ?? []
      ])
  ).then(Object.fromEntries)
])

await writeFile(
  file,
  html.replace(
    /<h2>(.+?) <code>([\w-]+?)<\/code>.*?<\/h2>/gu,
    (_, /** @type {string} */ name, /** @type {string} */ lang) =>
      `<h2>${name} ${[lang, ...aliasesMap[lang]]
        .map(a => `<code>${a}</code>`)
        .join('')}</h2>`
  )
)

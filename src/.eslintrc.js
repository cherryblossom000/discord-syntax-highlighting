'use strict'

const path = require('path')

/** @type {import('eslint').Linter.Config} */
const config = {
  overrides: [
    {
      files: '**/*.ts',
      extends: '@cherryblossom/eslint-config/ts/browser',
      parserOptions: {project: path.join(__dirname, 'tsconfig.json')}
    }
  ]
}
module.exports = config

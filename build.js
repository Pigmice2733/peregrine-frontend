const rollup = require('rollup')
const configs = require('./rollup.config')
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const { join, relative } = require('path')
const cpy = require('cpy')
const templite = require('templite')
const kleur = require('kleur')

const outDir = 'dist'

const indent = s =>
  s
    .split('\n')
    .map(l => '  ' + l)
    .join('\n')

const simpleFileName = file =>
  relative(process.cwd(), file)
    .replace(/\.([tj]sx?|css|mjs)$/, '')
    .replace(/\.es$/, '')
    .replace(/\/index$/, '')
    .replace(/^src\//, '')
    .replace(/^node_modules\/.*\//, '')

const listModules = modules =>
  Object.entries(modules)
    .map(([file, m]) => {
      return file.endsWith('.css')
        ? null
        : `${kleur.bold(simpleFileName(file))} (${
            m.renderedExports.length === 0 ? '*' : m.renderedExports.join(',')
          })`
    })
    .filter(Boolean)
    .join(', ')

const graphChunk = (chunk, bundle) => {
  let output =
    kleur.bold.blue(chunk.fileName) +
    ' - ' +
    listModules(chunk.modules) +
    '\n' +
    chunk.imports.map(i => indent(graphChunk(bundle[i], bundle))).join('\n')
  return output
}

const graphBundle = bundle =>
  Object.values(bundle)
    .filter(chunk => chunk.isEntry)
    .map(c => graphChunk(c, bundle))
    .join('\n')

async function buildMain() {
  console.log('building main bundle')
  const bundle = await rollup
    .rollup(configs.main)
    .catch(error => console.log(error))
  const { output } = await bundle.write(configs.main.output)
  console.log(graphBundle(output))
  console.log('built main bundle')
  return output
}

async function buildHtml() {
  console.log('building index.html')
  const apiUrl = process.env.PEREGRINE_API_URL
    ? process.env.PEREGRINE_API_URL
    : process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://api.peregrine.ga:8081'
      : 'https://edge.api.peregrine.ga:8081'
  const htmlSrc = await readFileAsync('rollup-index.html', 'utf8')
  const htmlOut = templite(htmlSrc, { apiUrl })
  await writeFileAsync(join(outDir, 'index.html'), htmlOut)
  console.log('built index.html')
}

async function buildSystemEntry() {
  console.log('building systemjs entry')
  const bundle = await rollup
    .rollup(configs.systemEntry)
    .catch(error => console.log(error))
  await bundle.write(configs.systemEntry.output)
  console.log('built systemjs entry')
}

async function buildHeaders(output) {
  const headers = Object.values(output).reduce(
    (headers, chunk) => {
      if (chunk.isEntry && chunk.imports) {
        headers[chunk.fileName] = chunk.imports.map(
          c => `</${c}>; rel=preload; as=script; crossorigin`,
        )
      }
      return headers
    },
    {
      '': [
        '</systemjs-entry.js>; rel=preload; as=script',
        '</index.js>; rel=preload; as=script; crossorigin',
        '</style.css>; rel=preload; as=style',
      ],
    },
  )
  // root relies on index.js, so hoist the dependencies of index.js
  headers[''].push(headers['index.js'])
  delete headers['index.js']
  const stringHeaders = Object.entries(headers)
    .map(([route, Link]) => [
      route,
      route === ''
        ? Link
        : // exclude pushing items that are already pushed from /
          Link.filter(l => !headers[''].includes(l)),
    ])
    .filter(([, Link]) => Link.length > 0)
    .map(
      ([route, Link]) =>
        '/' + route + '\n' + Link.map(l => `  Link: ${l}`).join('\n'),
    )
    .join('\n\n')
  await writeFileAsync(join(outDir, '_headers'), stringHeaders)
  console.log('built _headers')
}

async function build() {
  const output = await buildMain()
  await buildSystemEntry()
  await buildHtml()
  await buildHeaders(output)
  await cpy('_redirects', outDir)
}

build()

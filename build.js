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

const graphChunk = (chunk, bundle) =>
  kleur.bold().blue(chunk.fileName) +
  ' - ' +
  listModules(chunk.modules) +
  '\n' +
  chunk.imports.map(i => indent(graphChunk(bundle[i], bundle))).join('\n')

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

function createLink(path, type, crossorigin = true) {
  if (type === 'script' && crossorigin) {
    return `  Link: </${path}>; rel=preload; as=script; crossorigin`
  }
  return `  Link: </${path}>; rel=preload; as=${type}`
}

const pages = [
  {
    path: '/',
    file: './src/routes/home/index.tsx',
  },
  {
    path: '/events/:eventKey',
    file: './src/routes/event/index.tsx',
  },
  {
    path: '/events/:eventKey/matches/:matchKey',
    file: './src/routes/event-match/index.tsx',
  },
  {
    path: '/events/:eventKey/matches/:matchKey/scout',
    file: './src/routes/scout/index.tsx',
  },
  {
    path: '/events/:eventKey/teams/:teamNum',
    file: './src/routes/event-team/index.tsx',
  },
]

function trackDependencies(chunk, chunks) {
  return [
    ...new Set([
      ...chunk.imports,
      ...chunk.imports.flatMap(c => trackDependencies(chunks[c], chunks)),
    ]),
  ]
}

const baseDependencies =
  [
    createLink('systemjs-entry.js', 'script', false),
    createLink('index.js', 'script'),
    createLink('style.css', 'style'),
  ].join('\n') + '\n'

async function buildHeaders(output) {
  const outputValues = Object.values(output)
  const contents = pages
    .map(p => {
      const srcPath = require.resolve(p.file)
      const chunk = outputValues.find(v => v.facadeModuleId === srcPath)
      return {
        path: p.path,
        dependencies: [chunk.fileName, ...trackDependencies(chunk, output)],
      }
    })
    .map(
      p =>
        p.path +
        '\n' +
        baseDependencies +
        p.dependencies.map(d => createLink(d, 'script')).join('\n'),
    )
    .join('\n\n')

  await writeFileAsync(join(outDir, '_headers'), contents)

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

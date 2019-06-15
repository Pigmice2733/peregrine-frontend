const rollup = require('rollup')
const configs = require('./rollup.config')
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const { join } = require('path')
const cpy = require('cpy')
const templite = require('templite')

const outDir = 'dist'

async function buildMain() {
  console.log('building main bundle')
  const bundle = await rollup
    .rollup(configs.main)
    .catch(error => console.log(error))
  const { output } = await bundle.write(configs.main.output)
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
    file: './src/routes/home.tsx',
  },
  {
    path: '/events/:eventKey',
    file: './src/routes/event.tsx',
  },
  {
    path: '/events/:eventKey/analysis',
    file: './src/routes/event-analysis.tsx',
  },
  {
    path: '/events/:eventKey/matches/:matchType',
    file: './src/routes/event-match-group.tsx',
  },
  {
    path: '/events/:eventKey/match/:matchKey',
    file: './src/routes/event-match.tsx',
  },
  {
    path: '/events/:eventKey/match/:matchKey/scout',
    file: './src/routes/scout/index.tsx',
  },
  {
    path: '/events/:eventKey/teams/:teamNum',
    file: './src/routes/event-team.tsx',
  },
  {
    path: '/users',
    file: './src/routes/users.tsx',
  },
  {
    path: '/register',
    file: './src/routes/register.tsx',
  },
  {
    path: '/login',
    file: './src/routes/login.tsx',
  },
  {
    path: '/leaderboard',
    file: './src/routes/leaderboard.tsx',
  },
]

function trackDependencies(chunk, chunks) {
  return [
    ...new Set([
      ...chunk.imports,
      ...chunk.imports.flatMap(c =>
        trackDependencies(chunks.find(ch => ch.fileName === c), chunks),
      ),
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

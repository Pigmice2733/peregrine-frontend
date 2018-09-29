const rollup = require('rollup')
const config = require('./rollup.config')
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const { join, relative } = require('path')

const outDir = 'dist'

async function build() {
  console.log('building')
  const bundle = await rollup.rollup(config).catch(error => console.log(error))
  console.log('built')
  await bundle.write(config.output)
  const htmlSrc = await readFileAsync('index.html', 'utf8')
  const htmlOut = htmlSrc
    .replace(config.input, '/' + relative(outDir, config.output.file))
    .replace('</body>', '<link rel="stylesheet" href="/style.css">\n</body>')
  await writeFileAsync(join(outDir, 'index.html'), htmlOut)
}

build()

import { danger, warn, fail } from 'danger'
import { CLIEngine } from 'eslint'
import { lint as stylelint } from 'stylelint'
import * as eslintConfig from './.eslintrc'
import * as stylelintConfig from './stylelint.config'

const filesToCheck = [...danger.git.created_files, ...danger.git.modified_files]

const eslint = new CLIEngine(eslintConfig as CLIEngine.Options)

const isJsFile = (f: string) =>
  f.endsWith('ts') || f.endsWith('tsx') || f.endsWith('js')

filesToCheck.filter(isJsFile).forEach(async f => {
  const text = await danger.github.utils.fileContents(f)
  const { results } = eslint.executeOnText(text)
  results[0].messages.forEach(message => {
    if (message.severity === 2) {
      fail(message.message, f, message.line)
    } else if (message.severity === 1) {
      warn(message.message, f, message.line)
    }
  })
})

const isCssFile = (s: string) => s.endsWith('.css')

filesToCheck.filter(isCssFile).forEach(async f => {
  const text = await danger.github.utils.fileContents(f)
  const { results } = await stylelint({
    code: text,
    config: stylelintConfig
  })
  results[0].warnings.forEach(message => {
    if (message.severity === 'error') {
      fail(message.text, f, message.line)
    } else if (message.severity === 'warning') {
      warn(message.text, f, message.line)
    }
  })
})

if (filesToCheck.includes('package.json')) {
  if (!filesToCheck.includes('yarn.lock')) {
    fail('')
  }
}

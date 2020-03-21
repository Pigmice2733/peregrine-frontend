const prompts = require('prompts')
const path = require('path')

module.exports = {
  prompt: () =>
    prompts([
      {
        name: 'url',
        type: 'text',
        initial: '/events/:eventKey',
        message: 'URL',
      },
      {
        name: 'name',
        type: 'text',
        message: 'Component Name',
        initial: (url) =>
          url
            .split(/[^\w:]+/)
            .filter((i) => i.length > 0 && !i.startsWith(':'))
            .map((i) => i[0].toUpperCase() + i.slice(1))
            .join(''),
      },
      {
        name: 'filepath',
        type: 'text',
        message: 'File Path',
        initial: (name) =>
          path.join(
            'src',
            'routes',
            (
              name[0] + name.slice(1).replace(/[A-Z]/g, (i) => '-' + i)
            ).toLowerCase(),
          ),
      },
    ]).then((results) => {
      results.props = results.url
        .split('/')
        .filter((i) => i.startsWith(':'))
        .map((i) => i.replace(/^:/, ''))
      return results
    }),
}

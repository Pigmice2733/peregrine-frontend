---
to: _templates/<%= name %>/<%= action || 'new' %>/index.js
---

const prompts = require('prompts')

module.exports = {
  prompt: () =>
    prompts([
      {
        name: 'asdf',
        type: 'text',
        message: 'What?',
      },
    ])
}

import App from '@/app'
import { cleanupTokens } from '@/jwt'
import { render, h } from 'preact'

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (module.hot) module.hot.accept()

  while (document.body.lastChild) {
    document.body.lastChild.remove()
  }
}

const el = document.createElement('div')
document.body.append(el)

cleanupTokens()

render(<App />, el)

if ('serviceWorker' in navigator && process.env.ROLLUP === 'true') {
  navigator.serviceWorker.register('/sw.js')
}

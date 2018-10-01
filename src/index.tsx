import { h, render } from 'preact'
import { Router, Route } from 'preact-router'
import Home from './routes/home'
import './style'
import { initDevTools } from 'preact/devtools/devtools'

const App = () => (
  <Router>
    <Route path="/" component={Home} />
  </Router>
)

while (document.body.lastChild) {
  document.body.removeChild(document.body.lastChild)
}

render(<App />, document.body, document.body.lastElementChild || undefined)

if (process.env.NODE_ENV !== 'production') {
  initDevTools()
}

import { h, render } from 'preact'
import { Router, Route } from 'preact-router'
import Home from './routes/home'
import './style'

const App = () => (
  <Router>
    <Route path="/" component={Home} />
  </Router>
)

while (document.body.lastChild) {
  document.body.removeChild(document.body.lastChild)
}

render(<App />, document.body, document.body.lastElementChild || undefined)

require('preact/devtools')

import { h, render } from 'preact'
import { Router, Route } from 'preact-router'
import Home from './routes/home'

const App = () => (
  <Router>
    <Route path="/" component={Home} />
  </Router>
)

while (document.body.lastChild) {
  document.body.removeChild(document.body.lastChild)
}

render(<App />, document.body, document.body.lastElementChild || undefined)

import './style.css'
import { Router } from './router'
import { h, Fragment } from 'preact'
import 'preact/debug'
import { DialogDisplayer } from './components/dialog'
import routes from './routes'

const App = () => (
  <Fragment>
    <div>
      <Router routes={routes} />
    </div>
    <DialogDisplayer />
  </Fragment>
)

export default App

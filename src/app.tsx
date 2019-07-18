import './style.css'
import { Router } from './router'
import { h, Fragment } from 'preact'
import 'preact/debug'
import { DialogDisplayer } from './components/dialog'
import routes from './routes'
import GAnalytics from 'ganalytics'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const ga = GAnalytics('UA-144107080-1', {}, true)

const sendGa =
  process.env.NODE_ENV === 'production'
    ? () =>
        requestIdleCallback(() => {
          ga.send('pageview', {
            dl: location.href,
            dt: document.title,
            dh: location.hostname,
          })
        })
    : () => {}

const App = () => (
  <Fragment>
    <div>
      <Router routes={routes} onChange={sendGa} />
    </div>
    <DialogDisplayer />
  </Fragment>
)

export default App

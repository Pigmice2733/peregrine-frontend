import 'preact/debug'
import './style.css'
import { Router } from './router'
import { h, Fragment } from 'preact'
import { DialogDisplayer } from './components/dialog'
import routes from './routes'
import GAnalytics from 'ganalytics'
import { requestIdleCallback } from '@/utils/request-idle-callback'
import { uploadSavedReports } from './api/report/submit-report'

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

setTimeout(uploadSavedReports, 2_000)
setInterval(uploadSavedReports, 30_000)

const App = () => (
  <Fragment>
    <div>
      <Router routes={routes} onChange={sendGa} />
    </div>
    <DialogDisplayer />
  </Fragment>
)

export default App

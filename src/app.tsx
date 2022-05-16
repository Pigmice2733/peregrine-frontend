import 'preact/debug'
import './style.css'
import { Router } from './router'
import { DialogDisplayer } from './components/dialog'
import routes from './routes'
import GAnalytics from 'ganalytics'
import { requestIdleCallback } from '@/utils/request-idle-callback'
import { uploadSavedReports } from './api/report/submit-report'
import { ErrorBoundary } from './components/error-boundary'
import { addUrlListener } from './url-manager'

if (process.env.NODE_ENV === 'production') {
  const ga = GAnalytics('UA-144107080-1', {}, true)
  addUrlListener(() =>
    requestIdleCallback(() => {
      ga.send('pageview', {
        dl: location.href,
        dt: document.title,
        dh: location.hostname,
      })
    }),
  )
}

setTimeout(uploadSavedReports, 2_000)
setInterval(uploadSavedReports, 30_000)

const App = () => (
  <>
    <div>
      <ErrorBoundary>
        <Router routes={routes} />
      </ErrorBoundary>
    </div>
    <DialogDisplayer />
  </>
)

export default App

import { Component, RenderableProps, createContext } from 'preact'
import Alert, { AlertType } from '../alert'
import { css } from 'linaria'
import { useContext } from 'preact/hooks'
import { createAlert } from '@/router'

interface State {
  caughtError?: Error
}

const alertStyle = css`
  margin: 1rem;
`

const codeStyle = css`
  overflow-x: auto;
`

export const ErrorEmitter = createContext<(error: Error) => void>((error) => {
  throw error
})

export const useErrorEmitter = () => useContext(ErrorEmitter)

export class ErrorBoundary extends Component<RenderableProps<{}>, State> {
  componentDidCatch = (caughtError: Error) => {
    console.error(caughtError)
    this.setState({ caughtError })
  }

  dynamicError = (caughtError: Error) => {
    console.error(caughtError)
    createAlert({
      type: AlertType.Error,
      message: (
        <details>
          <summary>{caughtError.message}</summary>
          <pre class={codeStyle}>{caughtError.stack}</pre>
        </details>
      ),
    })
  }

  render({ children }: RenderableProps<{}>, { caughtError }: State) {
    return (
      <ErrorEmitter.Provider value={this.dynamicError}>
        {caughtError && (
          <Alert type={AlertType.Error} class={alertStyle}>
            <details>
              <summary>{caughtError.message}</summary>
              <pre class={codeStyle}>{caughtError.stack}</pre>
            </details>
          </Alert>
        )}
        {/* We should not rerender the children if there was a caught error from them */}
        {/* If there was a caught emitted error then it is fine to rerender */}
        {!caughtError && children}
      </ErrorEmitter.Provider>
    )
  }
}

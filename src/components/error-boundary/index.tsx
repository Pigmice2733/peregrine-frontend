import { Component, h, RenderableProps, createContext } from 'preact'
import Alert from '../alert'
import { css } from 'linaria'
import { useContext } from 'preact/hooks'

interface State {
  caughtError?: Error
  caughtEmittedError?: Error
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

  dynamicError = (caughtEmittedError: Error) => {
    console.error(caughtEmittedError)
    this.setState({ caughtEmittedError })
  }

  render(
    { children }: RenderableProps<{}>,
    { caughtEmittedError, caughtError }: State,
  ) {
    const error = caughtEmittedError || caughtError
    return (
      <ErrorEmitter.Provider value={this.dynamicError}>
        {error && (
          <Alert class={alertStyle}>
            <details>
              <summary>{error.message}</summary>
              <pre class={codeStyle}>{error.stack}</pre>
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

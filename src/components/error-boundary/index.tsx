import { Component, h, RenderableProps, createContext } from 'preact'
import Alert from '../alert'
import { css } from 'linaria'
import { useContext } from 'preact/hooks'

interface State {
  error: Error | null
}

const alertStyle = css`
  margin: 1rem;
`

const codeStyle = css`
  overflow-x: auto;
`

export const ErrorEmitter = createContext<(error: Error) => void>(error => {
  throw error
})

export const useErrorEmitter = () => useContext(ErrorEmitter)

export class ErrorBoundary extends Component<RenderableProps<{}>, State> {
  state = {
    error: null,
  }
  componentDidCatch = (error: Error) => {
    console.error(error)
    this.setState({ error })
  }

  render({ children }: RenderableProps<{}>, { error }: State) {
    return (
      <ErrorEmitter.Provider value={this.componentDidCatch}>
        {error && (
          <Alert class={alertStyle}>
            <details>
              <summary>{error.message}</summary>
              <pre class={codeStyle}>{error.stack}</pre>
            </details>
          </Alert>
        )}
        {children}
      </ErrorEmitter.Provider>
    )
  }
}

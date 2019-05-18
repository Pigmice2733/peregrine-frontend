import {
  Component,
  h,
  ComponentChildren,
  RenderableProps,
  createContext,
} from 'preact'
import Alert from '../alert'
import { css } from 'linaria'
import { useContext } from 'preact/hooks'

interface Props {
  catcher?: (error: Error) => ComponentChildren
}

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

export class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
  }
  componentDidCatch = (error: Error) => {
    console.error(error)
    this.setState({ error })
  }

  render({ catcher, children }: RenderableProps<Props>, { error }: State) {
    return (
      <ErrorEmitter.Provider value={this.componentDidCatch}>
        {error &&
          (catcher ? (
            catcher(error)
          ) : (
            <Alert class={alertStyle}>
              <details>
                <summary>{error.message}</summary>
                <pre class={codeStyle}>{error.stack}</pre>
              </details>
            </Alert>
          ))}
        {children}
      </ErrorEmitter.Provider>
    )
  }
}

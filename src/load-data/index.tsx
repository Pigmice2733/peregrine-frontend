import { Component, JSX } from 'preact'

type OptionalKeys<T> = { [K in keyof T]?: T[K] }

interface Props<T> {
  data: { [K in keyof T]: () => Promise<T[K]> }
  renderSuccess: (
    data: OptionalKeys<T>,
    refresh: () => void,
  ) => JSX.Element | number | string | null
  renderError?: (
    errors: { [K in keyof T]?: { message: string } },
  ) => JSX.Element
}

interface State<T> {
  data: OptionalKeys<T>
  errors: { [K in keyof T]?: { message: string } }
}

export default class LoadData<T> extends Component<Props<T>, State<T>> {
  state: State<T> = { data: {}, errors: {} }
  componentDidMount() {
    this.load()
  }
  load = () => {
    const { data } = this.props
    for (const key in data) {
      const func = data[key]
      func()
        .then(resolvedData => {
          this.setState(({ data }: State<T>) => ({
            data: Object.assign(data, { [key]: resolvedData }),
          }))
        })
        .catch(error => {
          console.error(error)
          this.setState(({ errors }: State<T>) => ({
            errors: Object.assign(errors, { [key]: error }),
          }))
        })
    }
  }
  render({ renderSuccess, renderError }: Props<T>, { data, errors }: State<T>) {
    if (renderError && Object.keys(errors).length > 0) {
      return renderError(errors)
    }
    return renderSuccess(data, this.load)
  }
}

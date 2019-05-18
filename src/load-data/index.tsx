import { Component, JSX } from 'preact'
import { ErrorEmitter } from '@/components/error-boundary'

type OptionalKeys<T> = { [K in keyof T]?: T[K] }

interface Props<T> {
  data: { [K in keyof T]: () => Promise<T[K]> }
  renderSuccess: (
    data: OptionalKeys<T>,
    refresh: () => void,
  ) => JSX.Element | number | string | null
}

interface State<T> {
  data: OptionalKeys<T>
}

export default class LoadData<T> extends Component<Props<T>, State<T>> {
  static contextType = ErrorEmitter
  state: State<T> = { data: {} }
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
        .catch(this.context)
    }
  }
  render({ renderSuccess }: Props<T>, { data }: State<T>) {
    return renderSuccess(data, this.load)
  }
}

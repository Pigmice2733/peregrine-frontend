import { Component } from 'preact'

type OptionalKeys<T> = { [K in keyof T]?: T[K] }

interface Props<T> {
  data: { [K in keyof T]: () => Promise<T[K]> }
  render: (data: OptionalKeys<T>) => JSX.Element
}

interface State<T> {
  data: OptionalKeys<T>
}

export default class LoadData<T> extends Component<Props<T>, State<T>> {
  state: State<T> = { data: {} }
  componentDidMount() {
    console.log('component did mount')
    const { data } = this.props
    for (const key in data) {
      const func = data[key]
      func().then(resolvedData => {
        this.setState(({ data }: State<T>) => ({
          data: Object.assign(data, { [key]: resolvedData }),
        }))
      })
    }
  }
  render({ render }: Props<T>, { data }: State<T>) {
    console.log('hia', data)
    return render(data)
  }
}

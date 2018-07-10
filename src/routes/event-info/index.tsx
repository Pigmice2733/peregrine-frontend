import { h } from 'preact'

const EventInfo = (props: any) => (
  <div>
    <h1>EventInfo</h1>
    <pre>{JSON.stringify(props)}</pre>
  </div>
)

export default EventInfo

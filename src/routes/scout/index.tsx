import { h } from 'preact'
import Page from '@/components/page'
// import style from './style.css'
import Authenticated from '@/components/authenticated'

interface Props {
  eventKey: string
  matchKey: string
}

const Scout = ({ eventKey, matchKey }: Props) => (
  <Authenticated
    label="Log In to Scout"
    render={() => (
      <Page name="Scout" back={`/events/${eventKey}/matches/${matchKey}`}>
        <h1>Scout</h1>
      </Page>
    )}
  />
)

export default Scout

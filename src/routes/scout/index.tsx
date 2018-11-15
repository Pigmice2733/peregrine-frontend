import { h } from 'preact'
import Page from '@/components/page'
// import style from './style.css'
import WithAuth from '@/components/with-auth'

interface Props {
  eventKey: string
  matchKey: string
}

const Scout = ({ eventKey, matchKey }: Props) => (
  <WithAuth
    render={({ username }) => (
      <Page name="Scout">
        <h1>Hi, {username}</h1>
      </Page>
    )}
  />
)

export default Scout

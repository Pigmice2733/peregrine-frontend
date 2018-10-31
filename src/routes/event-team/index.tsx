import { h } from 'preact'
import Page from '@/components/page'
import style from './style'
import { MatchCard } from '@/components/match-card'
import LoadData from '@/load-data'
import { getEventInfo } from '@/api'

interface Props {
  eventKey: string
  teamNum: string
}

const EventTeam = ({ eventKey, teamNum }: Props) => (
  <LoadData
    data={{ eventInfo: () => getEventInfo(eventKey) }}
    renderSuccess={() => <Page name="eventTeam">hello</Page>}
  />
)

export default EventTeam

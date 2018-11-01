import { h } from 'preact'
import Page from '@/components/page'
import style from './style.css'
import LoadData from '@/load-data'
import { getEventInfo, getEventTeamInfo } from '@/api'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'

interface Props {
  eventKey: string
  teamNum: string
}

const EventTeam = ({ eventKey, teamNum }: Props) => (
  <LoadData
    data={{
      eventInfo: () => getEventInfo(eventKey),
      eventTeamInfo: () => getEventTeamInfo(eventKey, 'frc' + teamNum),
    }}
    renderSuccess={({ eventInfo, eventTeamInfo }) => (
      <Page name={`${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}>
        <h2 class={style.section}>Next Match</h2>
        <MatchCard
          match={{
            blueAlliance: ['frc123', 'frc826', 'frc928'],
            redAlliance: ['frc123', 'frc826', 'frc928'],
            time: '2018-03-08T08:00:00Z',
            key: 'qf3m2',
          }}
        />
        <InfoGroupCard
          info={[
            {
              title: 'Rank',
              icon: sortAscending,
              action: eventTeamInfo ? eventTeamInfo.rank : '',
            },
            {
              title: 'Ranking Score',
              icon: history,
              action: eventTeamInfo ? eventTeamInfo.rankingScore : '',
            },
          ]}
        />
      </Page>
    )}
  />
)

export default EventTeam

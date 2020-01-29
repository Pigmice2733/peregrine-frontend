import { h, Fragment } from 'preact'
import Page from '@/components/page'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { getEventTeamInfo } from '@/api/get-event-team-info'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { usePromise } from '@/utils/use-promise'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { ChartCard } from '@/components/chart'
import { useEventMatches } from '@/cache/event-matches/use'
import { useSchema } from '@/cache/schema/use'
import Button from '@/components/button'

const sectionStyle = css`
  font-weight: normal;
  text-align: center;
  font-size: 1.2rem;
`

interface Props {
  eventKey: string
  teamNum: string
}

const spacing = '0.5rem'

const eventTeamStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing};

  & > * {
    margin: ${spacing};
  }
`

const EventTeam = ({ eventKey, teamNum }: Props) => {
  const eventInfo = useEventInfo(eventKey)
  const eventTeamInfo = usePromise(
    () => getEventTeamInfo(eventKey, 'frc' + teamNum),
    [eventKey, teamNum],
  )
  const schema = useSchema(eventInfo?.schemaId)
  const teamMatches = useEventMatches(eventKey, 'frc' + teamNum)

  const nextMatch = teamMatches && nextIncompleteMatch(teamMatches)

  return (
    <Page
      name={`${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={eventTeamStyle}
    >
      {nextMatch && (
        <Fragment>
          <h2 class={sectionStyle}>Next Match</h2>
          <MatchCard
            match={nextMatch}
            href={`/events/${eventKey}/matches/${nextMatch.key}`}
          />
        </Fragment>
      )}
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
            action: eventTeamInfo?.rankingScore
              ? round(eventTeamInfo.rankingScore)
              : '',
          },
        ]}
      />
      <Button href={`/events/${eventKey}/teams/${teamNum}/comments`}>
        View all comments
      </Button>
      {teamMatches && schema && (
        <ChartCard
          team={'frc' + teamNum}
          eventKey={eventKey}
          schema={schema}
          teamMatches={teamMatches}
        />
      )}
    </Page>
  )
}

export default EventTeam

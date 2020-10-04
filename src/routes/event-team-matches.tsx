import Page from '@/components/page'
import { useEventInfo } from '@/cache/event-info/use'
import { useEventMatches } from '@/cache/event-matches/use'
import { EventMatches } from '@/components/event-matches'
import Spinner from '@/components/spinner'
import { css } from 'linaria'

interface Props {
  eventKey: string
  teamNum: string
}

const eventTeamMatchesStyle = css`
  display: grid;
  grid-template-columns: 23rem;
  max-width: 100%;
  justify-content: center;
  margin: 1rem;
  grid-gap: 1rem;
`

const EventTeamMatches = ({ eventKey, teamNum }: Props) => {
  const event = useEventInfo(eventKey)
  const eventName = event?.name || eventKey
  const matches = useEventMatches(eventKey, 'frc' + teamNum)
  return (
    <Page
      name={`Matches: ${teamNum} @ ${eventName}`}
      back={`/events/${eventKey}/teams/${teamNum}`}
      class={eventTeamMatchesStyle}
    >
      {matches ? (
        <EventMatches matches={matches} eventKey={eventKey} />
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default EventTeamMatches

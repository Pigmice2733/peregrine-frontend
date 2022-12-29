import Page from 'src/components/page'
import { useEventInfo } from 'src/cache/event-info/use'
import { useEventMatches } from 'src/cache/event-matches/use'
import { EventMatches } from 'src/components/event-matches'
import Loader from 'src/components/loader'
import { css } from '@linaria/core'

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
        <Loader />
      )}
    </Page>
  )
}

export default EventTeamMatches

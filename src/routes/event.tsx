import { h, Fragment } from 'preact'
import Page from '@/components/page'
import { MatchCard } from '@/components/match-card'
import { useEventInfo } from '@/cache/events'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { useEventMatches } from '@/cache/matches'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { Heading } from '@/components/heading'
import { EventMatches } from '@/components/event-matches'

interface Props {
  eventKey: string
}

const spacing = '1.5rem'

const eventStyle = css`
  display: grid;
  grid-template-columns: minmax(21rem, 23rem);
  justify-content: center;
  align-items: start;
  grid-gap: ${spacing};
  padding: ${spacing};
  margin-top: 0.5rem;

  @media (min-width: 800px) {
    grid-template-columns: minmax(20rem, 25rem) 21rem;
  }
`

const sectionStyle = css`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 2.5rem;
`

const headingStyle = css`
  font-size: 1.2rem;
  justify-self: center;
`

const Event = ({ eventKey }: Props) => {
  const matches = useEventMatches(eventKey)
  const eventInfo = useEventInfo(eventKey)
  const newestIncompleteMatch = matches && nextIncompleteMatch(matches)

  return (
    <Page
      name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}
      back="/"
      class={eventStyle}
    >
      <div class={sectionStyle}>
        <Heading level={2} class={headingStyle}>
          Event Info
        </Heading>
        {eventInfo && <EventInfoCard event={eventInfo} />}
        <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>
      </div>

      <div class={sectionStyle}>
        <Heading level={2} class={headingStyle}>
          {newestIncompleteMatch ? 'Next Match' : 'Matches'}
        </Heading>
        {newestIncompleteMatch && (
          <Fragment>
            <MatchCard
              key={newestIncompleteMatch.key}
              match={newestIncompleteMatch}
              href={`/events/${eventKey}/match/${newestIncompleteMatch.key}`}
            />
          </Fragment>
        )}
        {matches && <EventMatches matches={matches} eventKey={eventKey} />}
      </div>
    </Page>
  )
}

export default Event

import Page from '@/components/page'
import { MatchDetailsCard } from '@/components/match-card'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { Heading } from '@/components/heading'
import { EventMatches } from '@/components/event-matches'
import Loader from '@/components/loader'
import { useEventMatches } from '@/cache/event-matches/use'
import { isData } from '@/utils/is-data'
import { NetworkError } from '@/api/base'

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
  grid-gap: 1rem;
`

const noMatchesStyle = css`
  color: gray;
  text-align: center;
  /* it seemed like there was a little too much space above without this change */
  margin: -0.35rem 0 0;
`

const eventErrorStyle = css`
  justify-content: center;
  align-items: start;
  grid-gap: ${spacing};
  padding: ${spacing};
  margin-top: 0.5rem;
  grid-template-columns: minmax(20rem, 25rem) 21rem;
`

const Event = ({ eventKey }: Props) => {
  const matches = useEventMatches(eventKey)
  const eventInfo = useEventInfo(eventKey)
  const newestIncompleteMatch = isData(matches) && nextIncompleteMatch(matches)

  return (
    <Page
      name={isData(eventInfo) ? eventInfo.name : <code>{eventKey}</code>}
      back="/"
      class={eventInfo instanceof Error ? eventErrorStyle : eventStyle}
    >
      {eventInfo instanceof NetworkError && (
        <Heading level={1} class={headingStyle}>
          Could not connect to server. Please check your connection.
        </Heading>
      )}
      {isData(eventInfo) && <EventInfoCard event={eventInfo} />}
      <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>

      <div class={sectionStyle}>
        <Heading level={2} class={headingStyle}>
          {newestIncompleteMatch ? 'Next Match' : 'Matches'}
        </Heading>
        {newestIncompleteMatch && (
          <MatchDetailsCard
            key={newestIncompleteMatch.key}
            match={newestIncompleteMatch}
            eventKey={eventKey}
            link
          />
        )}
        {isData(matches) ? (
          matches.length > 0 ? (
            <EventMatches matches={matches} eventKey={eventKey} />
          ) : (
            <p class={noMatchesStyle}>No matches yet</p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </Page>
  )
}

export default Event

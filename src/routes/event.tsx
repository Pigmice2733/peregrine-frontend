import Page from 'src/components/page'
import { MatchDetailsCard } from 'src/components/match-card'
import { useEventInfo } from 'src/cache/event-info/use'
import { css } from '@linaria/core'
import { EventInfoCard } from 'src/components/event-info-card'
import Button from 'src/components/button'
import { nextIncompleteMatch } from 'src/utils/next-incomplete-match'
import { Heading } from 'src/components/heading'
import { EventMatches } from 'src/components/event-matches'
import Loader from 'src/components/loader'
import { useEventMatches } from 'src/cache/event-matches/use'

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

const noMatchesStyle = css`
  color: gray;
  text-align: center;
  /* it seemed like there was a little too much space above without this change */
  margin: -0.35rem 0 0;
`

const Event = ({ eventKey }: Props) => {
  const matches = useEventMatches(eventKey)
  const eventInfo = useEventInfo(eventKey)
  const newestIncompleteMatch = matches && nextIncompleteMatch(matches)

  return (
    <Page
      name={eventInfo?.name || <code>{eventKey}</code>}
      back="/"
      class={eventStyle}
    >
      <div class={sectionStyle}>
        <Heading level={2} class={headingStyle}>
          Information
        </Heading>
        {eventInfo && <EventInfoCard event={eventInfo} />}
        <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>
      </div>

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
        {matches ? (
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

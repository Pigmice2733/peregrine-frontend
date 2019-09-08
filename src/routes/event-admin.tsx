import { h, FunctionComponent } from 'preact'
import Page from '@/components/page'
import { useEventInfo } from '@/cache/event-info/use'
import Button from '@/components/button'
import { css } from 'linaria'

interface Props {
  eventKey: string
}

const wrapperStyle = css`
  padding: 1rem;
  display: flex;
  justify-content: center;
`

const EventAdmin: FunctionComponent<Props> = ({ eventKey }) => {
  const eventInfo = useEventInfo(eventKey)
  const eventName = eventInfo ? eventInfo.name : eventKey

  return (
    <Page name={`Event Admin: ${eventName}`} back={`/events/${eventKey}`}>
      <div class={wrapperStyle}>
        <Button href={`/events/${eventKey}/admin/create-match`}>
          Create a match
        </Button>
      </div>
    </Page>
  )
}

export default EventAdmin

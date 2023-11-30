import { updateEventMatch } from '@/api/match-info/update-event-match'
import { useMatchInfo } from '@/cache/match-info/use'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { route } from '@/router'
import { getTimeFromParts } from '@/utils/get-time-from-parts'
import { css } from 'linaria'
import { useState } from 'preact/hooks'

const cardStyle = css`
  margin: 1.5rem;
  padding: 1.5rem 2rem;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;
  & > * {
    margin-left: 0;
    margin-right: 0;
  }
`

const EditorForm = ({
  eventKey,
  matchKey,
}: {
  eventKey: string
  matchKey: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [teamList, setTeamList] = useState([''])
  const emitError = useErrorEmitter()
  const match = useMatchInfo(eventKey, matchKey)
  const matchDate = match?.time || new Date(Date.now())

  const formatDate = () => {
    const monthNumber = matchDate.getMonth() + 1
    const dayNumber = matchDate.getDate()
    const month =
      monthNumber < 10 ? '0' + String(monthNumber) : String(monthNumber)
    const day = dayNumber < 10 ? '0' + String(dayNumber) : String(dayNumber)
    return month + '/' + day
  }
  const formatTime = () => {
    const hourNumber = matchDate.getHours()
    const minuteNumber = matchDate.getMinutes()
    const hours =
      hourNumber < 10 ? '0' + String(hourNumber) : String(hourNumber)
    const minutes =
      minuteNumber < 10 ? '0' + String(minuteNumber) : String(minuteNumber)
    return hours + ':' + minutes
  }

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    updateEventMatch(eventKey, {
      redAlliance: teamList.slice(0, 3),
      blueAlliance: teamList.slice(3, 6),
      time: getTimeFromParts(day, time),
      key: matchKey,
      videos: match?.videos,
      scheduledTime: match?.scheduledTime?.toISOString(),
    })
      .then(() => route(`/events/${eventKey}/matches/${matchKey}`))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <TextInput
            label="Date (in mm/dd format)"
            required
            onInput={setDay}
            value={formatDate()}
          />
          <TextInput
            label="Time (in hh:mm format) or leave blank for current time"
            required
            onInput={setTime}
            value={formatTime()}
          />
          <TextInput
            label="Teams (separate numbers with commas, red alliance first)"
            required
            onInput={(input) => {
              const teams = input.split(', ')
              for (let i = 0; i < teams.length; i++) {
                teams[i] = 'frc' + teams[i]
              }
              setTeamList(teams)
            }}
            value={need}
          />
          <TextInput label="Red alliance score" />
          <TextInput label="Blue alliance score" />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Saving Match Information' : 'Save Match'}
          </Button>
        </>
      )}
    </Form>
  )
}

const MatchEditor = ({
  eventKey,
  matchKey,
}: {
  eventKey: string
  matchKey: string
}) => (
  <Page name={'Edit Match'} back={`/events/${eventKey}/events/${matchKey}`}>
    <Card class={cardStyle}>
      <ErrorBoundary>
        <EditorForm eventKey={eventKey} matchKey={matchKey} />
      </ErrorBoundary>
    </Card>
  </Page>
)

export default MatchEditor

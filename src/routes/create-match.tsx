import { FunctionComponent, Fragment, h } from 'preact'
import { formatTeamNumber } from '@/utils/format-team-number'
import TextInput from '@/components/text-input'
import { MatchInfo } from '@/api/match-info'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import Card from '@/components/card'
import Page from '@/components/page'
import { createEventMatch } from '@/api/match-info/create-event-match'
import { useState } from 'preact/hooks'
import Button from '@/components/button'
import Authenticated from '@/components/authenticated'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { route } from '@/router'

type NewMatchInfo = MatchInfo & { time: string }

const formStyle = css`
  grid-gap: 2rem;
  display: grid;
  justify-items: center;

  & label {
    display: block;
  }
`

const emptyMatchInfo: NewMatchInfo = {
  blueAlliance: ['', '', ''],
  redAlliance: ['', '', ''],
  key: '',
  time: new Date().toISOString(),
}

interface NewMatchFormProps {
  eventKey: string
}

const CreateMatchForm: FunctionComponent<NewMatchFormProps> = ({
  eventKey,
}) => {
  const [newMatchInfo, setNewMatchInfo] = useState<NewMatchInfo>(emptyMatchInfo)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const emitError = useErrorEmitter()

  console.log(newMatchInfo)

  const saveMatch = (e: Event) => {
    e.preventDefault()
    setIsSaving(true)
    createEventMatch(eventKey, newMatchInfo)
      .then(() => route(`/events/${eventKey}/admin`))
      .catch(emitError)
      .finally(() => setIsSaving(false))
  }

  const updateTeam = (color: 'redAlliance' | 'blueAlliance', index: number) => (
    team: string,
  ) => {
    const teamNum = `frc${formatTeamNumber(team)}`
    setNewMatchInfo({
      ...newMatchInfo,
      [color]: Object.assign([], newMatchInfo[color], { [index]: teamNum }),
    })
  }

  return (
    <Fragment>
      <form class={formStyle} onSubmit={saveMatch}>
        <TextInput
          label="Match Key"
          onInput={key => setNewMatchInfo({ ...newMatchInfo, key })}
          value={newMatchInfo.key}
        />
        <TextInput
          label="Red 1"
          onInput={updateTeam('redAlliance', 0)}
          value={formatTeamNumber(newMatchInfo.redAlliance[0])}
        />
        <TextInput
          label="Red 2"
          onInput={updateTeam('redAlliance', 1)}
          value={formatTeamNumber(newMatchInfo.redAlliance[1])}
        />
        <TextInput
          label="Red 3"
          onInput={updateTeam('redAlliance', 2)}
          value={formatTeamNumber(newMatchInfo.redAlliance[2])}
        />
        <TextInput
          label="Blue 1"
          onInput={updateTeam('blueAlliance', 0)}
          value={formatTeamNumber(newMatchInfo.blueAlliance[0])}
        />
        <TextInput
          label="Blue 2"
          onInput={updateTeam('blueAlliance', 1)}
          value={formatTeamNumber(newMatchInfo.blueAlliance[1])}
        />
        <TextInput
          label="Blue 3"
          onInput={updateTeam('blueAlliance', 2)}
          value={formatTeamNumber(newMatchInfo.blueAlliance[2])}
        />
        <Button disabled={isSaving}>{isSaving ? 'Saving' : 'Save'}</Button>
      </form>
    </Fragment>
  )
}

interface CreateMatchPageProps {
  eventKey: string
}

const createMatchStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const cardStyle = css`
  padding: 1.5rem;
  margin: 2rem;
`

const CreateMatchPage: FunctionComponent<CreateMatchPageProps> = ({
  eventKey,
}) => {
  const eventInfo = useEventInfo(eventKey)
  const eventName = eventInfo ? eventInfo.name : eventKey

  return (
    <Authenticated
      label="Create Match"
      render={() => (
        <Page
          name={`Create Match in ${eventName}`}
          class={createMatchStyle}
          back={`/events/${eventKey}/admin`}
        >
          <Card class={cardStyle}>
            <ErrorBoundary>
              <CreateMatchForm eventKey={eventKey} />
            </ErrorBoundary>
          </Card>
        </Page>
      )}
    />
  )
}

export default CreateMatchPage

import { h, Component } from 'preact'
import Page from '@/components/page'
import style from './style.css'
import Authenticated from '@/components/authenticated'
import { Schema, StatDescription } from '@/api/schema'
import { submitReport } from '@/api/report/submit-report'
import { BaseReport, Field } from '@/api/report'
import Spinner from '@/components/spinner'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import TeamPicker from '@/components/team-picker'
import { formatTeamNumber } from '@/utils/format-team-number'
import FieldCard from '../../components/field-card'
import Button from '@/components/button'
import LoadData from '@/load-data'
import { getSchema } from '@/api/schema/get-schema'
import { getSchemas } from '@/api/schema/get-schemas'
import { getEventInfo } from '@/api/event-info/get-event-info'

interface Props {
  eventKey: string
  matchKey: string
}

interface State {
  redAlliance: string[] | null
  blueAlliance: string[] | null
  team: string | null
  schema: Schema | null
  report: BaseReport
}

// Ready to submit
interface ReadyState extends State {
  team: string
  schema: Schema
}

const schema: Schema = {
  id: 1324,
  teleop: [
    { name: 'Home Switch Cubes', type: 'number' },
    { name: 'Scale Cubes', type: 'number' },
    { name: 'Far Switch Cubes', type: 'number' },
    { name: 'Climbed', type: 'boolean' },
  ],
  auto: [
    { name: 'Crossed Line', type: 'boolean' },
    { name: 'Switch Cubes', type: 'number' },
    { name: 'Scale Cubes', type: 'number' },
  ],
}

const isReportReady = (s: State): s is ReadyState =>
  s.team !== null && s.schema !== null

const createEmptyField = (s: StatDescription) => ({
  statName: s.name,
  ...(s.type === 'boolean'
    ? { attempted: false, succeeded: false }
    : { attempts: 0, successes: 0 }),
})

class ScoutPage extends Component<Props, State> {
  state = {
    redAlliance: null,
    blueAlliance: null,
    team: null,
    schema: null,
    report: {
      autoName: '',
      data: {
        teleop: [],
        auto: [],
      },
    },
  }

  componentDidMount() {
    getEventInfo(this.props.eventKey)
      .then(event => getSchema(event.schemaId))
      .then(schema =>
        this.setState(
          (s: State): Partial<State> => ({
            schema,
            report: {
              ...s.report,
              data: {
                teleop: schema.teleop.map(createEmptyField),
                auto: schema.auto.map(createEmptyField),
              },
            },
          }),
        ),
      )
    getEventMatchInfo(this.props.eventKey, this.props.matchKey).then(m => {
      this.setState({
        redAlliance: m.redAlliance,
        blueAlliance: m.blueAlliance,
      })
    })
  }

  onSubmit = (e: Event) => {
    e.preventDefault()
    if (isReportReady(this.state)) {
      submitReport(
        this.props.eventKey,
        this.props.matchKey,
        this.state.team,
        this.state.report,
      )
    } else {
      console.log('not ready')
    }
  }

  updateField = (gameStage: 'auto' | 'teleop', statName: string) => (
    value: Field,
  ) => {
    this.setState(
      (s: State): Partial<State> => ({
        report: {
          ...s.report,
          data: {
            ...s.report.data,
            [gameStage]: s.report.data[gameStage].map(f =>
              f.statName === statName ? value : f,
            ),
          },
        },
      }),
    )
  }

  render(
    { eventKey, matchKey }: Props,
    { schema, redAlliance, blueAlliance, team, report }: State,
  ) {
    return (
      <Page name="Scout" back={`/events/${eventKey}/matches/${matchKey}`}>
        <form class={style.scout} onSubmit={this.onSubmit}>
          <h1>Scout {team && formatTeamNumber(team)}</h1>
          {schema || <Spinner />}
          {blueAlliance && redAlliance && (
            <TeamPicker
              onChange={team => this.setState({ team })}
              blueAlliance={blueAlliance}
              redAlliance={redAlliance}
            />
          )}
          <h2>Auto</h2>
          {report.data.auto.map(field => (
            <FieldCard
              key={'auto' + field.statName}
              field={field}
              onChange={this.updateField('auto', field.statName)}
            />
          ))}
          <h2>Teleop</h2>
          {report.data.teleop.map(field => (
            <FieldCard
              key={'teleop' + field.statName}
              field={field}
              onChange={this.updateField('teleop', field.statName)}
            />
          ))}
          <Button>Submit</Button>
        </form>
      </Page>
    )
  }
}

const Scout = ({ eventKey, matchKey }: Props) => (
  <Authenticated
    label="Log In to Scout"
    render={() => <ScoutPage eventKey={eventKey} matchKey={matchKey} />}
  />
)

export default Scout

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
import { getSchema } from '@/api/schema/get-schema'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { route } from 'preact-router'
import TextInput from '@/components/text-input'
import { submitComment } from '@/api/report/submit-comment'

interface Props {
  eventKey: string
  matchKey: string
}

interface State {
  redAlliance: string[] | null
  blueAlliance: string[] | null
  team: string | null
  schema: Schema | null
  comment: string
  report: {
    data: {
      teleop: { [key: string]: Field }
      auto: { [key: string]: Field }
    }
    autoName: string
  }
  submitting: boolean
}

// Ready to submit
interface ReadyState extends State {
  team: string
  schema: Schema
}

const isReportReady = (s: State): s is ReadyState =>
  s.team !== null && s.schema !== null

const createEmptyFields = (
  previousFields: { [key: string]: Field },
  field: StatDescription,
) => ({
  ...previousFields,
  [field.name]: {
    name: field.name,
    attempts: 0,
    successes: 0,
  },
})

const processReport = (report: State['report']): BaseReport => ({
  ...report,
  data: {
    teleop: Object.values(report.data.teleop),
    auto: Object.values(report.data.auto),
  },
})

export class ScoutPage extends Component<Props, State> {
  state = {
    submitting: false,
    redAlliance: null,
    blueAlliance: null,
    team: null,
    schema: null,
    comment: '',
    report: {
      autoName: '',
      data: {
        teleop: {},
        auto: {},
      },
    },
  }

  componentDidMount() {
    getEventInfo(this.props.eventKey)
      .then(event => getSchema(event.schemaId))
      .then(schema =>
        this.setState((s: State) => ({
          schema,
          report: {
            ...s.report,
            data: {
              teleop: schema.teleop.reduce(createEmptyFields, {}),
              auto: schema.auto.reduce(createEmptyFields, {}),
            },
          },
        })),
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
      this.setState({ submitting: true })
      Promise.all([
        submitReport(
          this.props.eventKey,
          this.props.matchKey,
          this.state.team,
          processReport(this.state.report),
        ),
        this.state.comment
          ? submitComment(
              this.props.eventKey,
              this.props.matchKey,
              this.state.team || '',
              { comment: this.state.comment },
            )
          : Promise.resolve(),
      ]).then(() =>
        route(`/events/${this.props.eventKey}/matches/${this.props.matchKey}`),
      )
    }
  }

  updateField = (gameStage: 'auto' | 'teleop', name: string) => (
    value: Field,
  ) => {
    this.setState((s: State) => ({
      report: {
        ...s.report,
        data: {
          ...s.report.data,
          [gameStage]: {
            ...s.report.data[gameStage],
            [name]: value,
          },
        },
      },
    }))
  }

  updateComment = (e: Event) =>
    this.setState({ comment: (e.target as HTMLInputElement).value })

  render(
    { eventKey, matchKey }: Props,
    { schema, redAlliance, blueAlliance, team, report, submitting }: State,
  ) {
    return (
      <Page name="Scout" back={`/events/${eventKey}/matches/${matchKey}`}>
        <form class={style.scout} onSubmit={this.onSubmit}>
          <h1>Scout {team && formatTeamNumber(team)}</h1>
          {blueAlliance && redAlliance && (
            <TeamPicker
              onChange={team => this.setState({ team })}
              blueAlliance={blueAlliance}
              redAlliance={redAlliance}
            />
          )}
          {schema || <Spinner />}
          <h2>Auto</h2>
          {schema &&
            schema.auto.map(stat => (
              <FieldCard
                type={stat.type}
                key={'auto' + stat.name}
                field={report.data.auto[stat.name]}
                onChange={this.updateField('auto', stat.name)}
              />
            ))}
          <h2>Teleop</h2>
          {schema &&
            schema.teleop.map(stat => (
              <FieldCard
                key={'teleop' + stat.name}
                type={stat.type}
                field={report.data.teleop[stat.name]}
                onChange={this.updateField('teleop', stat.name)}
              />
            ))}
          <TextInput label="Comments" onChange={this.updateComment} />
          <Button disabled={submitting || !isReportReady(this.state)}>
            {submitting ? 'Submitting' : 'Submit'}
          </Button>
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

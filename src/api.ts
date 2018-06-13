type PeregrineResponse<T> =
  | {
      data: T
    }
  | {
      error: string
    }

const get = <T extends any>(
  path: string,
  { authenticated = false }: { authenticated?: boolean } = {}
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const put = <T extends any>(
  path: string,
  data: any,
  { authenticated = false }: { authenticated?: boolean } = {}
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

interface BasicEventInfo {
  name: string // from TBA short name
  district?: string
  week?: number
  // UTC date
  startDate: string
  // UTC date
  endDate: string
  // Only if user is logged in
  starred?: false
  location: {
    lat: number
    lon: number
  }
}

export const getEvents = () => get<BasicEventInfo[]>('/events')

export const starEvent = (eventKey: string, starred: boolean) =>
  put<{}>(`/event/${eventKey}/star`, starred)

interface EventInfo extends BasicEventInfo {
  webcasts: {
    type: 'twitch' | 'youtube'
    url: string
  }
  location: {
    name: string
    lat: number
    lon: number
  }
}

export const getEventInfo = (eventKey: string) =>
  get<EventInfo>(`/event/${eventKey}/info`)

interface MatchInfo {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - match predicted time
  time: string
  // example: qm3
  key: string
  starred?: false
}

export const getEventMatches = (eventKey: string) =>
  get<MatchInfo[]>(`/event/${eventKey}/matches`)

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  get<MatchInfo>(`/event/${eventKey}/match/${matchKey}/info`)

// Webhook but only for ranking points and match score

export const getEventTeams = (eventKey: string) =>
  get<string[]>(`/event/${eventKey}/teams`)

// a stat is a summary representation of a field
interface BaseStat {
  statName: string
}

// a field is the details of something specific that happened during a match
interface BaseField {
  statName: string
  // 2018orwil
  event: string
  // qm1
  match: string
}

interface BooleanStat extends BaseStat {
  // total
  attempts: number
  // total
  successes: number
}

interface NumberStat extends BaseStat {
  attempts: {
    max: number
    avg: number
  }
  successes: {
    max: number
    avg: number
  }
}

interface BooleanField extends BaseField {
  attempted: boolean
  succeeded: boolean
}

interface NumberField extends BaseField {
  attempts: number
  successes: number
}

interface EnumField extends BaseField {
  value: string
}

type Stat = NumberStat | BooleanStat

type Field = NumberField | BooleanField | EnumField
type GraphableField = NumberField | BooleanField

type TeamTeleopStats = GraphableField[]
type TeamAutoStats = {
  modeName: string
  stats: GraphableField[]
}[]

interface TeamStats {
  team: string
  teleop: Stat
  auto: Stat
}

interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}

export const getEventStats = (eventKey: string) =>
  get<TeamStats[]>(`/event/${eventKey}/stats`)

export const getEventMatchStats = (eventKey: string, matchKey: string) =>
  get<TeamStatsWithAlliance[]>(`/event/${eventKey}/match/${matchKey}/stats`)

interface EventTeamInfo {
  // only if they have future matches
  nextMatch?: MatchInfo
  rank: number
  // ranking score
  rankingScore: number
}

export const getEventTeamInfo = (eventKey: string, team: string) =>
  get<EventTeamInfo>(`/event/${eventKey}/team/${team}/info`)

export const getEventTeamTeleopStats = (eventKey: string, team: string) =>
  get<TeamTeleopStats>(`/event/${eventKey}/team/${team}/stats/teleop`)

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  get<TeamAutoStats>(`/event/${eventKey}/team/${team}/stats/auto`)

export const getTeamTeleopStats = (team: string) =>
  get<TeamStats>(`/team/${team}/stats/teleop`)

export const getTeamAutoStats = (team: string) =>
  get<TeamAutoStats>(`/team/${team}/stats/auto`)

export const getTeamAutoModes = (team: string) =>
  get<string[]>(`/team/${team}/automodes`)

interface SubmittedReport {
  teleop: Field[]
  auto: Field[]
}

interface Report extends SubmittedReport {
  reporter: string
  reporterId: string
}

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport
) => put<{}>(`/event/${eventKey}/match/${matchKey}/reports/${team}`, report)

export const getEventMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport
) => get<Report[]>(`/event/${eventKey}/match/${matchKey}/reports/${team}`)

interface StatDescription {
  statName: string
  statKey: string
  type: 'boolean' | 'number' | 'enum'
}

interface Schema {
  teleop: StatDescription[]
  auto: StatDescription[]
}

export const getSchema = () => get<Schema>(`/schema`)

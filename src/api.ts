type PeregrineResponse<T> =
  | {
      data: T
    }
  | {
      error: string
    }

// Webhook but only for ranking points and match score

const getRequest = <T extends any>(
  path: string,
  { authenticated = false }: { authenticated?: boolean } = {}
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const deleteRequest = <T extends any>(
  path: string,
  { authenticated = false }: { authenticated?: boolean } = {}
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const putRequest = <T extends any>(
  path: string,
  data: any,
  { authenticated = false }: { authenticated?: boolean } = {}
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const postRequest = <T extends any>(
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
  location: {
    lat: number
    lon: number
  }
}

export const getEvents = () => getRequest<BasicEventInfo[]>('/events')

export const starEvent = (eventKey: string, starred: boolean) =>
  putRequest<null>(`/event/${eventKey}/star`, starred)

interface EventInfo extends BasicEventInfo {
  webcasts: {
    type: 'twitch' | 'youtube'
    url: string
  }[]
  location: {
    name: string
    lat: number
    lon: number
  }
}

export const getEventInfo = (eventKey: string) =>
  getRequest<EventInfo>(`/event/${eventKey}/info`)

interface MatchInfo {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - match predicted time
  time: string
  // example: qm3
  key: string
}

export const getEventMatches = (eventKey: string) =>
  getRequest<MatchInfo[]>(`/event/${eventKey}/matches`)

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  getRequest<MatchInfo>(`/event/${eventKey}/match/${matchKey}/info`)

export const getEventTeams = (eventKey: string) =>
  getRequest<string[]>(`/event/${eventKey}/teams`)

// a stat is a summary representation of a field
interface BaseStat {
  statName: string
}

// a field is the details of something specific that happened during a match
interface BaseField {
  statName: string
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

type Stat = NumberStat | BooleanStat

type Field = NumberField | BooleanField
type GraphableField = {
  // 2018orwil
  event: string
  // qm1
  match: string
} & (NumberField | BooleanField)

type TeamTeleopStats = GraphableField[]
type TeamAutoStats = {
  modeName: string
  stats: GraphableField[]
}[]

interface TeamStats {
  team: string
  teleop: Stat[]
  auto: Stat[]
}

interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}

export const getEventStats = (eventKey: string) =>
  getRequest<TeamStats[]>(`/event/${eventKey}/stats`)

export const getEventMatchStats = (eventKey: string, matchKey: string) =>
  getRequest<TeamStatsWithAlliance[]>(
    `/event/${eventKey}/match/${matchKey}/stats`
  )

interface EventTeamInfo {
  // only if they have future matches
  nextMatch?: MatchInfo
  rank: number
  // ranking score
  rankingScore: number
}

export const getEventTeamInfo = (eventKey: string, team: string) =>
  getRequest<EventTeamInfo>(`/event/${eventKey}/team/${team}/info`)

export const getEventTeamTeleopStats = (eventKey: string, team: string) =>
  getRequest<TeamTeleopStats>(`/event/${eventKey}/team/${team}/stats/teleop`)

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  getRequest<TeamAutoStats>(`/event/${eventKey}/team/${team}/stats/auto`)

export const getTeamTeleopStats = (team: string) =>
  getRequest<TeamStats>(`/team/${team}/stats/teleop`)

export const getTeamAutoStats = (team: string) =>
  getRequest<TeamAutoStats>(`/team/${team}/stats/auto`)

export const getTeamAutoModes = (team: string) =>
  getRequest<string[]>(`/team/${team}/automodes`)

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
) =>
  putRequest<null>(
    `/event/${eventKey}/match/${matchKey}/reports/${team}`,
    report
  )

export const getEventMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport
) =>
  getRequest<Report[]>(`/event/${eventKey}/match/${matchKey}/reports/${team}`)

interface StatDescription {
  statName: string
  statKey: string
  type: 'boolean' | 'number'
}

interface Schema {
  teleop: StatDescription[]
  auto: StatDescription[]
}

export const getSchema = () => getRequest<Schema>(`/schema`)

interface EditableUser {
  username: string
  name: string
  password: string
  admin?: boolean
}

interface UserInfo {
  username: string
  name: string
  admin?: true
}

// Anyone can create a user. For admins, the user will be created
// immediately, for non-admins, the user won't be created immediately
// and it will be added to the user request queue
export const createUser = (user: EditableUser) =>
  postRequest<number | false>(`/users`, user)
// Anyone can view the list of users
export const getUsers = () => getRequest<UserInfo[]>(`/users`)
// Anyone can view any user
export const getUser = (userId: number) =>
  getRequest<UserInfo>(`/users/${userId}`)
// Anyone can view anyone's stars
export const getStarredEvents = (userId: number) =>
  getRequest<string[]>(`/users/${userId}/stars`)
// Only admins can modify other users
export const modifyUser = (userId: number, user: EditableUser) =>
  putRequest<null>(`/users/${userId}`, user)
// Only admins can delete other users
export const deleteUser = (userId: number) =>
  deleteRequest<null>(`/users/${userId}`)

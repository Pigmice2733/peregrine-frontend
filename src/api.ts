type PeregrineResponse<T> =
  | {
      data: Readonly<T>
    }
  | {
      error: string
    }

const apiUrl =
  process.env.PEREGRINE_API_URL ||
  (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master')
    ? 'https://api.peregrine.ga:8081'
    : 'https://edge.api.peregrine.ga:8081'

const processResponse = <T extends any>(
  d: PeregrineResponse<T>,
): Promise<T> => {
  if ('error' in d) {
    return Promise.reject(d.error)
  }
  return Promise.resolve(d.data)
}

// Webhook but only for ranking points and match score

const getRequest = <T extends any>(
  path: string,
  { authenticated = false } = {},
) =>
  fetch(apiUrl + path)
    .then(d => d.json() as Promise<PeregrineResponse<T>>)
    .then(processResponse)

const deleteRequest = <T extends any>(
  path: string,
  { authenticated = false } = {},
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const putRequest = <T extends any>(
  path: string,
  data: any,
  { authenticated = false } = {},
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const patchRequest = <T extends any>(
  path: string,
  data: any,
  { authenticated = false } = {},
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

const postRequest = <T extends any>(
  path: string,
  data: any,
  { authenticated = false } = {},
): Promise<PeregrineResponse<T>> =>
  fetch(`https://api.pigmice.ga/$`).then(d => d.json())

export interface BasicEventInfo {
  key: string
  // from TBA short name
  name: string
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

export const createEvent = (event: EventInfo) =>
  putRequest<null>(`/events`, event)

export const getEvents = () => getRequest<BasicEventInfo[]>('/events')

// Only authenticated users can star events
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
  redScore?: number
  blueScore?: number
}

export const createEventMatch = (
  eventKey: string,
  match: MatchInfo & {
    // scheduled match time
    time: string
  },
) => putRequest<null>(`/event/${eventKey}/matches`, match)

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
  // qm1
  match: string
} & (NumberField | BooleanField)

type EventKey = {
  // 2018orwil
  eventKey: string
}

type TeamTeleopStats = (EventKey & GraphableField)[]
type TeamAutoStats = ({
  modeName: string
  // in order by match time
  stats: (EventKey & GraphableField)[]
})[]

type EventTeamTeleopStats = GraphableField[]
type EventTeamAutoStats = ({
  modeName: string
  // in order by match time
  stats: GraphableField[]
})[]

interface TeamStats {
  team: string
  teleop: Stat[]
  auto: Stat[]
}

interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}

// these are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  getRequest<TeamStats[]>(`/event/${eventKey}/stats`)

// stats for the teams in a match
// these stats describe a team's performance in all matches at this event,
// not just this match
export const getEventMatchStats = (eventKey: string, matchKey: string) =>
  getRequest<TeamStatsWithAlliance[]>(
    `/event/${eventKey}/match/${matchKey}/stats`,
  )

interface EventTeamInfo {
  // only if they have future matches at this event
  nextMatch?: MatchInfo
  rank?: number
  rankingScore?: number
}

export const getEventTeamInfo = (eventKey: string, team: string) =>
  getRequest<EventTeamInfo>(`/event/${eventKey}/team/${team}/info`)

export const getEventTeamTeleopStats = (eventKey: string, team: string) =>
  getRequest<EventTeamTeleopStats>(
    `/event/${eventKey}/team/${team}/stats/teleop`,
  )

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  getRequest<EventTeamAutoStats>(`/event/${eventKey}/team/${team}/stats/auto`)

export const getTeamTeleopStats = (team: string) =>
  getRequest<TeamTeleopStats>(`/team/${team}/stats/teleop`)

export const getTeamAutoStats = (team: string) =>
  getRequest<TeamAutoStats>(`/team/${team}/stats/auto`)

export const getTeamAutoModes = (team: string) =>
  getRequest<string[]>(`/team/${team}/automodes`)

interface SubmittedReport {
  teleop: Field[]
  auto: Field[]
  autoName: string
}

interface Report extends SubmittedReport {
  reporter: string
  reporterId: string
}

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport,
) =>
  putRequest<null>(
    `/event/${eventKey}/match/${matchKey}/reports/${team}`,
    report,
  )

export const getEventMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport,
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

interface Roles {
  isAdmin: boolean
  isVerified: boolean
}

interface UserInfo {
  username: string
  firstName: string
  lastName: string
  roles: Roles
}

interface EditableUser extends UserInfo {
  password: string
  // Only admins can set roles, and they can do so for any user
  roles: Roles
}

// Anyone can create a user. For admins the users will be verified automatically
// for non-admins or non-authenticated users the user will not be verified and
// will require admin approval
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
// Anyone can modify themselves
// Only admins can modify other users
export const modifyUser = (userId: number, user: Partial<EditableUser>) =>
  patchRequest<null>(`/users/${userId}`, user)
// Anyone can delete themselves
// Only admins can delete other users
export const deleteUser = (userId: number) =>
  deleteRequest<null>(`/users/${userId}`)

export const authenticate = (username: string, password: string) =>
  postRequest<{ jwt: string }>(`/authenticate`, { username, password })

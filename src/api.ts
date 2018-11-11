type PeregrineResponse<T> =
  | {
      data: Readonly<T>
    }
  | {
      error: string
    }

const apiUrl =
  (process.env.PEREGRINE_API_URL
    ? process.env.PEREGRINE_API_URL
    : process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://api.peregrine.ga:8081'
      : 'https://edge.api.peregrine.ga:8081') + '/'

const processResponse = <T extends any>(
  d: PeregrineResponse<T>,
): Promise<T> => {
  if ('error' in d) {
    return Promise.reject(d.error)
  }
  return Promise.resolve(d.data)
}

// Webhook but only for ranking points and match score

export const getRequest = <T extends any>(path: string) =>
  fetch(apiUrl + path)
    .then(d => d.json() as Promise<PeregrineResponse<T>>)
    .then(processResponse)

export const deleteRequest = <T extends any>(
  path: string,
): Promise<PeregrineResponse<T>> => fetch(apiUrl + path).then(d => d.json())

export const putRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())

export const patchRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())

export const postRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())

export interface BasicEventInfo {
  key: string
  // from TBA short name
  name: string
  // abbreviated district name
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

// Only admins can create custom events on their realm
export const createEvent = (event: EventInfo) =>
  postRequest<null>(`events`, event)

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = () => getRequest<BasicEventInfo[]>('events')

// Only authenticated users can star events
export const starEvent = (eventKey: string, starred: boolean) =>
  putRequest<null>(`events/${eventKey}/star`, starred)

interface EventInfo extends BasicEventInfo {
  webcasts: {
    type: 'twitch' | 'youtube'
    url: string
  }[]
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
}

// Only TBA events, and custom events from their realm are available to
// non-super-admins.
export const getEventInfo = (eventKey: string) =>
  getRequest<EventInfo>(`events/${eventKey}`)

export interface MatchInfo {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - predicted match time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}

type MatchList = (MatchInfo & {
  // UTC date - scheduled match time
  scheduledTime: string
})[]

// Only admins can create matches for their realm
export const createEventMatch = (
  eventKey: string,
  match: MatchInfo & {
    // UTC Date - scheduled match time
    time: string
  },
) => postRequest<null>(`events/${eventKey}/matches`, match)

export const getEventMatches = (eventKey: string) =>
  getRequest<MatchList>(`events/${eventKey}/matches`)

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  getRequest<MatchInfo>(`events/${eventKey}/matches/${matchKey}`)

export const getEventTeams = (eventKey: string) =>
  getRequest<string[]>(`events/${eventKey}/teams`)

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

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  getRequest<TeamStats[]>(`events/${eventKey}/stats`)

// Stats for the teams in a match.
// These stats describe a team's performance in all matches at this event,
// not just this match.
export const getEventMatchStats = (eventKey: string, matchKey: string) =>
  getRequest<TeamStatsWithAlliance[]>(
    `events/${eventKey}/matches/${matchKey}/stats`,
  )

interface EventTeamInfo {
  // only if they have future matches at this event
  nextMatch?: MatchInfo
  rank?: number
  rankingScore?: number
}

export const getEventTeamInfo = (eventKey: string, team: string) =>
  getRequest<EventTeamInfo>(`events/${eventKey}/teams/${team}`)

export const getEventTeamTeleopStats = (eventKey: string, team: string) =>
  getRequest<EventTeamTeleopStats>(
    `events/${eventKey}/teams/${team}/stats/teleop`,
  )

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  getRequest<EventTeamAutoStats>(`events/${eventKey}/teams/${team}/stats/auto`)

export const getTeamTeleopStats = (team: string) =>
  getRequest<TeamTeleopStats>(`teams/${team}/stats/teleop`)

export const getTeamAutoStats = (team: string) =>
  getRequest<TeamAutoStats>(`teams/${team}/stats/auto`)

export const getTeamAutoModes = (team: string) =>
  getRequest<string[]>(`teams/${team}/automodes`)

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
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    report,
  )

export const getEventMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
) =>
  getRequest<Report[]>(`events/${eventKey}/matches/${matchKey}/reports/${team}`)

interface StatDescription {
  statName: string
  statKey: string
  type: 'boolean' | 'number'
}

interface Schema {
  teleop: StatDescription[]
  auto: StatDescription[]
}

export const getSchema = () => getRequest<Schema>(`schema`)

interface Roles {
  isSuperAdmin: boolean
  isAdmin: boolean
  isVerified: boolean
}

interface UserInfo {
  username: string
  firstName: string
  lastName: string
  roles: Roles
  stars: string[]
}

interface EditableUser extends UserInfo {
  password: string
  // Only admins can set roles, and they can do so for any user in their realm.
  // Super-admins can set roles for any user.
  roles: Roles
}

// Anyone can create a user. For admins the users will be verified
// automatically, for non-admins or non-authenticated users the user will not be
// verified and will require admin approval. Super-admins can create verified
// users in any realm, admins can only do so in their own realm.
export const createUser = (user: EditableUser) =>
  postRequest<number | false>(`users`, user)
// Super-admins can view the list of all users, admins can view the list of
// users in their realm.
export const getUsers = () => getRequest<UserInfo[]>(`users`)
// Super-admins can view any user, admins can view any user in their realm,
// users can view themselves
export const getUser = (userId: number) =>
  getRequest<UserInfo>(`users/${userId}`)
// Anyone can modify themselves, admins can modify other users in their realm,
// super-admins can modify any user
export const modifyUser = (userId: number, user: Partial<EditableUser>) =>
  patchRequest<null>(`users/${userId}`, user)
// Anyone can delete themselves, admins can delete other users in their realm,
// super-admins can delete any user.
export const deleteUser = (userId: number) =>
  deleteRequest<null>(`users/${userId}`)

export const authenticate = (username: string, password: string) =>
  postRequest<{ jwt: string }>(`authenticate`, { username, password })

interface PatchRealm {
  // Team name, eg Pigmice
  name: string
  // Whether report data should be publicly available outside this realm
  shareReports: boolean
}

interface Realm extends PatchRealm {
  // Team key, eg frc2733
  team: string
}

// Only super-admins can create new realms. Creating a new realm will return an
// initial admin user for that realm.
export const createRealm = (realm: Realm) =>
  postRequest<EditableUser>(`realms`, realm)
// Super-admins can view a list of realms
export const getRealms = () => getRequest<Realm[]>(`realms`)
// Super-admins can view a specific realm, admins can view their own realm
export const getRealm = (team: string) => getRequest<Realm>(`realms/${team}`)
// Super-admins can modify realms, admins can modify their own realm
export const modifyRealm = (team: string, realm: Partial<PatchRealm>) =>
  patchRequest<null>(`realms/${team}`, realm)
// Super-admins can delete realms, admins can delete their own realm
export const deleteRealm = (team: string) =>
  deleteRequest<null>(`realms/${team}`)

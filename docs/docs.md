# `/authenticate`

## `POST`

Response is the JWT

### Request

```ts
type Data = {
  username: string
  password: string
}
```


### Response

```ts
type Data = string
```

# `/event/{eventKey}/info`

## `GET`

### Response

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }[]
  location: {
    name: string
    lat: number
    lon: number
  }
  key: string
  // from TBA short name
  name: string
  district?: string
  week?: number
  // UTC date
  startDate: string
  // UTC date
  endDate: string
}
```

# `/event/{eventKey}/match/{matchKey}/info`

## `GET`

### Response

```ts
type Data = {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - match predicted time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}
```

# `/event/{eventKey}/match/{matchKey}/reports/{team}`

## `PUT`

### Request

```ts
type Data = {
  teleop: (
    | {
        attempts: number
        successes: number
        statName: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
  auto: (
    | {
        attempts: number
        successes: number
        statName: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
  autoName: string
}
```


### Response

```ts
type Data = null
```


## `GET`

### Response

```ts
type Data = {
  reporter: string
  reporterId: string
  teleop: (
    | {
        attempts: number
        successes: number
        statName: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
  auto: (
    | {
        attempts: number
        successes: number
        statName: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
  autoName: string
}[]
```

# `/event/{eventKey}/match/{matchKey}/stats`

## `GET`

stats for the teams in a match
these stats describe a team's performance in all matches at this event,
not just this match

### Response

```ts
type Data = {
  alliance: "red" | "blue"
  team: string
  teleop: (
    | {
        attempts: {
          max: number
          avg: number
        }
        successes: {
          max: number
          avg: number
        }
        statName: string
      }
    | {
        // total
        attempts: number
        // total
        successes: number
        statName: string
      })[]
  auto: (
    | {
        attempts: {
          max: number
          avg: number
        }
        successes: {
          max: number
          avg: number
        }
        statName: string
      }
    | {
        // total
        attempts: number
        // total
        successes: number
        statName: string
      })[]
}[]
```

# `/event/{eventKey}/matches`

## `GET`

### Response

```ts
type Data = {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - match predicted time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}[]
```

# `/event/{eventKey}/star`

## `PUT`

Only authenticated users can star events

### Request

```ts
type Data = boolean
```


### Response

```ts
type Data = null
```

# `/event/{eventKey}/stats`

## `GET`

these are the stats for every team at an event, describing their performance
only at that event

### Response

```ts
type Data = {
  team: string
  teleop: (
    | {
        attempts: {
          max: number
          avg: number
        }
        successes: {
          max: number
          avg: number
        }
        statName: string
      }
    | {
        // total
        attempts: number
        // total
        successes: number
        statName: string
      })[]
  auto: (
    | {
        attempts: {
          max: number
          avg: number
        }
        successes: {
          max: number
          avg: number
        }
        statName: string
      }
    | {
        // total
        attempts: number
        // total
        successes: number
        statName: string
      })[]
}[]
```

# `/event/{eventKey}/team/{team}/info`

## `GET`

### Response

```ts
type Data = {
  // only if they have future matches at this event
  nextMatch?: {
    redAlliance: string[]
    blueAlliance: string[]
    // UTC date - match predicted time
    time: string
    // example: qm3
    key: string
    redScore?: number
    blueScore?: number
  }
  rank: number
  // ranking score
  rankingScore?: number
}
```

# `/event/{eventKey}/team/{team}/stats/auto`

## `GET`

### Response

```ts
type Data = {
  modeName: string
  // in order by match time
  stats: (
    | {
        // qm1
        match: string
        attempts: number
        successes: number
        statName: string
      }
    | {
        // qm1
        match: string
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
}[]
```

# `/event/{eventKey}/team/{team}/stats/teleop`

## `GET`

### Response

```ts
type Data = (
  | {
      // qm1
      match: string
      attempts: number
      successes: number
      statName: string
    }
  | {
      // qm1
      match: string
      attempted: boolean
      succeeded: boolean
      statName: string
    })[]
```

# `/event/{eventKey}/teams`

## `GET`

### Response

```ts
type Data = string[]
```

# `/events`

## `GET`

### Response

```ts
type Data = {
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
}[]
```

# `/schema`

## `GET`

### Response

```ts
type Data = {
  teleop: {
    statName: string
    statKey: string
    type: "number" | "boolean"
  }[]
  auto: {
    statName: string
    statKey: string
    type: "number" | "boolean"
  }[]
}
```

# `/team/{team}/automodes`

## `GET`

### Response

```ts
type Data = string[]
```

# `/team/{team}/stats/auto`

## `GET`

### Response

```ts
type Data = {
  modeName: string
  // in order by match time
  stats: (
    | {
        // 2018orwil
        eventKey: string
        // qm1
        match: string
        attempts: number
        successes: number
        statName: string
      }
    | {
        // 2018orwil
        eventKey: string
        // qm1
        match: string
        attempted: boolean
        succeeded: boolean
        statName: string
      })[]
}[]
```

# `/team/{team}/stats/teleop`

## `GET`

### Response

```ts
type Data = (
  | {
      // 2018orwil
      eventKey: string
      // qm1
      match: string
      attempts: number
      successes: number
      statName: string
    }
  | {
      // 2018orwil
      eventKey: string
      // qm1
      match: string
      attempted: boolean
      succeeded: boolean
      statName: string
    })[]
```

# `/users/{userId}/stars`

## `GET`

Anyone can view anyone's stars

### Response

```ts
type Data = string[]
```

# `/users/{userId}`

## `GET`

Anyone can view any user

### Response

```ts
type Data = {
  username: string
  firstname: string
  lastname: string
  admin?: true
  verified: boolean
}
```


## `PATCH`

Anyone can modify themselves
Only admins can modify other users

### Request

```ts
type Data = {
  username?: string
  firstname?: string
  lastname?: string
  password?: string
  // only an admin can set a user's admin status
  admin?: boolean
  // only an admin can set a user's verified status
  verified?: boolean
}
```


### Response

```ts
type Data = null
```


## `DELETE`

Anyone can delete themselves
Only admins can delete other users

### Response

```ts
type Data = null
```

# `/users`

## `POST`

Anyone can create a user. For admins the users will be verified automatically
for non-admins or non-authenticated users the user will not be verified and
will require admin approval

### Request

```ts
type Data = {
  username: string
  firstname: string
  lastname: string
  password: string
  // only an admin can set a user's admin status
  admin?: boolean
  // only an admin can set a user's verified status
  verified?: boolean
}
```


### Response

```ts
type Data = number | false
```


## `GET`

Anyone can view the list of users

### Response

```ts
type Data = {
  username: string
  firstname: string
  lastname: string
  admin?: true
  verified: boolean
}[]
```

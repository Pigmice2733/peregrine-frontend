# Index

- [`/authenticate`](#authenticate)
- [`/events/{eventKey}/matches/{matchKey}/reports/{team}`](#eventseventkeymatchesmatchkeyreportsteam)
- [`/events/{eventKey}/matches/{matchKey}/stats`](#eventseventkeymatchesmatchkeystats)
- [`/events/{eventKey}/matches/{matchKey}`](#eventseventkeymatchesmatchkey)
- [`/events/{eventKey}/matches`](#eventseventkeymatches)
- [`/events/{eventKey}/star`](#eventseventkeystar)
- [`/events/{eventKey}/stats`](#eventseventkeystats)
- [`/events/{eventKey}/teams/{team}/stats/auto`](#eventseventkeyteamsteamstatsauto)
- [`/events/{eventKey}/teams/{team}/stats/teleop`](#eventseventkeyteamsteamstatsteleop)
- [`/events/{eventKey}/teams/{team}`](#eventseventkeyteamsteam)
- [`/events/{eventKey}/teams`](#eventseventkeyteams)
- [`/events/{eventKey}`](#eventseventkey)
- [`/events`](#events)
- [`/schema`](#schema)
- [`/teams/{team}/automodes`](#teamsteamautomodes)
- [`/teams/{team}/stats/auto`](#teamsteamstatsauto)
- [`/teams/{team}/stats/teleop`](#teamsteamstatsteleop)
- [`/users/{userId}`](#usersuserid)
- [`/users`](#users)

# `/authenticate`

## `POST`

### Request

```ts
type Data = {
  username: string
  password: string
}
```


### Response

```ts
type Data = {
  jwt: string
}
```

# `/events/{eventKey}/matches/{matchKey}/reports/{team}`

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

# `/events/{eventKey}/matches/{matchKey}/stats`

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

# `/events/{eventKey}/matches/{matchKey}`

## `GET`

### Response

```ts
type Data = {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - predicted match time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}
```

# `/events/{eventKey}/matches`

## `PUT`

Only admins can create matches

### Request

```ts
type Data = {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC Date - scheduled match time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
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
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - predicted match time
  time: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
  // UTC date - scheduled match time
  scheduledTime: string
}[]
```

# `/events/{eventKey}/star`

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

# `/events/{eventKey}/stats`

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

# `/events/{eventKey}/teams/{team}/stats/auto`

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

# `/events/{eventKey}/teams/{team}/stats/teleop`

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

# `/events/{eventKey}/teams/{team}`

## `GET`

### Response

```ts
type Data = {
  // only if they have future matches at this event
  nextMatch?: {
    redAlliance: string[]
    blueAlliance: string[]
    // UTC date - predicted match time
    time: string
    // example: qm3
    key: string
    redScore?: number
    blueScore?: number
  }
  rank?: number
  rankingScore?: number
}
```

# `/events/{eventKey}/teams`

## `GET`

### Response

```ts
type Data = string[]
```

# `/events/{eventKey}`

## `GET`

### Response

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }[]
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
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
}
```

# `/events`

## `PUT`

Only admins can create events

### Request

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }[]
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
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

# `/teams/{team}/automodes`

## `GET`

### Response

```ts
type Data = string[]
```

# `/teams/{team}/stats/auto`

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

# `/teams/{team}/stats/teleop`

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

# `/users/{userId}`

## `GET`

Admins can view any user, users can view themselves

### Response

```ts
type Data = {
  username: string
  firstName: string
  lastName: string
  roles: {
    isAdmin: boolean
    isVerified: boolean
  }
  stars: string[]
}
```


## `PATCH`

Anyone can modify themselves
Only admins can modify other users

### Request

```ts
type Data = {
  password?: string
  // Only admins can set roles, and they can do so for any user
  roles?: {
    isAdmin: boolean
    isVerified: boolean
  }
  username?: string
  firstName?: string
  lastName?: string
  stars?: string[]
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
  password: string
  // Only admins can set roles, and they can do so for any user
  roles: {
    isAdmin: boolean
    isVerified: boolean
  }
  username: string
  firstName: string
  lastName: string
  stars: string[]
}
```


### Response

```ts
type Data = number | false
```


## `GET`

Admins can view the list of users

### Response

```ts
type Data = {
  username: string
  firstName: string
  lastName: string
  roles: {
    isAdmin: boolean
    isVerified: boolean
  }
  stars: string[]
}[]
```

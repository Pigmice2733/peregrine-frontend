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
- [`/realms/{id}`](#realmsid)
- [`/realms`](#realms)
- [`/schemas/year/{year}`](#schemasyearyear)
- [`/schemas/{id}`](#schemasid)
- [`/schemas`](#schemas)
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

## `GET`

### Response

```ts
type Data = {
  // Not sent if the reporter account has been deleted.
  reporterId?: string
  data: {
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
  }
  autoName: string
}[]
```


## `PUT`

### Request

```ts
type Data = {
  data: {
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
  }
  autoName: string
}
```


### Response

```ts
type Data = null
```

# `/events/{eventKey}/matches/{matchKey}/stats`

## `GET`

Stats for the teams in a match.
These stats describe a team's performance in all matches at this event,
not just this match.

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
      }
    | {
        // total
        attempts: number
        // total
        successes: number
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
      }
    | {
        // total
        attempts: number
        // total
        successes: number
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
  time?: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}
```

# `/events/{eventKey}/matches`

## `POST`

Only admins can create matches for their realm

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
  time?: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
  // UTC date - scheduled match time
  scheduledTime?: string
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

These are the stats for every team at an event, describing their performance
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
      }
    | {
        // total
        attempts: number
        // total
        successes: number
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
      }
    | {
        // total
        attempts: number
        // total
        successes: number
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
    time?: string
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

Only TBA events, and custom events from their realm are available to
non-super-admins.

### Response

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }[]
  // the ID of the schema attached to the event
  schemaId: string
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
  key: string
  // the ID of the realm the event belongs to
  realmId?: string
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

## `POST`

Only admins can create custom events on their realm

### Request

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }[]
  // the ID of the schema attached to the event
  schemaId: string
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
  key: string
  // the ID of the realm the event belongs to
  realmId?: string
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

Getting events will only list TBA events, unless a user is signed in. If the
user is a super-admin, they will see all events, otherwise they will see all
TBA events and additionally all the custom events on their realm.

### Response

```ts
type Data = {
  key: string
  // the ID of the realm the event belongs to
  realmId?: string
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

# `/realms/{id}`

## `DELETE`

Super-admins can delete realms, admins can delete their own realm

### Response

```ts
type Data = null
```


## `GET`

Public realms can be fetched. If logged-in, the user's realm is also available.

### Response

```ts
type Data = {
  id: number
  // Realm name, eg Pigmice
  name: string
  // Whether report data should be publicly available outside this realm
  shareReports: boolean
}
```


## `PATCH`

Super-admins can modify realms, admins can modify their own realm

### Request

```ts
type Data = {
  // Realm name, eg Pigmice
  name?: string
  // Whether report data should be publicly available outside this realm
  shareReports?: boolean
}
```


### Response

```ts
type Data = null
```

# `/realms`

## `POST`

Only super-admins can create new realms. Creating a new realm will return the
ID of that realm.

### Request

```ts
type Data = {
  // Realm name, eg Pigmice
  name: string
  // Whether report data should be publicly available outside this realm
  shareReports: boolean
}
```


### Response

```ts
type Data = number
```


## `GET`

Public realms will be returned. If logged-in, the user's realm will also be returned.

### Response

```ts
type Data = {
  id: number
  // Realm name, eg Pigmice
  name: string
  // Whether report data should be publicly available outside this realm
  shareReports: boolean
}[]
```

# `/schemas/year/{year}`

## `GET`

Anyone can view the standard schema for a specific year's game

### Response

```ts
type Data = {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  teleop: {
    name: string
    type: "number" | "boolean"
  }[]
  auto: {
    name: string
    type: "number" | "boolean"
  }[]
}
```

# `/schemas/{id}`

## `GET`

Standard FRC schemas, and schemas from public realms can be viewed by anyone.
Members of a realm can view any schemas from their realm, super-admins can
view any schema.

### Response

```ts
type Data = {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  teleop: {
    name: string
    type: "number" | "boolean"
  }[]
  auto: {
    name: string
    type: "number" | "boolean"
  }[]
}
```


## `PATCH`

Admins can patch schemas for any event in their realms, or for FRC events if
their realm's data is private.

### Request

```ts
type Data = (
  | {
      path: string
      op: "add"
      value: any
    }
  | {
      path: string
      op: "remove"
    }
  | {
      path: string
      op: "replace"
      value: any
    }
  | {
      path: string
      op: "copy"
      from: string
    }
  | {
      path: string
      op: "move"
      from: string
    }
  | {
      path: string
      op: "test"
      value: any
    })[]
```


### Response

```ts
type Data = null
```

# `/schemas`

## `POST`

Admins can create schemas for any event in their realms, EXCEPT for public
realms which must use a standard schema for main-season FRC games. Only
super-admins can create the standard schemas for main-season FRC games.

### Request

```ts
type Data = {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  teleop: {
    name: string
    type: "number" | "boolean"
  }[]
  auto: {
    name: string
    type: "number" | "boolean"
  }[]
}
```


### Response

```ts
type Data = null
```


## `GET`

Standard FRC schemas, and schemas from public realms can be viewed by anyone.
Members of a realm can view any schemas from their realm, super-admins can
view any schema.

### Response

```ts
type Data = {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  teleop: {
    name: string
    type: "number" | "boolean"
  }[]
  auto: {
    name: string
    type: "number" | "boolean"
  }[]
}[]
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

## `DELETE`

Anyone can delete themselves, admins can delete other users in their realm,
super-admins can delete any user.

### Response

```ts
type Data = null
```


## `GET`

Super-admins can view any user, admins can view any user in their realm,
users can view themselves

### Response

```ts
type Data = {
  username: string
  firstName: string
  lastName: string
  roles: {
    isSuperAdmin: boolean
    isAdmin: boolean
    isVerified: boolean
  }
  stars: string[]
}
```


## `PATCH`

Anyone can modify themselves, admins can modify other users in their realm,
super-admins can modify any user

### Request

```ts
type Data = {
  password?: string
  // Only admins can set roles, and they can do so for any user in their realm.
  roles?: {
    isSuperAdmin: boolean
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

# `/users`

## `POST`

Anyone can create a user. For admins the users will be verified
automatically, for non-admins or non-authenticated users the user will not be
verified and will require admin approval. Super-admins can create verified
users in any realm, admins can only do so in their own realm.

### Request

```ts
type Data = {
  password: string
  // Only admins can set roles, and they can do so for any user in their realm.
  roles: {
    isSuperAdmin: boolean
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

Super-admins can view the list of all users, admins can view the list of
users in their realm.

### Response

```ts
type Data = {
  id: number
  username: string
  firstName: string
  lastName: string
  roles: {
    isSuperAdmin: boolean
    isAdmin: boolean
    isVerified: boolean
  }
  stars: string[]
}[]
```

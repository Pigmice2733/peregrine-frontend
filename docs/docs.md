# `/event/{eventKey}/info`

## `GET`

### Response

```ts
type Data = {
  webcasts: {
    type: "twitch" | "youtube"
    url: string
  }
  location: {
    name: string
    lat: number
    lon: number
  }
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
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        value: string
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
  auto: (
    | {
        attempts: number
        successes: number
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        value: string
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
}
```


### Response

```ts
type Data = {}
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
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        value: string
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
  auto: (
    | {
        attempts: number
        successes: number
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        value: string
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
}[]
```

# `/event/{eventKey}/match/{matchKey}/stats`

## `GET`

### Response

```ts
type Data = {
  alliance: "red" | "blue"
  team: string
  teleop:
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
      }
  auto:
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
      }
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
}[]
```

# `/event/{eventKey}/star`

## `PUT`

### Request

```ts
type Data = boolean
```


### Response

```ts
type Data = {}
```

# `/event/{eventKey}/stats`

## `GET`

### Response

```ts
type Data = {
  team: string
  teleop:
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
      }
  auto:
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
      }
}[]
```

# `/event/{eventKey}/team/{team}/info`

## `GET`

### Response

```ts
type Data = {
  // only if they have future matches
  nextMatch?: {
    redAlliance: string[]
    blueAlliance: string[]
    // UTC date - match predicted time
    time: string
    // example: qm3
    key: string
  }
  rank: number
  // ranking score
  rankingScore: number
}
```

# `/event/{eventKey}/team/{team}/stats/auto`

## `GET`

### Response

```ts
type Data = {
  modeName: string
  stats: (
    | {
        attempts: number
        successes: number
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
}[]
```

# `/event/{eventKey}/team/{team}/stats/teleop`

## `GET`

### Response

```ts
type Data = (
  | {
      attempts: number
      successes: number
      statName: string
      // 2018orwil
      event: string
      // qm1
      match: string
    }
  | {
      attempted: boolean
      succeeded: boolean
      statName: string
      // 2018orwil
      event: string
      // qm1
      match: string
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
    type: "number" | "boolean" | "enum"
  }[]
  auto: {
    statName: string
    statKey: string
    type: "number" | "boolean" | "enum"
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
  stats: (
    | {
        attempts: number
        successes: number
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      }
    | {
        attempted: boolean
        succeeded: boolean
        statName: string
        // 2018orwil
        event: string
        // qm1
        match: string
      })[]
}[]
```

# `/team/{team}/stats/teleop`

## `GET`

### Response

```ts
type Data = {
  team: string
  teleop:
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
      }
  auto:
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
      }
}
```

# `/users/{userId}/stars`

## `GET`

### Response

```ts
type Data = string[]
```

# `/users/{userId}`

## `GET`

### Response

```ts
type Data = {
  username: string
  name: string
  admin?: true
}
```


## `PUT`

### Request

```ts
type Data = {
  username: string
  name: string
  password: string
  admin?: boolean
}
```


### Response

```ts
type Data = {}
```


## `DELETE`

### Response

```ts
type Data = {}
```

# `/users`

## `POST`

### Request

```ts
type Data = {
  username: string
  name: string
  password: string
  admin?: boolean
}
```


### Response

```ts
type Data = number
```


## `GET`

### Response

```ts
type Data = {
  username: string
  name: string
  admin?: true
}[]
```

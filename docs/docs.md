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
  // Only if user is logged in
  starred?: false
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
  starred?: false
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
  starred?: false
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
    starred?: false
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
  // Only if user is logged in
  starred?: false
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

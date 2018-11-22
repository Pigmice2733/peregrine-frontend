# Index

- [`/events/{eventKey}/matches/{matchKey}`](#eventseventkeymatchesmatchkey)
- [`/events/{eventKey}/matches`](#eventseventkeymatches)
- [`/events/{eventKey}`](#eventseventkey)
- [`/events`](#events)
- [`/users/{userId}`](#usersuserid)
- [`/users`](#users)

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

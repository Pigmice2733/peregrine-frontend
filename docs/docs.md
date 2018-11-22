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

Only TBA events, and custom events from their realm are available to
non-super-admins.

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

# `/users/{userId}`

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

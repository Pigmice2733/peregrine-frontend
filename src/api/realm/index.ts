export interface BaseRealm {
  // Realm name, eg Pigmice
  name: string
  // Whether report data should be publicly available outside this realm
  shareReports: boolean
}

export interface Realm extends BaseRealm {
  id: number
}

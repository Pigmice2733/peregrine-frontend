export const matchTypes = {
  qm: 0,
  ef: 1,
  qf: 2,
  sf: 3,
  f: 4,
}

export type MatchType = keyof typeof matchTypes

export const matchNames: { [K in MatchType]: string } = {
  qm: 'Qual',
  ef: 'Octos',
  qf: 'Quarters',
  sf: 'Semis',
  f: 'Finals',
}

export const getMatchType = (k: string) =>
  ((/^\D+/.exec(k) as any) as [MatchType])[0]

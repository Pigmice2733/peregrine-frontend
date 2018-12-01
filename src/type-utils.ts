export type falsy = null | undefined | false | '' | 0

export type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } &
  B

// export type JSONPatch<T extends {}> = ({ path: string } & (
//   | {
//       op: 'add'
//       value: Exclude<T[keyof T], undefined>
//     }
//   | {
//       op: 'remove'
//     }
//   | {
//       op: 'replace'
//       value: Exclude<T[keyof T], undefined>
//     }
//   | {
//       op: 'copy'
//       from: string
//     }
//   | {
//       op: 'move'
//       from: string
//     }
//   | {
//       op: 'test'
//       value: Exclude<T[keyof T], undefined>
//     }))[]

export type JSONPatch<T extends {}> = string[]

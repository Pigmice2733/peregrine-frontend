export * from 'type-fest'
export type Falsy = null | undefined | false | '' | 0

export type JSONPatch = ({ path: string } & (
  | {
      op: 'add'
      value: any
    }
  | {
      op: 'remove'
    }
  | {
      op: 'replace'
      value: any
    }
  | {
      op: 'copy'
      from: string
    }
  | {
      op: 'move'
      from: string
    }
  | {
      op: 'test'
      value: any
    }
))[]

export type UnPromise<T extends Promise<any>> = T extends Promise<infer Z>
  ? Z
  : never

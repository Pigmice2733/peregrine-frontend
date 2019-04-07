export type Falsy = null | undefined | false | '' | 0

export type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } &
  B

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
    }))[]

export type UnPromise<T extends Promise<any>> = T extends Promise<infer Z>
  ? Z
  : never

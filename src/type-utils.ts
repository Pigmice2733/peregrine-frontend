import { JSX, VNode, ComponentType } from 'preact'
import { Except } from 'type-fest'
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

export type ElementName = keyof JSX.IntrinsicElements
type ElementProps<El extends ElementName = ElementName> = Except<
  JSX.IntrinsicElements[El],
  'ref' | 'as' | 'key'
>
export type ComponentName = ElementName | ((props: any, context?: any) => VNode)

export type PropsOf<C extends ComponentName> = C extends ElementName
  ? ElementProps<C>
  : C extends ComponentType<infer P>
  ? P
  : never

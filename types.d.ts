declare module '*.css' {
  const styles: { [key: string]: string }
  export default styles
}

declare const module: {
  hot?: {
    accept: () => void
  }
}

declare const process: {
  env: {
    NODE_ENV?: string
    PEREGRINE_API_URL?: string
    IPDATA_API_KEY?: string
    BRANCH?: string
    ROLLUP?: 'true' | 'false'
  }
}

declare module 'preact/debug' {}

// so that autocomplete does not try to import from 'preact/hooks/src'
declare module 'preact/hooks' {
  export * from 'preact/hooks/src'
}

declare module 'matchit' {
  enum SegmentType {
    static = 0,
    parameter = 1,
    wildcard = 2,
    optional = 3,
  }
  export interface Segment {
    old: string
    type: SegmentType
    val: string
  }
  type Route = Segment[]
  /**
   * The route is split and parsed into a "definition" array of objects.
   * @param route A single URL pattern
   */
  export function parse(route: string): Route
  /**
   * Returns the route's encoded definition. See matchit.parse
   * @param url The true URL you want to be matched
   * @param routes All "parsed" route definitions, via matchit.parse
   */
  export function match(url: string, routes: Route[]): Route
  /**
   * Returns an object an object of key:val pairs, as defined by your route pattern
   * @param url The URL (pathname) to evaluate
   * @param match The route definition to use, via matchit.match
   */
  export function exec(url: string, match: Route): { [key: string]: string }
}

declare module 'qss' {
  type RawVal = string | number | boolean
  type Val = RawVal | RawVal[]
  interface QueryObj {
    [key: string]: Val
  }
  export const encode = (params: QueryObj, prefix?: string) => string
  export const decode = (query: string) => QueryObj
}

declare module 'chunks' {
  const chunks: string[]
  export default chunks
}

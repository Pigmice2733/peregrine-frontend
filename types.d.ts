declare module '*.css' {
  const styles: { [key: string]: string }
  export default styles
}

declare const process: {
  env: { [key: string]: string }
}

declare module 'preact/devtools/devtools' {
  export const initDevTools: () => void
}

declare module 'clsx' {
  type Item =
    | boolean
    | string
    | number
    | Item[]
    | null
    | undefined
    | { [key: string]: Item }
  const clsx: (...input: Item[]) => string
  export default clsx
}

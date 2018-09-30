declare module '*.css' {
  const styles: { [key: string]: string }
  export default styles
}

declare const process: {
  env: { [key: string]: string }
}

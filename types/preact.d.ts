import * as Preact from 'preact'

declare module 'preact' {
  namespace h {
    namespace JSX {
      interface IntrinsicElements {
        feFuncA: SVGAttributes
      }
    }
  }
}

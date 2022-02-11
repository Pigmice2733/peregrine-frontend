import preact from 'preact'
export {}

declare global {
  const h: typeof import('preact').h
  const Fragment: typeof import('preact').Fragment
  export import h = preact.h
  namespace JSX {
    import JSX = preact.JSX
    type IntrinsicElements = JSX.IntrinsicElements
    type IntrinsicAttributes = JSX.IntrinsicAttributes
    type ElementChildrenAttribute = JSX.ElementChildrenAttribute
    type Element = JSX.Element
    type HTMLAttributes<
      RefType extends EventTarget = EventTarget
    > = JSX.HTMLAttributes<RefType>
  }
}

declare module 'preact' {
  namespace h {
    namespace JSX {
      interface IntrinsicElements {
        feFuncA: SVGAttributes
      }
    }
  }
}

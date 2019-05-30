export const resolveUrl = (path: string) =>
  new URL(path, window.location.href).href

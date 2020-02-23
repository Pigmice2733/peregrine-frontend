import { decode, encode } from 'qss'

export const cleanYoutubeUrl = (url: string) => {
  const queryString = new URL(url).search.slice(1).replace(/\?/g, '&')
  const queryParams = decode(queryString)
  const outputParams = encode({ start: queryParams.t })
  return `https://www.youtube.com/embed/${queryParams.v}?${outputParams}`
}

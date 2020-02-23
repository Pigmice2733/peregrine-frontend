import { cleanYoutubeUrl } from '.'

test.each([
  [
    'https://www.youtube.com/watch?v=QIl8RhxM9Zs',
    'https://www.youtube.com/embed/QIl8RhxM9Zs?',
  ],
  [
    'https://www.youtube.com/watch?v=tm_wJo-Bi6Q?t=675',
    'https://www.youtube.com/embed/tm_wJo-Bi6Q?start=675',
  ],
  [
    'https://www.youtube.com/watch?v=tm_wJo-Bi6Q&t=675',
    'https://www.youtube.com/embed/tm_wJo-Bi6Q?start=675',
  ],
  [
    'https://www.youtube.com/watch?t=675&v=tm_wJo-Bi6Q',
    'https://www.youtube.com/embed/tm_wJo-Bi6Q?start=675',
  ],
])('Cleans url %s to %s', (input, expected) => {
  expect(cleanYoutubeUrl(input)).toEqual(expected)
})

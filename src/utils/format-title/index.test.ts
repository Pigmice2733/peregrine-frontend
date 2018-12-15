import { formatTitle } from '.'

test('formats title', () => {
  expect(
    formatTitle(`asdf
   ASDF4_asdf   
  4-cube`),
  ).toMatchInlineSnapshot(`"Asdf Asdf4 Asdf 4-Cube"`)
})

import LoadData from '.'
import { render } from '@calebeby/preact-testing-library'
import { h } from 'preact'

test('resolving promise', async () => {
  let resolveData: (value: string) => void = Promise.resolve
  const fakePromise = new Promise<string>(resolve => (resolveData = resolve))
  const getData = () => fakePromise
  const { container, findByTestId } = render(
    <LoadData
      data={{ theData: getData }}
      renderSuccess={({ theData }) =>
        theData ? <pre data-testid="data">{theData}</pre> : <h1>no data</h1>
      }
    />,
  )
  expect(container.firstElementChild).toMatchInlineSnapshot(`
<h1>
  no data
</h1>
`)
  resolveData('HIYA')
  expect(await findByTestId('data')).toMatchInlineSnapshot(`
<pre
  data-testid="data"
>
  HIYA
</pre>
`)
})

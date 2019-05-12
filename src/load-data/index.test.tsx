import LoadData from '.'
import { render, wait } from 'preact-testing-library'
import { h } from 'preact'

test('resolving promise', async () => {
  let resolveData: (value: string) => void = Promise.resolve
  const fakePromise = new Promise<string>(resolve => (resolveData = resolve))
  const getData = () => fakePromise
  const { container, getByTestId } = render(
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
  await wait(() => getByTestId('data'))
  expect(container.firstElementChild).toMatchInlineSnapshot(`
<pre
  data-testid="data"
>
  HIYA
</pre>
`)
})

import { render } from '@calebeby/preact-testing-library'
import { ErrorBoundary, useErrorEmitter } from '.'
import { h } from 'preact'
import { useEffect } from 'preact/hooks'

test('catches thrown error in child tree', async () => {
  const ThrowingComponent = () => {
    throw new Error('error thrown')
  }

  jest.spyOn(console, 'error').mockImplementation(() => {})
  const container = render(
    <ErrorBoundary>
      <h1>Hi</h1>
      <ThrowingComponent />
    </ErrorBoundary>,
  )
  await container.findByText('error thrown')
  expect(console.error).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          [Error: error thrown],
        ],
      ],
      "results": Array [
        Object {
          "type": "return",
          "value": undefined,
        },
      ],
    }
  `)
})

test('catches emitted error', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const ErrorEmittingComponent = () => {
    const emitError = useErrorEmitter()
    useEffect(() => {
      Promise.reject(new Error('its an error')).catch(emitError)
    }, [])
    return <div>Inner Component</div>
  }
  const container = render(
    <ErrorBoundary>
      <h1>Hi</h1>
      <ErrorEmittingComponent />
    </ErrorBoundary>,
  )
  expect(container.container).toMatchInlineSnapshot(`
    <div>
      <h1>
        Hi
      </h1>
      <div>
        Inner Component
      </div>
    </div>
  `)
  await container.findByText('its an error')
  expect((console.error as jest.Mock).mock.calls).toHaveLength(1)
  expect((console.error as jest.Mock).mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      [Error: its an error],
    ]
  `)
})

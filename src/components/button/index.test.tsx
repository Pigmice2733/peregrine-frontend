import Button from '.'
import { render, fireEvent } from '@testing-library/preact'

test('button', () => {
  const clickHandler = vi.fn()
  const { container } = render(<Button onClick={clickHandler}>Hello</Button>)
  const button = container.firstElementChild as HTMLElement
  expect(clickHandler).not.toHaveBeenCalled()
  fireEvent.click(button)
  expect(clickHandler).toHaveBeenCalledTimes(1)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button
      class="mocked-css-1 mocked-css-0"
    >
      Hello
    </button>
  `)
})

test('renders an `a` element for `href`', () => {
  const { container } = render(
    <Button class="caleb" href="google.com">
      Googlez
    </Button>,
  )
  expect(container.firstChild).toMatchInlineSnapshot(`
    <a
      class="mocked-css-1 caleb mocked-css-0"
      href="google.com"
    >
      Googlez
    </a>
  `)
})

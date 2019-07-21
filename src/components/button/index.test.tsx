import Button from '.'
import { render, fireEvent } from '@calebeby/preact-testing-library'
import { h } from 'preact'

test('button', () => {
  const clickHandler = jest.fn()
  const { container } = render(<Button onClick={clickHandler}>Hello</Button>)
  const button = container.firstElementChild as HTMLElement
  expect(clickHandler).not.toHaveBeenCalled()
  fireEvent.click(button)
  expect(clickHandler).toHaveBeenCalledTimes(1)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button
      class="buttonStyle_b1uioams"
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
      class="buttonStyle_b1uioams caleb"
      href="google.com"
    >
      Googlez
    </a>
  `)
})

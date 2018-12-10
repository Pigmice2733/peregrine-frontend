import Button from '.'
import { render, cleanup, fireEvent } from 'preact-testing-library'
import { h } from 'preact'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('button', () => {
  const clickHandler = jest.fn()
  const { container } = render(<Button onClick={clickHandler}>Hello</Button>)
  const button = container.firstElementChild as HTMLElement
  expect(clickHandler).not.toHaveBeenCalled()
  fireEvent.click(button)
  expect(clickHandler).toHaveBeenCalledTimes(1)
  expect(container.firstChild).toMatchInlineSnapshot(`
<button
  class="button "
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
  class="button caleb"
  href="google.com"
>
  Googlez
</a>
`)
})

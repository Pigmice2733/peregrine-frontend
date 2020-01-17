import tabbables from './tabbables'

const tababblesStr = tabbables.join(',')

export const moveFocusInside = (el: HTMLElement) => {
  if (el.matches(tababblesStr)) return el.focus()
  const firstFocusableElement = el.querySelector(tababblesStr)
  if (firstFocusableElement) (firstFocusableElement as HTMLElement).focus()
}

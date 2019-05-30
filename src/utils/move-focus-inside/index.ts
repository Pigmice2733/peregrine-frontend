import tabbables from './tabbables'

const tababblesStr = tabbables.join(',')

export const moveFocusInside = (el: HTMLElement) => {
  if (el.matches(tababblesStr)) return el.focus()
  // TODO: Should this handle elements with modified tabindex, like https://github.com/theKashey/focus-lock/blob/master/src/utils/tabOrder.js
  const firstFocusableElement = el.querySelector(tababblesStr)
  if (firstFocusableElement) (firstFocusableElement as HTMLElement).focus()
}

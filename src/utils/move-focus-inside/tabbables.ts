// From https://github.com/theKashey/focus-lock/blob/master/src/utils/tabbables.js

// Commented out things we don't use (at least yet) to save bytes

const tabbables = [
  'button:enabled:not([readonly])',
  'select:enabled:not([readonly])',
  'textarea:enabled:not([readonly])',
  'input:enabled:not([readonly])',

  'a[href]',
  // 'area[href]',

  // 'iframe',
  // 'object',
  // 'embed',

  '[tabindex]',
  // '[contenteditable]',
  // '[autofocus]',
]

export default tabbables

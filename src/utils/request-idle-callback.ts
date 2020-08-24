declare global {
  interface Window {
    requestIdleCallback(callback: () => void): void // actually returns a number but my polyfill doesn't so we are going to pretend it doesn't
  }
}

/**
 * How often to check for "busy"
 */
const INTERVAL = 2

/**
 * How many MS have to have passed since the last "busy check" for it to have been considered busy
 */
const BUSY_THRESHHOLD = 3

/**
 * Simple requestIdleCallback polyfill
 * Principle: setInterval() runs with inaccurate timing when the thread is busy,
 * and with accurate time if the thread is free. Checks if the timing is accurate,
 * if it is it executes the task, otherwise it waits
 * Inspired by https://github.com/GoogleChromeLabs/quicklink/blob/master/src/request-idle-callback.mjs
 * and https://github.com/aFarkas/requestIdleCallback
 */
const requestIdleCallbackPolyfill: typeof window.requestIdleCallback = (
  callback,
) => {
  let lastCalled = Date.now()
  const intervalId = setInterval(() => {
    const timeDiff = -lastCalled + (lastCalled = Date.now())
    if (timeDiff > BUSY_THRESHHOLD) return
    callback()
    clearInterval(intervalId)
  }, INTERVAL)
}

export const requestIdleCallback =
  // eslint-disable-next-line caleb/@typescript-eslint/no-unnecessary-condition
  self.requestIdleCallback || requestIdleCallbackPolyfill

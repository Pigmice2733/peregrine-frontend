const SAVED_EVENTS = 'savedEvents'
const keys = [SAVED_EVENTS]

export const setEventSaved = (eventKey: string) => {
  const savedEvents = JSON.parse(localStorage.getItem(SAVED_EVENTS) || '[]')
  savedEvents.push(eventKey)
  localStorage.setItem(SAVED_EVENTS, JSON.stringify(eventKey))
}

export const clearPrefs = () => keys.forEach(k => localStorage.removeItem(k))

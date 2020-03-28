import { useEffect, useState } from 'preact/hooks'

const savedTeams = []
const savedTeamsListeners = []

export const saveTeam = (teamNum: string, eventKey: string) => {
  savedTeams.push({ teamNum, eventKey })
  savedTeamsListeners.forEach((listener) => {
    listener(savedTeams)
  })
}

export const useSavedTeams = () => {
  const [_savedTeams, setSavedTeams] = useState(savedTeams)
  useEffect(() => {
    savedTeamsListeners.push(setSavedTeams)
  }, [])
  return _savedTeams
}

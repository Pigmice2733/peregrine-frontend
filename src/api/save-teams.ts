import { useEffect, useState } from 'preact/hooks'

interface SavedTeam {
  teamNum: string
  eventKey: string
}

let savedTeams: SavedTeam[] = []
const savedTeamsListeners: ((savedTeams: SavedTeam[]) => void)[] = []

const loadFromLocalStorage = () => {
  savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
}

loadFromLocalStorage()
const handleDataChange = () => {
  savedTeamsListeners.forEach((listener) => {
    listener(savedTeams)
  })
  localStorage.setItem('savedTeams', JSON.stringify(savedTeams))
}
export const saveTeam = (teamNum: string, eventKey: string) => {
  loadFromLocalStorage()
  const isTeamSaved = savedTeams.some(
    (team) => team.teamNum === teamNum && team.eventKey === eventKey,
  )
  if (!isTeamSaved) {
    savedTeams.push({ teamNum, eventKey })
  }
  handleDataChange()
}

export const removeTeam = (teamNum: string, eventKey: string) => {
  loadFromLocalStorage()
  savedTeams = savedTeams.filter(
    (team) => teamNum !== team.teamNum || eventKey !== team.eventKey,
  )
  handleDataChange()
}

export const useSavedTeams = () => {
  const [_savedTeams, setSavedTeams] = useState(savedTeams)
  useEffect(() => {
    savedTeamsListeners.push(setSavedTeams)
  }, [])
  return _savedTeams
}

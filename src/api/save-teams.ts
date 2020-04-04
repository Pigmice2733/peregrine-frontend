import { useEffect, useState } from 'preact/hooks'

let savedTeams = []
const savedTeamsListeners = []

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

// http://localhost:2733/events/2020waspo/teams/2147
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

// TODO:
// - Add event name to menu
// - Replace menu icon with different icon
// - Replace the button with a star or something

// DONE:
// - Make sure you can't save a team @ event multiple times / "Save team" should say something else if it is already saved

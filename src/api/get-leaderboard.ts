import { request } from './base'

export interface LeaderboardItem {
  reporterId: number
  reports: number
}

export const getLeaderboard = () =>
  request<LeaderboardItem[]>('GET', 'leaderboard')

import { request } from './base'

export interface LeaderboardItem {
  reporterId: number
  reports: number
}

export const getLeaderboard = (year?: number | string) =>
  request<LeaderboardItem[]>('GET', 'leaderboard', { year })

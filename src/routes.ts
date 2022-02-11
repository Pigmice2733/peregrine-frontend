const routes = [
  {
    path: '/',
    component: () => import('./routes/home'),
  },
  {
    path: '/events/:eventKey',
    component: () => import('./routes/event'),
  },
  {
    path: '/events/:eventKey/analysis',
    component: () => import('./routes/event-analysis'),
  },
  {
    path: '/events/:eventKey/matches/:matchKey',
    component: () => import('./routes/event-match'),
  },
  {
    path: '/events/:eventKey/matches/:matchKey/scout',
    component: () => import('./routes/scout'),
  },
  {
    path: '/events/:eventKey/teams/:teamNum',
    component: () => import('./routes/event-team'),
  },
  {
    path: '/events/:eventKey/teams/:teamNum/comments',
    component: () => import('./routes/event-team-comments'),
  },
  {
    path: '/events/:eventKey/teams/:teamNum/matches',
    component: () => import('./routes/event-team-matches'),
  },
  {
    path: '/users',
    component: () => import('./routes/users'),
  },
  {
    path: '/signup',
    component: () => import('./routes/signup'),
  },
  {
    path: '/login',
    component: () => import('./routes/login'),
  },
  {
    path: '/leaderboard',
    component: () => import('./routes/leaderboard'),
  },
  {
    path: '/saved-reports',
    component: () => import('./routes/saved-reports'),
  },
  {
    path: '/saved-reports/:reportKey',
    component: () => import('./routes/saved-report'),
  },
  {
    path: '/users/:userId',
    component: () => import('./routes/user'),
  },
  {
    path: '/users/:userId/reports',
    component: () => import('./routes/user-reports'),
  },
  {
    path: '/reports/:reportId',
    component: () => import('./routes/report'),
  },
]

export default routes

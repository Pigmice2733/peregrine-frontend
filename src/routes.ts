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
]

export default routes

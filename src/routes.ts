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
    path: '/events/:eventKey/admin',
    component: () => import('./routes/event-admin'),
  },
  {
    path: '/events/:eventKey/admin/create-match',
    component: () => import('./routes/create-match'),
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
    path: '/register',
    component: () => import('./routes/register'),
  },
  {
    path: '/login',
    component: () => import('./routes/login'),
  },
  {
    path: '/leaderboard',
    component: () => import('./routes/leaderboard'),
  },
]

export default routes

const DeskTopPage = resolve => require(['../views/desktop/index.vue'], resolve)
const Dashboard = resolve => require(['../views/dashboard/index.vue'], resolve)
const DeskTopModuleRouter = {}
DeskTopModuleRouter.routers = [
  {
    path: '/desktop',
    component: DeskTopPage,
    name: 'DeskTopPage',
    meta: {
      title: 'DeskTop',
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    meta: {
      title: 'dashboard',
    }
  }
]
export default DeskTopModuleRouter

const alarmManage = resolve => require(['../views/alarm-manage'], resolve)

const Router = {}
Router.routers = [
    {
        path: '/monitor/alarm-manage',
        component: alarmManage,
        name: 'alarmManage',
        meta: {
            title: 'alarmManage',
        }
    },
]
export default Router

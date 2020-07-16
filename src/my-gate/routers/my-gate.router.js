const APIManage = resolve => require(['../views/api-manage/index.vue'], resolve)
const APICreate = resolve => require(['../views/api-create/APICreatePage.vue'], resolve)
const APIViewPage = resolve => require(['../views/api-create/APIViewPage.vue'], resolve)
const FilterBind = resolve => require(['../views/filter-bind/index.vue'], resolve)
const Instance = resolve => require(['../views/instance/index.vue'], resolve)
const InstanceMonitor = resolve => require(['../views/instance-monitor/index.vue'], resolve)
const Router = {}
Router.routers = [
    {
        path: '/myGate/APIManage',
        component: APIManage,
        name: 'APIManage',
        meta: {
            title: 'APIManage',
        }
    },
    {
        path: '/myGate/APICreate',
        component: APICreate,
        name: 'APICreate',
        meta: {
            title: 'APICreate',
            parentnode: {'APIManage': '/myGate/APIManage'}
        }
    },
    {
        path: '/myGate/APIView',
        component: APIViewPage,
        name: 'APIViewPage',
        meta: {
            title: 'APIViewPage',
            parentnode: {'APIManage': '/myGate/APIManage'}
        }
    },
    {
        path: '/myGate/FilterBind',
        component: FilterBind,
        name: 'FilterBind',
        meta: {
            title: 'FilterBind',
        }
    },

    {
        path: '/myGate/instance',
        component: Instance,
        name: 'instance',
        meta: {
            title: 'instance',
        }
    },

    {
        path: '/myGate/instance-monitor',
        component: InstanceMonitor,
        name: 'InstanceMonitor',
        meta: {
            title: 'InstanceMonitor',
        }
    },
]
export default Router

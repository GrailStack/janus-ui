const ClusterManage = resolve => require(['../views/clusterManage'], resolve);
const FilterManage = resolve => require(['../views/filterManage'], resolve);
const ClusterConfig = resolve => require(['../views/clusterConfig'], resolve);
const Audit = resolve => require(['../views/audit'], resolve);


const GatewayManagerRouter = {
    routers: [{
        path: '/gatewayManage/clusterManage',
        component: ClusterManage,
        name: 'clusterManage',
        meta: {
            title: '集群管理'
        }
    },
        {
            path: '/gatewayManage/filterManage',
            component: FilterManage,
            name: 'filterManage',
            meta: {
                title: 'filter管理'
            }
        },
        {
            path: '/gatewayManage/clusterConfig',
            component: ClusterConfig,
            name: 'clusterConfig',
            meta: {
                title: '集群配置'
            }
        },
        {
            path: '/gatewayManage/audit',
            component: Audit,
            name: 'Audit',
            meta: {
                title: '审计'
            }
        }

    ]
}
export default GatewayManagerRouter

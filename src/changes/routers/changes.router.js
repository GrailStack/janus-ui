const Submit = resolve => require(['../views/submit-apply'], resolve)
const Approve = resolve => require(['../views/apply-manage'], resolve)
const Release = resolve => require(['../views/publish'], resolve)
const PublishMange = resolve => require(['../views/publish-manage'], resolve)
const Router = {}
Router.routers = [
    {
        path: '/changes/submit',
        component: Submit,
        name: 'submit',
        meta: {
            title: 'submit',
        }
    },
    {
        path: '/changes/apply-manage',
        component: Approve,
        name: 'Approve',
        meta: {
            title: 'Approve',
        }
    },
    {
        path: '/changes/release',
        component: Release,
        name: 'Release',
        meta: {
            title: 'Release',
        }
    },
    {
        path: '/changes/publish-manage',
        component: PublishMange,
        name: 'PublishMange',
        meta: {
            title: 'PublishMange',
        }
    },
]
export default Router

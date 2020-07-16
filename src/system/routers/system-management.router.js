const Menu = resolve => require(['../views/menu'], resolve);
const Role = resolve => require(['../views/role'], resolve)
const User = resolve => require(['../views/user'], resolve)
const MetaData = resolve => require(['../views/metaData'], resolve)
const SystemManagementRouter = {
  routers: [{
    path: '/system/menu',
    component: Menu,
    name: 'SystemMenuManagement',
    meta: {
      title: '菜单管理'
    }
  },{
    path: '/system/role',
    component: Role,
    name: 'SystemRoleManagement',
    meta: {
      title: '角色管理'
    }
  },{
    path: '/system/user',
    component: User,
    name: 'SystemUserManagement',
    meta: {
      title: '用户管理'
    }
  },{
    path: '/system/metaData',
    component: MetaData,
    name: 'SystemMetaDataManagement',
    meta: {
      title: '元数据管理'
    }
  }]
}
export default SystemManagementRouter

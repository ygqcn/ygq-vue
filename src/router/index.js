
import NotFound from '../views/common/404.vue'
import Home from '../views/common/home.vue'
import Organization from '../views/organization'
import User from '../views/user'
import Login from '../views/login'
let routes = [
  {
    path: '/login',
    component: Login,
    name: '登陆',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '首页',
    iconCls: 'el-icon-menu',
    children: [
      { path: '/user/user-index',
        component: User,
        name: '用户管理'},
      { path: '/organization/organization-index',
        component: Organization,
        name: '组织机构'
      }
    ]
  },

  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]

export default routes

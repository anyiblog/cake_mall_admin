import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes banner mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '控制台', icon: 'dashboard' }
        }]
    },

    {
        path: '/cake',
        component: Layout,
        redirect: '/cake/cake_list',
        name: 'Cake',
        meta: { title: '蛋糕管理', icon: 'example' },
        children: [
            {
                path: 'cake_list',
                name: 'CakeList',
                component: () => import('@/views/cake_list/index'),
                meta: { title: '所有蛋糕', icon: 'cake.js' }
            },
            {
                path: 'cake_add',
                name: 'CakeAdd',
                component: () => import('@/views/tree/index'),
                meta: { title: '添加蛋糕', icon: 'tree' }
            }
        ]
    },

    {
        path: '/media_lib',
        component: Layout,
        redirect: '/media_lib/index',
        name: 'MediaLib',
        meta: { title: '媒体库', icon: 'form' },
        children: [
            {
                path: 'upload',
                name: 'MediaLib',
                component: () => import('@/views/media_lib/upload'),
                meta: { title: '上传文件', icon: 'form' }
            },
            {
                path: 'index',
                name: 'MediaLib',
                component: () => import('@/views/media_lib/index'),
                meta: { title: '媒体库', icon: 'form' }
            }
        ]
    },

    {
        path: '/banner',
        component: Layout,
        redirect: '/banner',
        name: 'Banner',
        meta: {
            title: '幻灯片',
            icon: 'nested'
        },
        children: [
            {
                path: 'banner_list',
                component: () => import('@/views/banner/banner_list'),
                name: 'bannerList',
                meta: { title: '幻灯片模块列表' }
            },
            {
                path: 'banner_add',
                component: () => import('@/views/banner/banner_add'),
                name: 'bannerAdd',
                meta: { title: '添加幻灯片模块' }
            },
            {
                path: 'banner_item_add',
                component: () => import('@/views/banner/banner_item_add'),
                name: 'bannerItemAdd',
                meta: { title: '添加幻灯片子项' }
            },
            {
                path: 'banner_management',
                component: () => import('@/views/banner/banner_management'), // Parent router-view
                name: 'bannerManagement',
                meta: { title: '幻灯片管理' }
            },
        ]
    },

    {
        path: 'external-link',
        component: Layout,
        children: [
            {
                path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                meta: { title: 'External Link', icon: 'link' }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router

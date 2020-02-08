import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单（无需鉴权）

router.beforeEach(async(to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 检测是否登录
    const hasToken = getToken()

    if (hasToken) { //检查Token
        if (to.path === '/login') { // 已登录再进入Login页面，将重定向到主页
            next({ path: '/' })
            NProgress.done()
        } else {
            const hasGetUserInfo = store.getters.name
            if (hasGetUserInfo) { //是否含有用户信息
                next()
            } else { // 删除Token 并重新登录
                await store.dispatch('user/resetToken')
                Message.error('请重新登录')
                next(`/login?redirect=${to.path}`)
                NProgress.done()
            }
        }
    } else { // Token不存在
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // 无权访问的页面将重定向到login页
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

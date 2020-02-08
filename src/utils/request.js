import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            console.log(store.getters.token)
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['token'] = getToken()
        }
        console.log(config)
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use((response) => {
        const res = response.data
        console.log(res)

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 0) {
            Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50001 token授权权限 50008非法token 50012其他客户端登录 50014Token过期
            if (res.code === 50001 || res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('检测到账号变化，您可以继续停留在此页面，或再次登录。', res.msg, {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    }, (error) => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service

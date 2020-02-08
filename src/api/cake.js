import request from '@/utils/request'

export function getCakeList(limit, page) {
    let params = { limit, page }
    return request({
        url: '/admin/CakeList',
        method: 'get',
        params
    })
}

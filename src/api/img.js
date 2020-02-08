import request from '@/utils/request'
import qs from 'qs'

export function getTagList() {
    return request({
        url: '/admin/TagList',
        method: 'get'
    })
}

export function getImgList(tag, limit, page) {
    let params = { tag, limit, page }
    return request({
        url: '/admin/ImgList',
        method: 'get',
        params
    })
}

export function ImgTagUpdate(oldTagId, newTagId, imgId) {
    let data = qs.stringify({ oldTagId, newTagId, imgId })
    return request({
        url: '/admin/ImgTagUpdate',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data
    })
}

export function deleteImgList(imgUrl) {
    let data = qs.stringify({ imgUrl })
    return request({
        url: '/DeleteFile',
        method: 'post',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    })
}

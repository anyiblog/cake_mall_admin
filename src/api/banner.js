import request from '@/utils/request'
import qs from 'qs'

export function GetBannerList() {
    return request({
        url: '/admin/BannerList',
        method: 'get'
    })
}

export function CreateBanner(bannerName, bannerDescription, deletePermiss) {
    let data = qs.stringify({ bannerName, bannerDescription, deletePermiss })
    return request({
        url: '/admin/CreateBanner',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data
    })
}

export function UpdateBanner(bannerId, bannerName, bannerDescription, deletePermiss) {
    let data = qs.stringify({ bannerId, bannerName, bannerDescription, deletePermiss })
    return request({
        url: '/admin/UpdateBanner',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data
    })
}

export function CreateBannerItem(imgUrl, bannerId, bannerItemType) {
    let data = qs.stringify({ imgUrl, bannerId, bannerItemType })
    console.log(data)
    return request({
        url: '/admin/CreateBannerItem',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data
    })
}

export function DeleteBanner(bannerId) {
    let data = qs.stringify({ bannerId })
    return request({
        url: '/admin/DeleteBanner',
        method: 'post',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    })
}

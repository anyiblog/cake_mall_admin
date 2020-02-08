import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/Login',
    method: 'POST',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/User/Logout',
    method: 'post'
  })
}

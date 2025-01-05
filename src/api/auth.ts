import { Login, Register } from '@/domain/auth'
import request from './index'

export function login(params: Login) {
    return request({
        url: '/users/login',
        method: 'post',
        data: params
    })
}

export function register(params: Register) {
    return request({
        url: '/users/register',
        method: 'post',
        data: params
    })
}
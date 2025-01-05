import { Login, Register } from '@/domain/auth'
import request from './index'

export function login(params: Login) {
    return request({
        url: '/login',
        method: 'post',
        data: params
    })
}

export function register(params: Register) {
    return request({
        url: '/register',
        method: 'post',
        data: params
    })
}
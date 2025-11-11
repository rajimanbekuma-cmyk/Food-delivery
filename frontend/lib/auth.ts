import Cookies from 'js-cookie'
import { authAPI } from './api'

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 })
}

export const getToken = () => {
  return Cookies.get('token')
}

export const removeToken = () => {
  Cookies.remove('token')
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const getUser = async () => {
  try {
    const response = await authAPI.getMe()
    return response.data.user
  } catch (error) {
    return null
  }
}


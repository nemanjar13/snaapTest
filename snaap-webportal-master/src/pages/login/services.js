import axios from 'axios'
import { API_LOGIN, API_SOCIAL_LOGIN } from '../../utils/constant'

export async function SocialLogin (data) {
  try {
    const response = axios.post(API_SOCIAL_LOGIN, data)
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

export async function NormalLogin (data) {
  try {
    const response = axios.post(API_LOGIN, data)
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

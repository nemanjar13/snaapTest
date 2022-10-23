import axios from 'axios'
import { API_SIGN_UP } from '../../utils/constant'

export async function CreateUser (data) {
  try {
    const response = axios.post(API_SIGN_UP, data)
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

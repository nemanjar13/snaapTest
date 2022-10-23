import axios from 'axios'
import { API_USER_PROFILE, API_FILE_UPLOAD } from '../utils/constant'

export async function GetUserProfile () {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const response = axios.get(API_USER_PROFILE, { headers: headers })
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

export async function UpdateUserProfile (data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const response = axios.patch(API_USER_PROFILE, data, { headers: headers })
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

export async function FileUpload (data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    const response = axios.post(API_FILE_UPLOAD, data, { headers: headers })
    return Promise.resolve(response)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

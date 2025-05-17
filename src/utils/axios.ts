import axiosVanilla from 'axios'
import { API_BASE_URL, COOKIE_KEYS } from './constants'
import Cookies from 'js-cookie'

const axios = axiosVanilla.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axios.interceptors.request.use(
  async (config) => {
    const token = Cookies.get(COOKIE_KEYS.JWT)
    if (token) config.headers.authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axios

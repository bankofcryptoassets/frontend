import { COOKIE_KEYS } from '@/utils/constants'
import { useCookies } from 'react-cookie'
import { jwtDecode } from 'jwt-decode'

export const useAuth = () => {
  const [cookies] = useCookies([COOKIE_KEYS.JWT], { doNotParse: true })

  const token = cookies[COOKIE_KEYS.JWT]

  return { isAuth: !!token, token, userId: retrieveUserId(token) }
}

type JwtPayload = {
  id: string
  address: string
  chainId: number
  domain: string
  nonce: string
  iat: number
  exp: number
}

const retrieveUserId = (token: string | null) => {
  if (!token) return null
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded?.id
  } catch {
    return null
  }
}

import { COOKIE_KEYS } from '@/utils/constants'
import { useCookies } from 'react-cookie'

export const useAuth = () => {
  const [cookies] = useCookies([COOKIE_KEYS.JWT], {
    doNotParse: true,
  })

  const token = cookies[COOKIE_KEYS.JWT]

  return { isAuth: !!token, token }
}

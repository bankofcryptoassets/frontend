import useAsyncEffect from '@/hooks/useAsyncEffect'
import { useState } from 'react'
import { isAuthAction } from './actions'

type Optional<T> = T | undefined | null

export const useIsAuth = () => {
  const [isAuth, setIsAuth] = useState<Optional<boolean>>()

  useAsyncEffect(async () => {
    const { isAuth } = await isAuthAction()
    setIsAuth(isAuth)
  }, [])

  return { isAuth }
}

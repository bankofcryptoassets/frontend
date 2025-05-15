import { jwtVerify } from 'jose'

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    )
    return payload
  } catch {
    throw new Error('Invalid token')
  }
}

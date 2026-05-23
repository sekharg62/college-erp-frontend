import {
  AUTH_STORAGE_KEYS,
  type UserRole,
} from '../constants/authStorage'

export type StoredUser<T extends object> = T & { role: UserRole }

export type AuthSession<TUser extends object = StoredUser<object>> = {
  accessToken: string
  tokenType: string
  user: TUser
}

export function loadAuthSession<TUser extends StoredUser<object>>(
  role: UserRole,
): AuthSession<TUser> | null {
  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  const tokenType = localStorage.getItem(AUTH_STORAGE_KEYS.tokenType)
  const userRaw = localStorage.getItem(AUTH_STORAGE_KEYS.user)

  if (!accessToken || !tokenType || !userRaw) {
    return null
  }

  try {
    const user = JSON.parse(userRaw) as TUser
    if (user.role !== role) {
      return null
    }
    return { accessToken, tokenType, user }
  } catch {
    clearAuthSession()
    return null
  }
}

export function saveAuthSession<TUser extends StoredUser<object>>(
  session: AuthSession<TUser>,
) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.accessToken)
  localStorage.setItem(AUTH_STORAGE_KEYS.tokenType, session.tokenType)
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(session.user))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.tokenType)
  localStorage.removeItem(AUTH_STORAGE_KEYS.user)
}

/**
 * Contexto de autenticación de DishCover.
 * Mantiene el usuario activo, el token JWT y las acciones de sesión.
 *
 * @author Manuel García Nieto
 */
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ApiUser, fetchCurrentUser, loginUser, RegisterPayload, registerUser } from '@/services/api'

type User = {
  username: string
  email: string
  firstName: string
  lastName: string
}

type AuthContextValue = {
  token: string | null
  user: User
  login: (username: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const demoUser: User = {
  username: 'Manuel',
  email: 'manuel.garcia@dishcover.local',
  firstName: 'Manuel',
  lastName: 'García Nieto',
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapUser(apiUser: ApiUser, fallbackUsername = demoUser.username): User {
  return {
    username: apiUser.username ?? fallbackUsername,
    email: apiUser.email ?? demoUser.email,
    firstName: apiUser.firstName ?? demoUser.firstName,
    lastName: apiUser.lastName ?? demoUser.lastName,
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User>(demoUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: async (username, password) => {
        const response = await loginUser(username, password)
        setToken(response.token)

        try {
          const apiUser = await fetchCurrentUser(response.token)
          setUser(mapUser(apiUser, username))
        } catch {
          setUser((currentUser) => ({ ...currentUser, username }))
        }
      },
      register: async (payload) => {
        await registerUser(payload)
      },
      logout: () => {
        setToken(null)
        setUser(demoUser)
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}

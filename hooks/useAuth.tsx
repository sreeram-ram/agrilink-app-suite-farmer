import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { blink } from '@/lib/blink'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
export interface UserProfile {
  id: string
  userId: string
  role: 'customer' | 'farmer' | 'driver' | 'admin'
  displayName: string | null
  phone: string | null
  avatarUrl: string | null
  address: string | null
  city: string | null
}

export interface AuthState {
  user: any
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Context
const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        // Fetch user profile
        try {
          const profiles = await blink.db.user_profiles.list({
            where: { userId: state.user.id },
            limit: 1,
          })
          setAuthState({
            user: state.user,
            profile: profiles[0] || null,
            isLoading: false,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error('Error fetching profile:', error)
          setAuthState({
            user: state.user,
            profile: null,
            isLoading: false,
            isAuthenticated: true,
          })
        }
      } else {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

// Login function
export async function login(email: string, password: string) {
  const result = await blink.auth.signInWithEmail(email, password)
  return result
}

// Signup function with profile creation
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: 'customer' | 'farmer' | 'driver' = 'customer'
) {
  // Sign up with auth
  const user = await blink.auth.signUp({
    email,
    password,
    displayName,
  })

  // Create user profile
  if (user?.user?.id) {
    await blink.db.user_profiles.create({
      id: `up_${Date.now()}`,
      userId: user.user.id,
      role,
      displayName,
    })

    // If farmer, create farmer profile
    if (role === 'farmer') {
      const farmerId = `farmer_${Date.now()}`
      await blink.db.farmer_profiles.create({
        id: farmerId,
        userProfileId: `up_${Date.now() - 1}`,
        farmName: `${displayName}'s Farm`,
        joinedDate: new Date().toISOString(),
      })
    }
  }

  return user
}

// Sign out
export async function signOut() {
  await blink.auth.signOut()
}

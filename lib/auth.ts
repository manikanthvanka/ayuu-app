"use client"

import type { User } from "./types"
import { sampleUsers } from "./sample-data"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const checkUsernameAvailability = (username: string): boolean => {
  return !sampleUsers.some((user) => user.username.toLowerCase() === username.toLowerCase())
}



export const signUp = (userData: {
  email: string
  phone: string
  username: string
  fullName: string
  password: string
  role: "staff" | "doctor" | "admin"
}): User => {
  const newUser: User = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date(),
  }

  sampleUsers.push(newUser)
  return newUser
}

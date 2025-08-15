"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: any
  loading: boolean
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  } else {
    // Only set loading false, don't redirect yet
    setLoading(false);
  }
}, []);

useEffect(() => {
  // Redirect only if user is null AND page requires authentication
  if (!loading && !user && pathname !== "/" && pathname !== "/auth/sign-up") {
    router.push("/");
  }
}, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

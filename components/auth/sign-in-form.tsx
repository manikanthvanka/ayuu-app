"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { signIn, getRoles } from "@/lib/authx"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"
import { useAuth } from "@/components/auth/AuthProvider"
import { LoginFormData, Role } from "@/lib/types"

export function SignInForm({ className, ...props }: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [mounted, setMounted] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const router = useRouter()
  const { setLoading } = useGlobalLoading()
  const { setUser } = useAuth()

  // Fetch roles once on mount
  useEffect(() => {
    localStorage.removeItem("user") // Clear any existing user data
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true)
        const fetchedRoles = await getRoles()
        setRoles(fetchedRoles)
      } catch (err: any) {
        console.error("❌ Failed to fetch roles:", err.message)
        setError("Failed to load roles. Please refresh.")
      } finally {
        setLoadingRoles(false)
        setMounted(true) // mark mounted after roles fetch
      }
    }
    fetchRoles()
  }, [])

  // Prevent rendering on server to avoid hydration mismatch
  if (!mounted) return null

  // Show loader if roles are still loading
  if (loadingRoles) return <div>Loading...</div>
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) {
      setError("Please select a role")
      return
    }
    setLoading(true)
    setError("")
    const loginFormData: LoginFormData = { username, password, role }
    try {
      const signInResponse = await signIn(loginFormData);
      localStorage.setItem("user", JSON.stringify(signInResponse));
      setUser(signInResponse) // update AuthContext
      router.push("/dashboard")
    } catch (err: any) {
      console.error("❌ Login error:", err.message)
      setError(err.message)
      setLoading(false)
    } 
  }

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4">
        {/* Username */}
        <div className="grid">
          <Label htmlFor="username"></Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10"
              autoFocus
              placeholder="Username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password"></Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
              placeholder="Password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle Password Visibility"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Role selection */}
        <div className="grid gap-3">
          <Label>Select Your Role</Label>
          <div className="grid gap-2">
            {roles.map((roleOption) => (
              <div
                key={roleOption.id}
                className={cn(
                  "relative flex cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:shadow-sm",
                  role === roleOption.id
                    ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-border/50"
                )}
                onClick={() => setRole(roleOption.id)}
              >
                <input
                  type="radio"
                  name="role"
                  aria-label="Role Selection"
                  value={roleOption.id}
                  checked={role === roleOption.id}
                  onChange={(e) => setRole(e.target.value)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary focus:ring-primary border-border"
                />
                <div className="ml-8 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{roleOption.role_name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{roleOption.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={!role}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
